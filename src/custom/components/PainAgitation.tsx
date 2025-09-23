import React from 'react';

export const PainAgitation: React.FC = () => {
  return (
    <section className="py-20 bg-red-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">
          The Hidden Cost of 'We'll Be Fine'
        </h2>
        <p className="text-xl text-gray-600 mb-12">
          While you're researching, comparing, and procrastinating...
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl font-bold text-red-600 mb-2">2.5 million</div>
            <p className="text-gray-700">break-ins happen annually in the U.S.</p>
            <p className="text-sm text-red-500 mt-2">That's 7 every minute</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl font-bold text-red-600 mb-2">65%</div>
            <p className="text-gray-700">of break-ins happen during the day</p>
            <p className="text-sm text-red-500 mt-2">When you think you're safe</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <div className="text-3xl font-bold text-red-600 mb-2">8 minutes</div>
            <p className="text-gray-700">average time burglars spend inside</p>
            <p className="text-sm text-red-500 mt-2">Enough to destroy your peace of mind</p>
          </div>
        </div>
      </div>
    </section>
  );
};