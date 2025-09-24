import React from 'react';
import { User, FileText, DollarSign, TrendingUp, Clock, BarChart3, MessageCircle } from 'lucide-react';

interface ProcessSectionProps {
  onScrollToHero: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onScrollToHero }) => {
  const processSteps = [
    {
      number: '01',
      title: 'Apply in Minutes',
      description: 'Fill out a quick form — no upfront fees, no credit impact.',
      icon: <FileText className="w-8 h-8" />
    },
    {
      number: '02',
      title: 'Review Your Profile',
      description: 'We evaluate your credit and match you to the right programs.',
      icon: <User className="w-8 h-8" />
    },
    {
      number: '03',
      title: 'Secure the Capital',
      description: 'If we\'re a fit, you could access anywhere from 6 to 8-figures in low-interest funding.',
      icon: <DollarSign className="w-8 h-8" />
    },
    {
      number: '04',
      title: 'Optimize for Growth',
      description: 'Use the funds for marketing, inventory, expansion — your call.',
      icon: <TrendingUp className="w-8 h-8" />
    },
    {
      number: '05',
      title: 'Add More Rounds',
      description: 'We help you qualify for additional funding over time.',
      icon: <Clock className="w-8 h-8" />
    },
    {
      number: '06',
      title: 'Track Your Progress',
      description: 'We provide updates and support to keep your credit strong.',
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      number: '07',
      title: 'Stay Connected',
      description: 'Your dedicated advisor is always one message away.',
      icon: <MessageCircle className="w-8 h-8" />
    }
  ];

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Process Allows You To <span className="text-clockwork-orange-500">Move Fast.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            When most people hear "funding," they think of long waits, hidden fees, and bank rejections.
            We built a process that's different. With custom-tailored programs and a team that works fast, 
            we help business owners access capital without the stress, delays, or guesswork.
          </p>
        </div>
        </div>

        {/* Desktop Circular Layout */}
        <div className="hidden lg:block">
          <div className="relative w-full min-h-[600px] flex items-center justify-center">
            {/* Central dotted pattern - multiple concentric circles */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Multiple dotted circles */}
              <div className="w-16 h-16 rounded-full border-2 border-dotted border-clockwork-orange-400 opacity-60"></div>
              <div className="absolute w-24 h-24 rounded-full border-2 border-dotted border-clockwork-orange-400 opacity-50"></div>
              <div className="absolute w-32 h-32 rounded-full border-2 border-dotted border-clockwork-orange-400 opacity-40"></div>
              <div className="absolute w-40 h-40 rounded-full border-2 border-dotted border-clockwork-orange-400 opacity-30"></div>
              <div className="absolute w-48 h-48 rounded-full border-2 border-dotted border-clockwork-orange-400 opacity-20"></div>
              <div className="absolute w-56 h-56 rounded-full border-2 border-dotted border-clockwork-orange-400 opacity-15"></div>
              <div className="absolute w-64 h-64 rounded-full border-2 border-dotted border-clockwork-orange-400 opacity-10"></div>
            </div>

            {/* Card layout over the dotted background */}
            <div className="relative z-10 max-w-4xl mx-auto">
              <div className="space-y-6">
                {/* Row 1: Card 01 - Full Width */}
                <div className="w-full">
                  <div className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-700">
                    <div className="flex items-start gap-4">
                      {/* Icon circle */}
                      <div className="w-16 h-16 bg-clockwork-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                        {processSteps[0].icon}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-2xl font-bold text-clockwork-orange-500">{processSteps[0].number}</span>
                          <h3 className="text-xl font-bold text-white">{processSteps[0].title}</h3>
                        </div>
                        <p className="text-gray-300 leading-relaxed">{processSteps[0].description}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Row 2: Cards 02 and 03 */}
                <div className="grid grid-cols-2 gap-8">
                  {processSteps.slice(1, 3).map((step, index) => (
                    <div
                      key={index + 1}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon circle */}
                        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-clockwork-orange-400 flex-shrink-0 shadow-lg">
                          {step.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-clockwork-orange-500">{step.number}</span>
                            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 3: Cards 04 and 05 */}
                <div className="grid grid-cols-2 gap-8">
                  {processSteps.slice(3, 5).map((step, index) => (
                    <div
                      key={index + 3}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon circle */}
                        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-clockwork-orange-400 flex-shrink-0 shadow-lg">
                          {step.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-clockwork-orange-500">{step.number}</span>
                            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Row 4: Cards 06 and 07 */}
                <div className="grid grid-cols-2 gap-8">
                  {processSteps.slice(5, 7).map((step, index) => (
                    <div
                      key={index + 5}
                      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
                    >
                      <div className="flex items-start gap-4">
                        {/* Icon circle */}
                        <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-clockwork-orange-400 flex-shrink-0 shadow-lg">
                          {step.icon}
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl font-bold text-clockwork-orange-500">{step.number}</span>
                            <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                          </div>
                          <p className="text-gray-600 leading-relaxed">{step.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden space-y-6">
          <div className="space-y-4">
            {/* Row 1: Card 01 - Full Width */}
            <div className="w-full">
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-slate-700">
                <div className="flex items-start gap-4">
                  {/* Icon circle */}
                  <div className="w-16 h-16 bg-clockwork-orange-500 rounded-full flex items-center justify-center text-white flex-shrink-0 shadow-lg">
                    {processSteps[0].icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-clockwork-orange-500">{processSteps[0].number}</span>
                      <h3 className="text-xl font-bold text-white">{processSteps[0].title}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed">{processSteps[0].description}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cards 02-07 stacked vertically on mobile */}
            {processSteps.slice(1, 7).map((step, index) => (
              <div
                key={index + 1}
                className="w-full bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-100"
              >
                <div className="flex items-start gap-4">
                  {/* Icon circle */}
                  <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center text-clockwork-orange-400 flex-shrink-0 shadow-lg">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl font-bold text-clockwork-orange-500">{step.number}</span>
                      <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <button
            onClick={onScrollToHero}
            className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 text-white font-bold text-xl py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Apply for Funding
          </button>
        </div>
      </div>
    </section>
  );
};