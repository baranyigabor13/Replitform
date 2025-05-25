import { useEffect } from 'react';
import { motion } from 'framer-motion';
import DynamicField from './DynamicField';
import { Question } from '@shared/schema';

type FormStepProps = {
  questions: Question[];
  formData: Record<string, any>;
  updateFormData: (key: string, value: any) => void;
};

const FormStep = ({ questions, formData, updateFormData }: FormStepProps) => {
  // Container and item animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {questions.map((question, index) => (
        <motion.div 
          key={question.id} 
          variants={itemVariants}
          className={`glass rounded-xl p-6 border border-opacity-20 ${
            question.color === 'blue' 
              ? 'border-neon-blue' 
              : question.color === 'purple' 
                ? 'border-neon-purple' 
                : 'border-neon-green'
          } tilt-card`}
        >
          <DynamicField
            question={question}
            value={formData[question.id]}
            onChange={(value) => updateFormData(question.id, value)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default FormStep;
