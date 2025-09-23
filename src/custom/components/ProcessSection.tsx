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
        <div className="hidden lg:block relative">
          <div className="relative w-full h-[600px] mx-auto">
            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-clockwork-orange-500 rounded-full flex items-center justify-center z-10">
              <div className="text-center">
                <div className="text-2xl font-bold">FAST</div>
                <div className="text-sm">FUNDING</div>
              </div>
            </div>

            {/* Process Steps in Circle */}
            {processSteps.map((step, index) => {
              const angle = (index * 360) / processSteps.length - 90; // Start from top
              const radius = 220;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;

              return (
                <div
                  key={index}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 group"
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  {/* Connection Line */}
                  <div
                    className="absolute w-20 h-0.5 bg-clockwork-orange-300 opacity-30"
                    style={{
                      transform: `rotate(${angle + 90}deg)`,
                      transformOrigin: 'left center',
                      left: '50%',
                      top: '50%',
                    }}
                  />
                  
                  {/* Step Card */}
                  <div className="bg-white text-gray-900 rounded-xl p-6 w-64 shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-clockwork-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {step.number}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {step.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
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