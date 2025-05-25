import { motion } from 'framer-motion';
import { GlassCard } from './ui/GlassCard';
import { NeonButton } from './ui/NeonButton';

type WelcomeScreenProps = {
  onStart: () => void;
};

const WelcomeScreen = ({ onStart }: WelcomeScreenProps) => {
  return (
    <GlassCard>
      <div className="relative z-10 text-center py-10">
        <motion.div 
          className="animate-float" 
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="mx-auto w-40 h-40 relative mb-8">
            <motion.div 
              className="absolute inset-0 rounded-full bg-neon-blue opacity-10"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.div 
              className="absolute inset-2 rounded-full bg-neon-blue opacity-20"
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.div 
              className="absolute inset-4 rounded-full bg-neon-blue opacity-30"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 1 }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.span 
                className="material-icons text-5xl text-neon-blue"
                animate={{ 
                  textShadow: [
                    "0 0 5px #00D9FF, 0 0 10px #00D9FF", 
                    "0 0 15px #00D9FF, 0 0 20px #00D9FF", 
                    "0 0 5px #00D9FF, 0 0 10px #00D9FF"
                  ] 
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                auto_awesome
              </motion.span>
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold mb-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="text-neon-blue neon-text" style={{ "--color": "#00D9FF" } as React.CSSProperties}>NEXUS</span>{" "}
          <span className="text-neon-purple neon-text" style={{ "--color": "#B794F4" } as React.CSSProperties}>AD</span>{" "}
          <span className="text-neon-green neon-text" style={{ "--color": "#00FF88" } as React.CSSProperties}>FORGE</span>
        </motion.h1>
        
        <motion.p 
          className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          The future of Facebook ad creation powered by advanced AI. Generate compelling ads in seconds with our neural-enhanced system.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <NeonButton 
            color="blue" 
            size="lg" 
            onClick={onStart}
            icon={<span className="material-icons">arrow_forward</span>}
          >
            BEGIN
          </NeonButton>
        </motion.div>
        
        <motion.div 
          className="mt-12 flex justify-center space-x-4 text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <span className="flex items-center">
            <span className="material-icons mr-1 text-neon-blue">verified</span> AI Powered
          </span>
          <span className="flex items-center">
            <span className="material-icons mr-1 text-neon-purple">bolt</span> Fast Results
          </span>
          <span className="flex items-center">
            <span className="material-icons mr-1 text-neon-green">enhance_photo_translate</span> Custom Templates
          </span>
        </motion.div>
      </div>
    </GlassCard>
  );
};

export default WelcomeScreen;
