import React from 'react';
import { Shield, DollarSign, Clock, Home } from 'lucide-react';

export const EducationalValueProps: React.FC = () => {
  return (
    <section className="py-20 bg-blue-50">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Everything You're Googling at 2 AM, Answered
        </h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Shield className="w-12 h-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Professional Monitoring Explained</h3>
            <p className="text-gray-600 mb-4">
              Real humans watch your home 24/7. When sensors trigger, they call police in seconds — even if you can't.
            </p>
            <a href="#" className="text-blue-600 hover:underline">Learn more about monitoring</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <DollarSign className="w-12 h-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">The Insurance Discount Secret</h3>
            <p className="text-gray-600 mb-4">
              Most insurers give 5-20% off with monitored security. We'll show you exactly how much YOU could save.
            </p>
            <a href="#" className="text-blue-600 hover:underline">Calculate your savings</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Clock className="w-12 h-12 text-red-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Why Response Time Matters</h3>
            <p className="text-gray-600 mb-4">
              Average police response: 7 minutes. Average burglary: 8 minutes. Professional monitoring changes this math.
            </p>
            <a href="#" className="text-blue-600 hover:underline">See the statistics</a>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <Home className="w-12 h-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-3">Works With Your Smart Home</h3>
            <p className="text-gray-600 mb-4">
              Already have Alexa, Google, or Apple? Your security system integrates seamlessly. We'll show you how.
            </p>
            <a href="#" className="text-blue-600 hover:underline">Check compatibility</a>
          </div>
        </div>
      </div>
    </section>
  );
};