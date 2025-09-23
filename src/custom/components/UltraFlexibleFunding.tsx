import React from 'react';

export const UltraFlexibleFunding: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ultra-Flexible Funding Options
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                Unlike most lenders, we don't rely solely on your personal credit score or time in business.
              </p>
              
              <p>
                If your company has strong financials, like consistent revenue, solid profitability, and clean documentation, we can often approve you without pulling personal credit at all.
              </p>
              
              <p>
                We offer a wide range of funding structures and alternative finance vehicles, giving you multiple paths to approval regardless of your business model or situation.
              </p>
            </div>
          </div>

          {/* Right Column - Image */}
          <div>
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Business team collaboration"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};