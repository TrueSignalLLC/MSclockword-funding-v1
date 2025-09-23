import React from 'react';

interface FundWhatOthersWontProps {
  onQuizStart: () => void;
}

export const FundWhatOthersWont: React.FC<FundWhatOthersWontProps> = ({ onQuizStart }) => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6 text-center lg:text-left">
              We Fund What Even Traditional<br />
              Lenders Won't Touch
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                Whether your business model is asset-heavy, or your assessment plans require serious capital investment, we've already covered it.
              </p>
              
              <p>
                From manufacturers and construction firms to consultants and service-based ventures, we structure custom funding solutions that align with your operational realities and growth plans.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Professional businessman using phone"
              className="w-full max-w-md h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <button
            onClick={onQuizStart}
            className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 text-white font-bold text-xl py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Apply for Funding
          </button>
        </div>
      </div>
    </section>
  );
};