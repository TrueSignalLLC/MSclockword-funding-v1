import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { quizConfig } from '../../config/quiz.config';
import { storeQuizAnswer } from '../../core/utils/session';

export const ClockworkHero: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFundingAmount, setSelectedFundingAmount] = useState('');
  const [showFundingAmountError, setShowFundingAmountError] = useState(false);

  const handleGetQualified = () => {
    if (!selectedFundingAmount) {
      setShowFundingAmountError(true);
      return;
    }
    
    // Store the answer and navigate to quiz
    storeQuizAnswer('funding_amount', selectedFundingAmount);
    navigate('/quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Top Banner with Logo */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-clockwork-orange-500 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-clockwork-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-clockwork-blue-600">Clockwork Funding</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex items-center py-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-2 md:px-6">
          <div className="text-center">

          {/* Main Headline */}
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-clockwork-orange-500 mb-8 leading-tight text-center">
            Unlock Large-Scale Uncapped<br />
            Business Funding, in Excess of<br />
            <span className="text-clockwork-orange-600">$1,000,000</span>
          </h1>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-sm md:text-xl text-gray-700 mb-6">
              That's right! There is <span className="font-bold text-gray-900">NO CAP</span> to the competitively low-interest
              funding you can qualify for if you have a 640+ credit score, at least
              1 year in business, and a profitable track record.
            </p>
            
            <div className="flex items-start justify-center gap-3 text-sm md:text-lg text-gray-800 mb-8 order-3 md:order-none">
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
          <div id="hero-form" className="max-w-2xl mx-auto order-2 md:order-none mb-8">
            <div className="bg-clockwork-orange-100 rounded-2xl shadow-xl p-8 border border-gray-200">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {quizConfig.steps[0].question}
                  </h3>
                  {quizConfig.steps[0].helper && (
                    <p className="text-gray-700 mb-6">
                      {quizConfig.steps[0].helper}
                    </p>
                  )}
                </div>

                <div className="max-w-md mx-auto space-y-4">
                  <select
                    value={selectedFundingAmount}
                    onChange={(e) => {
                      setSelectedFundingAmount(e.target.value);
                      setShowFundingAmountError(false);
                    }}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent bg-white ${
                      showFundingAmountError ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="" disabled>Amount</option>
                    {quizConfig.steps[0].options?.map((option: any, index: number) => (
                      <option key={index} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  {showFundingAmountError && (
                    <p className="text-red-500 text-sm text-center">
                      Please select a funding amount to continue
                    </p>
                  )}

                  <button
                    onClick={handleGetQualified}
                    className="w-full bg-clockwork-orange-500 hover:bg-clockwork-orange-600 text-white font-bold text-xl py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Get Qualified
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Moved checkmark section below quiz on mobile */}
          <div className="flex items-start justify-center gap-3 text-sm md:text-lg text-gray-800 mb-8 order-4 md:hidden">
            <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-1">
              <span className="text-white text-sm font-bold">✓</span>
            </div>
            <p className="text-left">
              <span className="font-bold">Ask about our no-credit, revenue-based financing option,</span><br />
              available for high-performing companies!
            </p>
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
    </div>
  );
};