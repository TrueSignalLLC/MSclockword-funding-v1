import React from 'react';

interface ComparisonSectionProps {
  onQuizStart: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onQuizStart }) => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
          Stop Wasting Weeks on Security Research
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          We've Already Done the Hard Work
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-red-50 p-8 rounded-lg border-2 border-red-200">
            <h3 className="text-2xl font-bold text-red-700 mb-4">The Old Way (3+ Weeks)</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Google 'best home security' → 2.5 million results</li>
              <li>• Schedule 5+ sales appointments</li>
              <li>• Sit through 90-minute pressure pitches</li>
              <li>• Compare 47 different companies</li>
              <li>• Still confused and unprotected</li>
            </ul>
            <p className="text-red-600 font-semibold mt-4">Weeks of stress</p>
          </div>
          
          <div className="bg-green-50 p-8 rounded-lg border-2 border-green-200">
            <h3 className="text-2xl font-bold text-green-700 mb-4">The YourHomeSecured Way (60 Seconds)</h3>
            <ul className="space-y-3 text-gray-700">
              <li>• Answer 5 simple questions</li>
              <li>• Get 3 perfect matches for YOUR home</li>
              <li>• See real prices upfront</li>
              <li>• Connect only when YOU'RE ready</li>
              <li>• Protected in 48 hours</li>
            </ul>
            <p className="text-green-600 font-semibold mt-4">Peace of mind today</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button
            onClick={onQuizStart}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors"
          >
            Start My Assessment Now
          </button>
        </div>
      </div>
    </section>
  );
};