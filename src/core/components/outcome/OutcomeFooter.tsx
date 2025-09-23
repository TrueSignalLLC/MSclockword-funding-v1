import React from 'react';
import { Mail } from 'lucide-react';

interface OutcomeFooterProps {
  config: {
    complianceText: string;
    disclaimer?: string;
    links?: Array<{
      text: string;
      href: string;
    }>;
  };
}

export const OutcomeFooter: React.FC<OutcomeFooterProps> = ({ config }) => {
  return (
    <footer className="bg-slate-800 text-white">
      {/* Main Footer Section */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-sm">YHS</span>
              </div>
              <h3 className="text-xl font-bold">YourHomeSecured</h3>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Your trusted partner in home security solutions. We connect homeowners with top-rated security providers to ensure your family's safety and peace of mind.
            </p>
            <div className="flex items-center">
              <Mail className="w-4 h-4 mr-2 text-blue-400" />
              <a href="mailto:support@yourhomesecured.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                support@yourhomesecured.com
              </a>
            </div>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li><a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="/contact" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <p className="text-gray-300 text-sm leading-relaxed">
              Questions about your security consultation? Our team is here to help you every step of the way.
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2024 YourHomeSecured. All rights reserved.
            </p>
            <div className="text-gray-400 text-xs max-w-md text-center md:text-right">
              <p className="mb-2">
                By submitting your information, you consent to receive communications about home security services. 
                Message and data rates may apply.
              </p>
              <p>
                Facebook Disclaimer: This website is not part of the Facebook website or Facebook Inc. Additionally, 
                this site is NOT endorsed by Facebook in any way.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ADT Compliance Footer */}
      <div className="bg-gray-900 py-6">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-300 text-sm mb-4 md:mb-0">
              {config.complianceText}
              {config.disclaimer && (
                <p className="text-xs mt-2 text-gray-400">
                  {config.disclaimer}
                </p>
              )}
            </div>
            {config.links && (
              <div className="flex gap-6 text-sm">
                {config.links.map((link, index) => (
                  <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                    {link.text}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};