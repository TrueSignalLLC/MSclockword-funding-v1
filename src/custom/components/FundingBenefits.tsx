import React from 'react';
import { CheckCircle } from 'lucide-react';

interface FundingBenefitsProps {
  onQuizStart: () => void;
}

export const FundingBenefits: React.FC<FundingBenefitsProps> = ({ onQuizStart }) => {
  const benefits = [
    'Acquire competitors',
    'Open more locations',
    'Expand operations',
    'Purchase inventory',
    'Upgrade equipment',
    'Boost marketing efforts',
    'Or simply cover day-to-day operational expenses'
  ];

  return (
    <section className="py-20 bg-clockwork-orange-500">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-white">
            <h2 className="text-4xl md:text-5xl font-bold text-clockwork-blue-600 mb-8">
              We've Provided Over $70 Million<br />
              in Business Funding
            </h2>
            
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6">
                And We Can Help You Too<br />
                So You Can:
              </h3>
              
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-white flex-shrink-0" />
                    <span className="text-lg font-medium">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Column - Visual */}
          <div className="flex justify-center">
            <div className="relative">
              {/* Blue Circle Background */}
              <div className="w-80 h-80 bg-clockwork-blue-600 rounded-full flex items-center justify-center">
                {/* Warehouse/Factory Icon */}
                <div className="text-clockwork-orange-500">
                  <svg width="200" height="150" viewBox="0 0 200 150" fill="currentColor">
                    {/* Factory Building */}
                    <rect x="40" y="60" width="120" height="80" fill="currentColor" />
                    <rect x="50" y="70" width="20" height="20" fill="#1e3a8a" />
                    <rect x="80" y="70" width="20" height="20" fill="#1e3a8a" />
                    <rect x="110" y="70" width="20" height="20" fill="#1e3a8a" />
                    <rect x="140" y="70" width="20" height="20" fill="#1e3a8a" />
                    
                    {/* Roof */}
                    <polygon points="30,60 100,30 170,60" fill="currentColor" />
                    
                    {/* Chimney */}
                    <rect x="120" y="20" width="15" height="40" fill="currentColor" />
                    
                    {/* Forklift */}
                    <rect x="10" y="100" width="30" height="15" fill="currentColor" />
                    <rect x="15" y="85" width="8" height="15" fill="currentColor" />
                    <circle cx="15" cy="120" r="5" fill="#1e3a8a" />
                    <circle cx="35" cy="120" r="5" fill="#1e3a8a" />
                    
                    {/* Loading Dock */}
                    <rect x="160" y="100" width="30" height="40" fill="currentColor" />
                    <rect x="165" y="90" width="20" height="10" fill="#1e3a8a" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button
            onClick={onQuizStart}
            className="bg-clockwork-blue-600 hover:bg-clockwork-blue-700 text-white font-bold text-xl py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Apply For Funding
          </button>
        </div>
      </div>
    </section>
  );
};