import React from 'react';

export const OurProcess: React.FC = () => {
  const processSteps = [
    { number: '01', title: 'Fill the Application', description: 'Complete application form for qualifying. Get flexible.' },
    { number: '02', title: 'Develop Your Profile', description: 'Receive your credit file and business assessment and review.' },
    { number: '03', title: 'Access The Capital', description: 'Receive access and fund immediately. Get funding for business growth.' },
    { number: '04', title: 'Day Completed', description: 'Funding completed documents. For details and any request.' },
    { number: '05', title: 'Add More Funds', description: 'Consistent delivery of strong capital to businesses template.' },
    { number: '06', title: 'Your Charge/Debt', description: 'Receive funding and pay according to your business cash flow.' },
    { number: '07', title: 'Your Charge/Debt', description: 'Receive funding and pay according to your business cash flow.' },
    { number: '08', title: 'Day Completed', description: 'Funding completed documents. For details and any request.' }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Our Process Allows You To <span className="text-clockwork-orange-500">Move Fast.</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            When people hear "funding," they think of long waits, hidden fees, and bank branches.
            We built a process that's different. With custom-tailored criteria, and ongoing support we help
            you get the funding you need quickly.
          </p>
        </div>

        <div className="relative">
          {/* Process Infographic Container */}
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12 border border-gray-200 relative overflow-hidden">
            {/* Background Image */}
            <div className="absolute bottom-0 right-0 w-1/2 h-full">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                alt="Construction workers"
                className="w-full h-full object-cover rounded-lg opacity-80"
              />
            </div>

            {/* Central Gear */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-24 h-24 bg-clockwork-orange-500 rounded-full flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-clockwork-orange-300 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Process Steps in Circle */}
            <div className="relative z-20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {processSteps.slice(0, 4).map((step, index) => (
                  <div key={index} className="text-center">
                    <div className="w-16 h-16 bg-clockwork-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                      {step.number}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                {processSteps.slice(4, 8).map((step, index) => (
                  <div key={index + 4} className="text-center">
                    <div className="w-16 h-16 bg-clockwork-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                      {step.number}
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};