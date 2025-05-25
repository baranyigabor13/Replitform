import { useState, useEffect } from 'react';
import { AnimatedInput, AnimatedTextarea } from './ui/AnimatedInput';
import { RadioCard } from './ui/RadioCard';
import { Question } from '@shared/schema';

type DynamicFieldProps = {
  question: Question;
  value: any;
  onChange: (value: any) => void;
};

const DynamicField = ({ question, value, onChange }: DynamicFieldProps) => {
  const handleRadioChange = (val: string) => {
    onChange(val);
  };

  const handleCheckboxChange = (option: string, checked: boolean) => {
    const currentValue = value || {};
    onChange({
      ...currentValue,
      [option]: checked
    });
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value));
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Render different field types based on question type
  switch (question.type) {
    case 'radio':
      return (
        <>
          <label className={`block text-lg font-medium mb-3 ${
            question.color === 'blue' 
              ? 'text-neon-blue' 
              : question.color === 'purple' 
                ? 'text-neon-purple' 
                : 'text-neon-green'
          }`}>
            {question.text}
          </label>
          <RadioCard
            options={question.options || []}
            color={question.color}
            name={question.id}
            value={value}
            onChange={handleRadioChange}
          />
        </>
      );
      
    case 'checkbox':
      return (
        <>
          <label className={`block text-lg font-medium mb-3 ${
            question.color === 'blue' 
              ? 'text-neon-blue' 
              : question.color === 'purple' 
                ? 'text-neon-purple' 
                : 'text-neon-green'
          }`}>
            {question.text}
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {question.options?.map((option) => (
              <div key={option.value} className="relative">
                <input 
                  type="checkbox" 
                  id={`${question.id}-${option.value}`} 
                  className="peer sr-only" 
                  checked={value?.[option.value] || false}
                  onChange={(e) => handleCheckboxChange(option.value, e.target.checked)}
                />
                <label 
                  htmlFor={`${question.id}-${option.value}`} 
                  className={`flex items-center glass rounded-lg p-4 border-2 border-transparent cursor-pointer transition-all duration-300 hover:border-${
                    question.color === 'blue' ? 'neon-blue' : question.color === 'purple' ? 'neon-purple' : 'neon-green'
                  } peer-checked:border-${
                    question.color === 'blue' ? 'neon-blue' : question.color === 'purple' ? 'neon-purple' : 'neon-green'
                  } peer-checked:bg-${
                    question.color === 'blue' ? 'neon-blue' : question.color === 'purple' ? 'neon-purple' : 'neon-green'
                  } peer-checked:bg-opacity-10`}
                >
                  <div className={`mr-3 w-5 h-5 rounded border-2 border-gray-400 peer-checked:border-${
                    question.color === 'blue' ? 'neon-blue' : question.color === 'purple' ? 'neon-purple' : 'neon-green'
                  } peer-checked:bg-${
                    question.color === 'blue' ? 'neon-blue' : question.color === 'purple' ? 'neon-purple' : 'neon-green'
                  } peer-checked:bg-opacity-30 flex items-center justify-center`}>
                    <span className="material-icons text-white text-sm scale-75 opacity-0 peer-checked:opacity-100">check</span>
                  </div>
                  <div>
                    <span className="font-medium">{option.label}</span>
                    {option.description && (
                      <p className="text-sm text-gray-400">{option.description}</p>
                    )}
                  </div>
                </label>
              </div>
            ))}
          </div>
        </>
      );

    case 'slider':
      return (
        <>
          <label htmlFor={question.id} className={`block text-lg font-medium mb-3 ${
            question.color === 'blue' 
              ? 'text-neon-blue' 
              : question.color === 'purple' 
                ? 'text-neon-purple' 
                : 'text-neon-green'
          }`}>
            {question.text}
          </label>
          <div className={`mb-2 text-right font-bold ${
            question.color === 'blue' 
              ? 'text-neon-blue' 
              : question.color === 'purple' 
                ? 'text-neon-purple' 
                : 'text-neon-green'
          }`} id="budget-value">${value || question.defaultValue || 50}</div>
          <div className="relative py-5">
            <div className="absolute inset-y-0 left-0 right-0 flex items-center">
              <div className="h-1 w-full bg-gray-700 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${
                  question.color === 'blue' 
                    ? 'bg-gradient-to-r from-neon-blue to-neon-purple' 
                    : question.color === 'purple' 
                      ? 'bg-gradient-to-r from-neon-purple to-neon-green' 
                      : 'bg-gradient-to-r from-neon-green to-neon-blue'
                }`} style={{width: `${((value || question.defaultValue || 50) - (question.min || 0)) / ((question.max || 100) - (question.min || 0)) * 100}%`}}></div>
              </div>
            </div>
            <input 
              type="range" 
              id={question.id} 
              min={question.min || 0} 
              max={question.max || 100} 
              value={value || question.defaultValue || 50} 
              onChange={handleSliderChange}
              className="appearance-none absolute inset-y-0 left-0 right-0 w-full m-0 p-0 cursor-pointer opacity-0" 
            />
            <div className="relative flex justify-between text-xs text-gray-400 px-2 mt-4">
              <span>${question.min || 0}</span>
              <span>${((question.max || 100) - (question.min || 0)) / 4 + (question.min || 0)}</span>
              <span>${((question.max || 100) - (question.min || 0)) / 2 + (question.min || 0)}</span>
              <span>${((question.max || 100) - (question.min || 0)) * 3/4 + (question.min || 0)}</span>
              <span>${question.max || 100}</span>
            </div>
          </div>
        </>
      );

    case 'text':
      if (question.multiline) {
        return (
          <AnimatedTextarea
            label={question.text}
            id={question.id}
            value={value || ''}
            onChange={handleTextChange}
            placeholder={question.placeholder || `Enter your answer here...`}
            color={question.color}
            rows={3}
          />
        );
      } else {
        return (
          <AnimatedInput
            label={question.text}
            id={question.id}
            value={value || ''}
            onChange={handleTextChange}
            placeholder={question.placeholder || `Enter your answer here...`}
            color={question.color}
          />
        );
      }

    default:
      return null;
  }
};

export default DynamicField;
