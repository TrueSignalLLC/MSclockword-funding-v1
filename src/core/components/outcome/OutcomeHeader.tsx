import React from 'react';
import { Phone } from 'lucide-react';

interface OutcomeHeaderProps {
  config: {
    partnerLogo: string;
    providerLogo: string;
    phone: string;
  };
}

export const OutcomeHeader: React.FC<OutcomeHeaderProps> = ({ config }) => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={config.partnerLogo} 
              alt="YourHomeSecured" 
              className="h-8"
            />
            <span className="text-2xl text-gray-400">×</span>
            <img 
              src={config.providerLogo} 
              alt="ADT" 
              className="h-8"
              onError={(e) => {
                // Fallback to text if logo fails to load
                e.currentTarget.style.display = 'none';
                const fallback = document.createElement('span');
                fallback.textContent = 'ADT';
                fallback.className = 'text-2xl font-bold text-blue-600';
                e.currentTarget.parentNode?.appendChild(fallback);
              }}
            />
          </div>
          <a 
            href={`tel:${config.phone}`}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Phone className="w-4 h-4" />
            (833) 556-8550
          </a>
        </div>
      </div>
    </nav>
  );
};