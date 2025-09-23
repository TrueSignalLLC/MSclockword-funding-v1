import React from 'react';
import { CheckCircle, DollarSign, Shield, Gift } from 'lucide-react';

interface ProviderMatchProps {
  config: {
    title: string;
    points: string[];
  };
  pricing: {
    startingPrice: string;
    installationFee: string;
    promotion: string;
    insuranceSavings: string;
  };
}

export const ProviderMatch: React.FC<ProviderMatchProps> = ({ config, pricing }) => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          
          {/* Match Details */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {config.title}
            </h2>
            
            <div className="space-y-4">
              {config.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {point}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Your Personalized Quote
            </h3>
            
            {/* Starting Price */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {pricing.startingPrice}
                <span className="text-lg text-gray-600">/month</span>
              </div>
              <p className="text-gray-600">Professional monitoring included</p>
            </div>

            {/* Pricing Details */}
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Installation Fee:</span>
                <span className="font-semibold text-gray-900">{pricing.installationFee}</span>
              </div>
              
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-gray-700">Insurance Savings:</span>
                <span className="font-semibold text-green-600">Up to {pricing.insuranceSavings}</span>
              </div>
            </div>

            {/* Promotion */}
            <div className="bg-orange-100 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-orange-600" />
                <span className="font-semibold text-orange-800">Limited Time Offer</span>
              </div>
              <p className="text-orange-700 text-sm">
                {pricing.promotion}
              </p>
            </div>

            {/* Value Proposition */}
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                <Shield className="w-5 h-5" />
                <span className="font-semibold">Protected from Day 1</span>
              </div>
              <p className="text-sm text-gray-600">
                Professional installation and 24/7 monitoring starts immediately
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};