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
              <div className="w-8 h-8 bg-clockwork-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">CF</span>
              </div>
              <span className="text-2xl font-bold text-white">Clockwork Funding</span>
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
          <p className="text-xs text-gray-500 leading-relaxed text-center mb-4">
            We are a marketing company. This Site is part of our marketing efforts for third-parties. The offers that are discussed or appear on our website are from third party advertisers who compensate us. This compensation may impact how and where products appear on our website and the order in which they appear. The compensation that we get may also influence the topic, posts, and content on our Site this website. We do not represent all services or products available on the market. Editorial opinions expressed on the Site are strictly our own, and are not provided, endorsed, or approved by advertisers. We are not affiliated with any third party advertiser other than as stated above. As such, we do not recommend or endorse any product or service on this website. If you are redirected to a third party advertiser's site, you should review their terms and conditions and privacy policy as they may differ significantly from those posted on this site.
          </p>
        </div>
      </div>
    </footer>
  );
};