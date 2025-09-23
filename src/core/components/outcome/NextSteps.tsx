import React from 'react';
import { Clock, Phone, Calendar, Wrench } from 'lucide-react';

interface NextStepsProps {
  steps: Array<{
    step: number;
    title: string;
    description: string;
    timeframe: string;
  }>;
}

export const NextSteps: React.FC<NextStepsProps> = ({ steps }) => {
  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <Phone className="w-12 h-12 text-blue-600 mb-4" />;
      case 2:
        return <Calendar className="w-12 h-12 text-blue-600 mb-4" />;
      case 3:
        return <Wrench className="w-12 h-12 text-blue-600 mb-4" />;
      default:
        return <Clock className="w-12 h-12 text-blue-600 mb-4" />;
    }
  };

  return (
    <section className="bg-white py-12 relative">
      <div className="max-w-5xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            What Happens Next
          </h2>
          <p className="text-lg text-gray-600">
            Your path to complete home protection in 3 simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Progression Line - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform -translate-y-1/2 z-0">
            <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Progression Line - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform -translate-y-1/2 z-0">
            <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Progression Line - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform -translate-y-1/2 z-0">
            <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {/* Progression Line - Hidden on mobile, visible on desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-200 via-blue-400 to-blue-600 transform -translate-y-1/2 z-0">
            <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute top-1/2 left-2/3 w-3 h-3 bg-blue-600 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
          </div>
          
          {steps.map((step) => (
            <div key={step.step} className={`${
              step.step === 1 ? 'relative p-[3px] rounded-xl animated-border-wrapper' : ''
            }`}>
              {step.step === 1 && (
                <div className="absolute inset-0 rounded-xl animate-gradient-border"></div>
              )}
              <div className="bg-white rounded-xl shadow-lg p-8 text-center hover:shadow-xl transition-shadow duration-300 relative z-10 h-full flex flex-col">
              <div className="flex flex-col items-center">
                {/* Step Icon */}
                {getStepIcon(step.step)}
                
                {/* Step Title */}
                <h3 className="text-xl font-semibold mb-3 text-gray-900">
                  {step.title}
                </h3>
                
                {/* Step Description */}
                <p className="text-gray-600 mb-4 px-2 flex-grow">
                  {step.description}
                </p>
                
                {/* Time Badge */}
                <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  {step.timeframe}
                </span>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};