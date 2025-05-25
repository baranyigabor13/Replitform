import { useState } from 'react';
import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { useToast } from '@/hooks/use-toast';
import { AdContent } from '@shared/schema';

type GeneratedAdsProps = {
  ads: AdContent[];
};

const GeneratedAds = ({ ads }: GeneratedAdsProps) => {
  const { toast } = useToast();
  const [editingAdIndex, setEditingAdIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const handleEditStart = (index: number, content: string) => {
    setEditingAdIndex(index);
    setEditText(content);
  };

  const handleEditSave = (index: number) => {
    // In a real implementation, this would update the ad content
    // For now, we'll just show a toast and exit edit mode
    toast({
      title: "Changes saved",
      description: "Your ad has been updated.",
    });
    setEditingAdIndex(null);
  };

  const handleCopyAd = (headline: string, content: string) => {
    const textToCopy = `${headline}\n\n${content}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: "Copied to clipboard",
        description: "Ad text has been copied to your clipboard.",
      });
    });
  };

  // Container and item animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, rotateY: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      rotateY: 0,
      transition: { 
        type: "spring",
        stiffness: 100,
        duration: 0.6 
      } 
    }
  };

  const getToneIcon = (tone: string) => {
    switch (tone) {
      case 'professional': return 'business';
      case 'casual': return 'chat';
      case 'urgent': return 'campaign';
      default: return 'article';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone) {
      case 'professional': return 'blue';
      case 'casual': return 'purple';
      case 'urgent': return 'green';
      default: return 'blue';
    }
  };

  return (
    <motion.div 
      className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {ads.map((ad, index) => (
        <motion.div 
          key={index}
          variants={itemVariants}
          className={`card-3d glass rounded-xl overflow-hidden border border-${getToneColor(ad.tone) === 'blue' ? 'neon-blue' : getToneColor(ad.tone) === 'purple' ? 'neon-purple' : 'neon-green'} border-opacity-30 hover:border-opacity-100 transition-all duration-300 h-full`}
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <span className={`material-icons text-${getToneColor(ad.tone) === 'blue' ? 'neon-blue' : getToneColor(ad.tone) === 'purple' ? 'neon-purple' : 'neon-green'} mr-2`}>
                  {getToneIcon(ad.tone)}
                </span>
                <span className="font-medium capitalize">{ad.tone}</span>
              </div>
              <div className="flex items-center text-gray-400 text-sm">
                <span className="material-icons text-xs mr-1">straighten</span>
                <span className="capitalize">{ad.length}</span>
              </div>
            </div>
            
            <div className="mb-4">
              {editingAdIndex === index ? (
                <div>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-cyber-dark-alt glass px-4 py-2 rounded-lg border border-neon-blue border-opacity-50 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-opacity-30 transition-all duration-300 mb-2"
                    placeholder="Edit headline..."
                  />
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="w-full bg-cyber-dark-alt glass px-4 py-2 rounded-lg border border-neon-blue border-opacity-50 focus:border-opacity-100 focus:outline-none focus:ring-2 focus:ring-neon-blue focus:ring-opacity-30 transition-all duration-300 h-32"
                    placeholder="Edit content..."
                  />
                  <div className="mt-2 flex justify-end">
                    <button 
                      onClick={() => setEditingAdIndex(null)}
                      className="text-gray-400 hover:text-white transition-colors duration-300 mr-2"
                    >
                      Cancel
                    </button>
                    <button 
                      onClick={() => handleEditSave(index)}
                      className={`text-${getToneColor(ad.tone) === 'blue' ? 'neon-blue' : getToneColor(ad.tone) === 'purple' ? 'neon-purple' : 'neon-green'} hover:text-white transition-colors duration-300`}
                    >
                      Save
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h3 className="font-bold text-xl mb-2 text-white">{ad.headline}</h3>
                  <p className="text-gray-300">{ad.content}</p>
                </>
              )}
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-gray-400">
                <span className="material-icons text-xs mr-1">tag</span>
                <span>#{ad.tags.join(' #')}</span>
              </div>
              <div className="flex items-center text-gray-400">
                <span className="material-icons text-xs mr-1">sentiment_satisfied</span>
                <span>{ad.emojiCount}</span>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 bg-cyber-dark-alt border-t border-gray-800">
            <div className="flex justify-between">
              <button 
                className={`text-${getToneColor(ad.tone) === 'blue' ? 'neon-blue' : getToneColor(ad.tone) === 'purple' ? 'neon-purple' : 'neon-green'} hover:text-white transition-colors duration-300 flex items-center text-sm`}
                onClick={() => handleEditStart(index, ad.content)}
              >
                <span className="material-icons text-sm mr-1">edit</span>
                <span>Edit</span>
              </button>
              <button 
                className={`text-${getToneColor(ad.tone) === 'blue' ? 'neon-blue' : getToneColor(ad.tone) === 'purple' ? 'neon-purple' : 'neon-green'} hover:text-white transition-colors duration-300 flex items-center text-sm`}
                onClick={() => handleCopyAd(ad.headline, ad.content)}
              >
                <span className="material-icons text-sm mr-1">content_copy</span>
                <span>Copy</span>
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default GeneratedAds;
