import React from 'react';
import { User, FileText, DollarSign, TrendingUp, Clock, BarChart3, MessageCircle } from 'lucide-react';

interface ProcessSectionProps {
  onQuizStart: () => void;
}

export const ProcessSection: React.FC<ProcessSectionProps> = ({ onQuizStart }) => {
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
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            When most people hear "funding," they think of long waits, hidden fees, and bank rejections. 
            We built a process that's different. With custom-tailored programs and a team that works fast, 
            we help business owners access capital without the stress, delays, or guesswork.
          </p>
        </div>

        {/* Desktop Circular Layout */}
        <div className="hidden lg:block">
          <div className="relative w-full h-[800px] flex items-center justify-center">
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

            {/* Process steps in circle */}
            {processSteps.map((step, index) => {
              const angle = (index * 360) / processSteps.length - 90; // Start from top
              const radius = 300;
              const x = Math.cos((angle * Math.PI) / 180) * radius;
              const y = Math.sin((angle * Math.PI) / 180) * radius;
              
              // Calculate next step position for arrow direction
              const nextIndex = (index + 1) % processSteps.length;
              const nextAngle = (nextIndex * 360) / processSteps.length - 90;
              const nextX = Math.cos((nextAngle * Math.PI) / 180) * 280;
              const nextY = Math.sin((nextAngle * Math.PI) / 180) * 280;
              
              // Calculate arrow rotation
              const arrowAngle = Math.atan2(nextY - y, nextX - x) * (180 / Math.PI);

              return (
                <div key={index} className="absolute">
                  {/* Step content */}
                  <div
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `calc(50% + ${x}px)`,
                      top: `calc(50% + ${y}px)`,
                    }}
                  >
                    {/* Step number */}
                    <div className="text-center mb-4">
                      <div className="text-3xl font-bold text-gray-400 mb-2">{step.number}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 max-w-xs">{step.title}</h3>
                      <p className="text-sm text-gray-600 leading-relaxed max-w-xs">{step.description}</p>
                    </div>
                    
                    {/* Icon circle */}
                    <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center text-clockwork-orange-400 mx-auto shadow-lg">
                      {step.icon}
                    </div>
                  </div>

                  {/* Connection dot to center */}
                  <div
                    className="absolute w-3 h-3 bg-gray-400 rounded-full transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 200}px)`,
                      top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 200}px)`,
                    }}
                  ></div>

                  {/* Curved arrow to next step */}
                  <div
                    className="absolute"
                    style={{
                      left: `calc(50% + ${Math.cos((angle * Math.PI) / 180) * 260}px)`,
                      top: `calc(50% + ${Math.sin((angle * Math.PI) / 180) * 260}px)`,
                    }}
                  >
                    {/* Arrow line */}
                    <div 
                      className="w-8 h-0.5 bg-gray-600"
                      style={{
                        transform: `rotate(${arrowAngle}deg)`,
                        transformOrigin: 'left center',
                      }}
                    ></div>
                    {/* Arrow head */}
                    <div 
                      className="absolute w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-b-2 border-t-transparent border-b-transparent"
                      style={{
                        left: '32px',
                        top: '-2px',
                        transform: `rotate(${arrowAngle}deg)`,
                        transformOrigin: 'left center',
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden space-y-6">
          {processSteps.map((step, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg">
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