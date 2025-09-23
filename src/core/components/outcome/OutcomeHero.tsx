import React from 'react';
import { ShieldCheck, Edit } from 'lucide-react';

interface OutcomeHeroProps {
  config: {
    headline: string;
    subheadline: string;
    confirmationIcon: string;
    matchCard: {
      matchScore: string;
      provider: string;
      installation: string;
      monthlyRate: string;
      promotion: {
        label: string;
        text: string;
      };
    };
  };
  userData: {
    firstName: string;
    city: string;
    zip: string;
    homeType: string;
  };
}

export const OutcomeHero: React.FC<OutcomeHeroProps> = ({ config, userData }) => {
  // Replace placeholders in headline
  const personalizedHeadline = config.headline
    .replace('{firstName}', userData.firstName)
    .replace('{city}', userData.city);

  const getConfirmationIcon = () => {
    switch (config.confirmationIcon) {
      case 'shield-check':
        return <ShieldCheck className="w-12 h-12 text-green-500" />;
      default:
        return <ShieldCheck className="w-12 h-12 text-green-500" />;
    }
  };

  return (
    <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          {/* Success Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-3 shadow-lg">
              {getConfirmationIcon()}
            </div>
          </div>

          {/* Personalized Headline */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {personalizedHeadline}
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            {config.subheadline}
          </p>
        </div>

        {/* Match Summary Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-2xl p-8 text-gray-900">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <img 
                src="/ADT (1).jpg" 
                alt="ADT" 
                className="h-8 w-8 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <h3 className="text-2xl font-bold">Your Security Match Details</h3>
            </div>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {config.matchCard.matchScore}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="text-sm text-gray-500">Provider:</label>
              <div className="font-bold text-lg">{config.matchCard.provider}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Your Location:</label>
              <div className="font-bold text-lg">{userData.city}, {userData.zip}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Installation:</label>
              <div className="font-bold text-lg">{config.matchCard.installation}</div>
            </div>
            <div>
              <label className="text-sm text-gray-500">Monthly Monitoring:</label>
              <div className="font-bold text-lg">{config.matchCard.monthlyRate}</div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-orange-800 font-semibold text-sm">{config.matchCard.promotion.label}</span>
              <span className="text-orange-700 ml-2">{config.matchCard.promotion.text}</span>
            </div>
            <div className="flex items-center gap-2">
              <img 
                src="/visa-card.png" 
                alt="Visa Card" 
                className="w-8 h-5 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 font-medium transition-colors">
              <Edit className="w-4 h-4" />
              Edit details
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};