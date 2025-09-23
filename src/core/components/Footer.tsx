import React from 'react';
import { Mail } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-gray-300 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Left side - Company info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img 
                src="/clockwork-logo.svg" 
                alt="Clockwork Funding Logo" 
                className="w-8 h-8"
                onError={(e) => {
                  // Fallback to text if logo fails to load
                  e.currentTarget.style.display = 'none';
                  const fallback = document.createElement('div');
                  fallback.className = 'w-8 h-8 bg-clockwork-orange-500 rounded-full flex items-center justify-center';
                  fallback.innerHTML = '<span class="text-white font-bold text-sm">CF</span>';
                  e.currentTarget.parentNode?.insertBefore(fallback, e.currentTarget);
                }}
              />
              <h3 className="text-2xl font-bold text-white">Clockwork Funding</h3>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md text-sm">
              Your trusted partner for comprehensive business funding solutions. 
              We connect businesses with top-rated lenders to ensure 
              your company's growth and success.
            </p>
          </div>
          
          {/* Right side - Contact info */}
          <div className="flex flex-col items-start md:items-end">
            <div className="flex gap-4 mb-6">
              <a 
                href="mailto:admin@clockworkfunding.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
            
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-400 mb-2">
                <Mail className="w-4 h-4" />
                <span>admin@clockworkfunding.com</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              © 2025 Clockwork Funding. All rights reserved.
            </p>
            
            <div className="flex gap-6 text-sm">
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/contact" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
        
        {/* Compliance disclaimer */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <p className="text-xs text-gray-500 leading-relaxed text-center">
            By submitting your information, you agree to be contacted by Clockwork Funding 
            and/or our lending partners regarding business funding solutions via phone, 
            text, or email. Consent is not a condition of purchase. Message and data rates may apply.
          </p>
          <p className="text-xs text-gray-500 leading-relaxed text-center">
            This website is not part of the Facebook website or Facebook Inc. Additionally, 
            this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of 
            FACEBOOK, Inc.
          </p>
        </div>
      </div>
    </footer>
  );
};