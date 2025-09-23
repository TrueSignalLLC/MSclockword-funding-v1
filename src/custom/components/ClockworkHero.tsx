import React, { useState } from 'react';
import { ChevronDown, Settings } from 'lucide-react';

interface ClockworkHeroProps {
  onQuizStart: () => void;
}

export const ClockworkHero: React.FC<ClockworkHeroProps> = ({ onQuizStart }) => {
  const [selectedAmount, setSelectedAmount] = useState('Amount');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const amountOptions = [
    '$50,000 - $100,000',
    '$100,000 - $250,000',
    '$250,000 - $500,000',
    '$500,000 - $1,000,000',
    '$1,000,000+'
  ];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setIsDropdownOpen(false);
  };

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
          <div className="max-w-md mx-auto">
            <div className="relative mb-4">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full bg-white border-2 border-gray-300 rounded-lg px-6 py-4 text-left text-gray-600 text-lg flex items-center justify-between hover:border-gray-400 transition-colors"
              >
                {selectedAmount}
                <ChevronDown className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 bg-white border-2 border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                  {amountOptions.map((amount, index) => (
                    <button
                      key={index}
                      onClick={() => handleAmountSelect(amount)}
                      className="w-full px-6 py-3 text-left text-gray-700 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={onQuizStart}
              className="w-full bg-clockwork-orange-500 hover:bg-clockwork-orange-600 text-white font-bold text-xl py-4 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Get Qualified
            </button>
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