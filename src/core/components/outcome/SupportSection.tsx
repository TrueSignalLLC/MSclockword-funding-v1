import React from 'react';
import { Phone, Mail } from 'lucide-react';

interface SupportSectionProps {
  config: {
    title: string;
    subtitle: string;
    phone: string;
    email: string;
    hours: string;
  };
}

export const SupportSection: React.FC<SupportSectionProps> = ({ config }) => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {config.title}
        </h3>
        <p className="text-gray-600 mb-8">
          {config.subtitle}
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          <a 
            href={`tel:${config.phone}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <Phone className="w-5 h-5" />
            (833) 556-8550
          </a>
          <span className="text-gray-400">•</span>
          <a 
            href={`mailto:${config.email}`}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold"
          >
            <Mail className="w-5 h-5" />
            {config.email}
          </a>
        </div>
        
        <p className="text-sm text-gray-500">
          Hours: {config.hours}
        </p>
      </div>
    </section>
  );
};