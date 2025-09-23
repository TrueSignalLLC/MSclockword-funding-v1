import React, { useState } from 'react';
import { Phone, Calendar, Zap } from 'lucide-react';

interface PricingActionProps {
  config: {
    title: string;
    startingPrice: string;
    priceLabel: string;
    pricePeriod: string;
    features: string[];
    urgencyMessage: string;
    primaryCta: {
      text: string;
      phone: string;
    };
    secondaryCta: {
      text: string;
    };
  };
  userData: {
    firstName: string;
    city: string;
    zip: string;
    homeType: string;
  };
}

export const PricingAction: React.FC<PricingActionProps> = ({ config, userData }) => {
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  
  // Replace placeholders in urgency message
  const urgencyMessage = config.urgencyMessage.replace('{city}', userData.city);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-12">
          {config.title}
        </h2>
        
        {/* Pricing Card */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-10 mb-10 border border-blue-100">
          <span className="text-gray-700 text-xl font-medium">{config.priceLabel}</span>
          <div className="text-6xl font-bold text-blue-600 my-6">
            {config.startingPrice}
          </div>
          <span className="text-gray-700 text-xl">{config.pricePeriod}</span>
          
          <ul className="mt-8 space-y-4">
            {config.features.map((feature, index) => (
              <li 
                key={index} 
                className={`flex items-center justify-center text-lg ${
                  feature.includes('$100 Visa') ? 'text-orange-600 font-bold' : 'text-gray-700'
                }`}
              >
                <span className="text-green-500 mr-3 text-xl">✓</span>
                {feature}
              </li>
            ))}
          </ul>
          
          {/* Visa Offer Section */}
          {config.visaOffer && (
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-6">
              <div className="flex items-center justify-center gap-4 mb-4">
                <img 
                  src={config.visaOffer.cardImage} 
                  alt="Visa Reward Card" 
                  className="w-16 h-10 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
                <h3 className="text-xl font-bold text-blue-800">{config.visaOffer.title}</h3>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed text-center">
                {config.visaOffer.disclaimer}
              </p>
            </div>
          )}
          
          <div className="mt-8 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-xl p-4 flex items-center justify-center gap-3">
            <Zap className="w-6 h-6 text-red-600" />
            <span className="text-red-700 font-bold text-lg">{urgencyMessage}</span>
          </div>
        </div>
        
        {/* CTA Buttons */}
        {!showCallbackForm ? (
          <div className="space-y-6">
            <a
              href={`tel:${config.primaryCta.phone}`}
              className="inline-flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold text-2xl px-12 py-5 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <Phone className="w-7 h-7" />
              Call Now: (833) 556-8550
            </a>
            
            <div>
              <button
                onClick={() => setShowCallbackForm(true)}
                className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold text-lg transition-colors"
              >
                <Calendar className="w-5 h-5" />
                {config.secondaryCta.text}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl p-8 max-w-md mx-auto shadow-lg border border-gray-200">
            <h3 className="text-2xl font-bold mb-6">Schedule Your Callback</h3>
            <form className="space-y-5">
              <select className="w-full p-4 border border-gray-300 rounded-lg text-lg">
                <option>Select preferred time</option>
                <option>Morning (9 AM - 12 PM)</option>
                <option>Afternoon (12 PM - 5 PM)</option>
                <option>Evening (5 PM - 8 PM)</option>
              </select>
              <input
                type="tel"
                placeholder="Phone number"
                className="w-full p-4 border border-gray-300 rounded-lg text-lg"
              />
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowCallbackForm(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-4 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};