import React from 'react';

interface TOFUFinalCTAProps {
  onQuizStart: () => void;
}

export const TOFUFinalCTA: React.FC<TOFUFinalCTAProps> = ({ onQuizStart }) => {
  return (
    <section className="py-20 bg-gradient-to-r from-red-600 to-red-700 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Every 26 Seconds You Wait, Another Home Gets Hit
        </h2>
        <p className="text-xl mb-8">
          Your family's safety is 60 seconds away
        </p>
        
        <button
          onClick={onQuizStart}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-xl px-10 py-5 rounded-lg transition-colors mb-6"
        >
          Start My Free Assessment Now
        </button>
        
        <p className="text-sm text-red-100 mb-8">
          Join 127 homeowners who started today
        </p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-300">✓</span>
            <span>100% Free Assessment</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-300">✓</span>
            <span>No Spam Calls</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-300">✓</span>
            <span>Real Prices Shown</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-green-300">✓</span>
            <span>Cancel Anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
};