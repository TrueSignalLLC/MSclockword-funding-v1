import React from 'react';
import { TrendingUp, Calculator, DollarSign, MapPin, Handshake } from 'lucide-react';

interface OurApproachProps {
  onQuizStart: () => void;
}

export const OurApproach: React.FC<OurApproachProps> = ({ onQuizStart }) => {
  const approaches = [
    {
      icon: <TrendingUp className="w-8 h-8" />,
      text: 'We provide substantial low-interest funding to qualifying companies.'
    },
    {
      icon: <Calculator className="w-8 h-8" />,
      text: 'We mainly base our approvals on your personal credit and business tenure.'
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      text: 'We offer revenue-based financing, which disregards your credit score.'
    },
    {
      icon: <MapPin className="w-8 h-8" />,
      text: 'Typical clients receive 6 to 8-figures in capital.'
    },
    {
      icon: <Handshake className="w-8 h-8" />,
      text: 'No upfront fees or broker kickbacks — we only win when you do.'
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-8">
            Our Approach is Simple:
          </h2>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-gray-200">
          <div className="space-y-8">
            {approaches.map((approach, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-12 h-12 bg-clockwork-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0">
                  {approach.icon}
                </div>
                <p className="text-lg text-gray-800 leading-relaxed pt-2">
                  {approach.text}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 mt-12 pt-8">
            <div className="text-center">
              <button
                onClick={onQuizStart}
                className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 text-white font-bold text-xl py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Apply for Funding
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};