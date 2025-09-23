import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { quizConfig } from '../../config/quiz.config';
import { storeQuizAnswer } from '../../core/utils/session';

interface ClockworkHeroProps {
  onQuizStart: () => void;
}

export const ClockworkHero: React.FC<ClockworkHeroProps> = ({ onQuizStart }) => {
  const [selectedAmount, setSelectedAmount] = useState<string>('');
  
  // Get the first question from quiz config
  const firstQuestion = quizConfig.steps[0];
  
  const handleAmountSelect = (value: string, label: string) => {
    setSelectedAmount(label);
    // Store the answer
    storeQuizAnswer(firstQuestion.id, value);
    // Open the quiz overlay immediately to continue with remaining questions
    onQuizStart();
  };

  // Scroll to Q1 section
  const scrollToQ1 = () => {
    const q1Element = document.getElementById('q1-section');
    if (q1Element) {
      q1Element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
    }
  };

  // Handle CTA clicks from other components
  const handleCTAClick = () => {
    if (selectedAmount) {
      // If Q1 is already selected, open quiz overlay
      onQuizStart();
    } else {
      // If Q1 is not selected, scroll to Q1
      scrollToQ1();
    }
  };

  // Expose the handler to parent component
  React.useEffect(() => {
    (window as any).handleCTAClick = handleCTAClick;
    return () => {
      delete (window as any).handleCTAClick;
    };
  }, [selectedAmount, onQuizStart]);
  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center">
          {/* Logo */}
          <div className="flex items-center justify-center mb-12">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-16 h-16 bg-clockwork-orange-500 rounded-full flex items-center justify-center">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-clockwork-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="text-left">
                <h1 className="text-4xl font-bold text-clockwork-blue-600 tracking-wide">
                  CLOCKWORK
                </h1>
                <h2 className="text-4xl font-bold text-clockwork-blue-600 tracking-wide -mt-2">
                  FUNDING
                </h2>
              </div>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-clockwork-orange-500 mb-8 leading-tight">
            Unlock Large-Scale Uncapped<br />
            Business Funding, in Excess of<br />
            <span className="text-clockwork-orange-600">$1,000,000</span>
          </h1>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-xl md:text-2xl text-gray-700 mb-6">
              That's right! There is <span className="font-bold text-gray-900">NO CAP</span> to the competitively low-interest
              funding you can qualify for if you have a 640+ credit score, at least
              1 year in business, and a profitable track record.
            </p>
            
            <div className="flex items-start justify-center gap-3 text-lg md:text-xl text-gray-800 mb-8">
              <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-white text-sm font-bold">✓</span>
              </div>
              <p className="text-left">
                <span className="font-bold">Ask about our no-credit, revenue-based financing option,</span><br />
                available for high-performing companies!
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div id="q1-section" className="max-w-2xl mx-auto">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                {firstQuestion.question}
              </h3>
              <p className="text-gray-600 text-center mb-6">
                {firstQuestion.helper}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {firstQuestion.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAmountSelect(option.value, option.label)}
                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:border-clockwork-orange-500 hover:bg-clockwork-orange-50 ${
                      selectedAmount === option.label 
                        ? 'border-clockwork-orange-500 bg-clockwork-orange-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    <span className="font-semibold text-gray-900">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="max-w-3xl mx-auto mt-12">
            <p className="text-sm text-gray-600 italic leading-relaxed">
              <strong>Note:</strong> Funding terms, approval amounts, and interest rates vary based on your credit
              profile, business structure, and timing of application. All funding estimates are based on
              current lender data and may be adjusted as new offers or documentation become
              available. Final terms are confirmed after full review and lender approval.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};