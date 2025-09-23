import React from 'react';

interface SimpleHowItWorksProps {
  onQuizStart: () => void;
}

export const SimpleHowItWorks: React.FC<SimpleHowItWorksProps> = ({ onQuizStart }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-6">
          From Worried to Protected in 3 Simple Steps
        </h2>
        <p className="text-xl text-center text-gray-600 mb-12">
          Most families go from quiz to protection in under 48 hours
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              1
            </div>
            <div className="text-sm text-blue-600 font-semibold mb-2">30 seconds</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Tell us about your home</h3>
            <p className="text-gray-600">ZIP code, home type, what worries you most</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              2
            </div>
            <div className="text-sm text-blue-600 font-semibold mb-2">30 seconds</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">See your perfect matches</h3>
            <p className="text-gray-600">3 options, real prices, clear comparisons</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
              3
            </div>
            <div className="text-sm text-blue-600 font-semibold mb-2">Your choice</div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Get protected on YOUR timeline</h3>
            <p className="text-gray-600">Install tomorrow or think about it — no pressure</p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <button
            onClick={onQuizStart}
            className="bg-green-600 hover:bg-green-700 text-white font-bold text-lg px-8 py-4 rounded-lg transition-colors"
          >
            Start My Protection Journey
          </button>
        </div>
      </div>
    </section>
  );
};