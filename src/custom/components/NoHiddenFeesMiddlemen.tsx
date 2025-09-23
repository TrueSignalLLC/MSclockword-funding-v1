import React from 'react';

export const NoHiddenFeesMiddlemen: React.FC = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Image */}
          <div className="order-2 lg:order-1">
            <img 
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Two businessmen in suits shaking hands in office"
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column - Content */}
          <div className="order-1 lg:order-2">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              No Hidden Fees or Middlemen
            </h2>
            
            <div className="space-y-6 text-lg text-gray-700">
              <p>
                We bring the bank TO YOU. Enjoy clear, upfront terms with no fine print, hidden fees, or broker kickbacks.
              </p>
              
              <p>
                Get exactly what you sign up for with the least amount of fees, and the fairest interest rates based on the documentation you are able to provide to increase your approval odds.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};