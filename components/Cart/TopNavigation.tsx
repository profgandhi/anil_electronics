// components/Cart/TopNavigation.tsx

import React from 'react';

interface Step {
  name: string;
  status: 'completed' | 'current' | 'upcoming';
}

interface TopNavigationProps {
  currentStep: number; // 1: Cart, 2: Address, 3: Payment
}

const TopNavigation: React.FC<TopNavigationProps> = ({ currentStep }) => {
  const steps: Step[] = [
    { name: 'Cart', status: currentStep > 1 ? 'completed' : currentStep === 1 ? 'current' : 'upcoming' },
    { name: 'Address', status: currentStep > 2 ? 'completed' : currentStep === 2 ? 'current' : 'upcoming' },
    { name: 'Payment', status: currentStep === 3 ? 'current' : 'upcoming' },
  ];

  const getColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500 text-white';
      case 'current':
        return 'bg-red-500 text-white';
      case 'upcoming':
        return 'bg-gray-300 text-gray-700';
      default:
        return 'bg-gray-300 text-gray-700';
    }
  };

  return (
    <div className="flex justify-center my-6">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${getColor(step.status)}`}
          >
            {index + 1}
          </div>
          <span className="ml-2 text-sm font-medium">{step.name}</span>
          {index < steps.length - 1 && (
            <div className="flex-1 h-1 bg-gray-300 mx-2"></div>
          )}
        </div>
      ))}
    </div>
  );
};

export default TopNavigation;
