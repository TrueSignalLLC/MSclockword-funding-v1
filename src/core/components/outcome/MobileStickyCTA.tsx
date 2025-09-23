import React from 'react';
import { Phone } from 'lucide-react';

interface MobileStickyCTAProps {
  config: {
    text: string;
    phone: string;
  };
}

export const MobileStickyCTA: React.FC<MobileStickyCTAProps> = ({ config }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-green-600 p-4 shadow-lg">
      <a
        href={`tel:${config.phone}`}
        className="flex items-center justify-center gap-2 text-white font-bold text-lg"
      >
        <Phone className="w-5 h-5" />
        Call ADT Now: (833) 556-8550
      </a>
    </div>
  );
};