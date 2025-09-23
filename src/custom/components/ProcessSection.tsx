import React from 'react';

interface ProcessSectionProps {
  onQuizStart: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onQuizStart }) => {
  const processSteps = [
    {
      number: '01',
      title: 'Apply in Minutes',
      description: 'Fill out a quick form — no upfront fees, no credit impact.'
    },
    {
      number: '02',
      title: 'Review Your Profile',
      description: 'We evaluate your credit and match you to the right programs.'
    },
    {
      number: '03',
      title: 'Secure the Capital',
      description: 'If we\'re a fit, you could access anywhere from 6 to 8-figures in low-interest funding.'
    },
    {
      number: '04',
      title: 'Optimize for Growth',
      description: 'Use the funds for marketing, inventory, expansion — your call.'
    },
    {
      number: '05',
      title: 'Add More Rounds',
      description: 'We help you qualify for additional funding over time.'
    },
    {
      number: '06',
      title: 'Track Your Progress',
      description: 'We provide updates and support to keep your credit strong.'
    },
    {
      number: '07',
      title: 'Stay Connected',
      description: 'Your dedicated advisor is always one message away.'
    }
  ];

  return (
    <section className="py-20 bg-gray-900 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6">
            Our Process Allows You To <span className="text-clockwork-orange-500">Move Fast.</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            When most people hear "funding," they think of long waits, hidden fees, and bank rejections. 
            We built a process that's different. With custom-tailored programs and a team that works fast, 
            we help business owners access capital without the stress, delays, or guesswork.
          </p>
        </div>

        {/* Desktop Circular Layout - Hidden on mobile */}
        {/* Desktop Two-Column Layout - Hidden on mobile */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="bg-white text-gray-900 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-clockwork-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Card Layout - Hidden on desktop */}
        <div className="lg:hidden space-y-6">
          {processSteps.map((step, index) => (
            <div key={index} className="bg-white text-gray-900 rounded-xl p-6 shadow-lg">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-clockwork-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {step.number}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <button
            onClick={onQuizStart}
            className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 text-white font-bold text-xl py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Start Your Application
          </button>
        </div>
      </div>
    </section>
  );
};