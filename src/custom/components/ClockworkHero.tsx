import React, { useState } from 'react';
import { Settings, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { quizConfig } from '../../config/quiz.config';
import { storeQuizAnswer } from '../../core/utils/session';

export const ClockworkHero: React.FC = () => {
  const navigate = useNavigate();
  const [selectedFundingAmount, setSelectedFundingAmount] = useState('');
  const [showFundingAmountError, setShowFundingAmountError] = useState(false);
  const [showAdvertisingDisclosure, setShowAdvertisingDisclosure] = useState(false);

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo__2_-removebg-preview.png" 
                alt="Clockwork Funding Logo" 
                className="w-[240px] h-[79px]"
              />
            </div>
            
            <button
              onClick={() => setShowAdvertisingDisclosure(true)}
              className="text-sm text-gray-600 hover:text-clockwork-blue-600 underline transition-colors"
            >
              Advertising Disclosure
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="flex items-center py-8 md:py-20 min-h-[calc(100vh-80px)]">
        <div className="max-w-6xl mx-auto px-2 md:px-6">
          <div className="text-center">

          {/* Main Headline */}
          <h1 className="text-2xl md:text-5xl lg:text-6xl font-bold text-clockwork-orange-500 mb-4 md:mb-8 leading-tight text-center">
            Unlock Large-Scale Uncapped<br />
            Business Funding, in Excess of<br />
            <span className="text-clockwork-orange-600">$1,000,000</span>
          </h1>

          {/* Description */}
          <div className="max-w-4xl mx-auto mb-8">
            <p className="text-sm md:text-xl text-gray-700 mb-6">
            </p>
            <p className="text-xs md:text-lg text-gray-700 mb-6">
              That's right! There is <span className="font-bold text-gray-900">NO CAP</span> to the competitively low-interest
              funding you can qualify for if you have at least $500k in annual revenue,
              12 months in business, and a profitable track-record.
            </p>
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
                  <div className="space-y-4">
                    <select
                      value={selectedFundingAmount}
                      onChange={(e) => {
                        setSelectedFundingAmount(e.target.value);
                        setShowFundingAmountError(false);
                      }}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl text-center text-lg font-semibold bg-white focus:border-clockwork-orange-500 focus:ring-2 focus:ring-clockwork-orange-500 focus:outline-none"
                    >
                      <option value="">Select funding amount...</option>
                      {quizConfig.steps[0].options?.map((option: any, index: number) => (
                        <option key={index} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    
                    {showFundingAmountError && (
                      <p className="text-red-600 text-sm text-center">
                        Please select a funding amount to continue
                      </p>
                    )}
                    
                    <button
                      onClick={handleGetQualified}
                      className="w-full bg-clockwork-orange-500 hover:bg-clockwork-orange-600 disabled:bg-gray-400 text-white font-bold text-xl py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                      disabled={!selectedFundingAmount}
                    >
                      Apply For Funding
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Moved checkmark section below quiz on mobile */}
          <div className="flex items-start gap-3 text-sm md:text-lg text-gray-800 mb-8 order-4 md:hidden px-4">
            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg mt-1">
              <span className="text-white text-xs font-bold">✓</span>
            </div>
            <div className="text-left leading-relaxed">
              <p className="font-bold mb-1">Ask about our no-FICO, revenue-based financing option,</p>
              <p>available for high-performing companies!</p>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="max-w-3xl mx-auto mt-12">
            <p className="hidden md:block text-sm text-gray-600 italic leading-relaxed">
              <strong>Note:</strong> Funding terms, approval amounts, and interest rates vary based on your credit
              profile, business structure, and timing of application. All funding estimates are based on
              current lender data and may be adjusted as new offers or documentation become
              available. Final terms are confirmed after full review and lender approval.
            </p>
          </div>
        </div>
        </div>
      </section>
      
      {/* Advertising Disclosure Popup */}
      {showAdvertisingDisclosure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Advertising Disclosure</h2>
              <button
                onClick={() => setShowAdvertisingDisclosure(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                The offers that appear are from companies which we receive compensation. This compensation may influence the selection, appearance, and order of appearance of the offers listed below. However, this compensation also facilitates the provision of certain services to you at no charge. The offers displayed in your results do not include all financial services companies or all of their available product and service offerings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};