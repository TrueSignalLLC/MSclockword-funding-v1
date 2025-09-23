import React from 'react';

interface TrustProofProps {
  config: {
    stats: Array<{
      number: string;
      label: string;
    }>;
    testimonial: {
      quote: string;
      author: string;
    };
  };
  userData: {
    firstName: string;
    city: string;
    zip: string;
    homeType: string;
  };
}

export const TrustProof: React.FC<TrustProofProps> = ({ config, userData }) => {
  // Replace placeholders in testimonial author
  const personalizedAuthor = config.testimonial.author.replace('{city}', userData.city);

  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {config.stats.map((stat, index) => (
            <div key={index} className="text-center bg-blue-50 rounded-xl p-6 hover:bg-blue-100 transition-colors">
              <div className="text-5xl font-bold text-blue-600 mb-3">{stat.number}</div>
              <p className="text-gray-700 font-semibold text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
        
        {/* Testimonial */}
        <div className="max-w-4xl mx-auto text-center bg-gray-50 rounded-2xl p-10">
          <blockquote className="text-2xl text-gray-700 italic mb-6 leading-relaxed">
            "{config.testimonial.quote}"
          </blockquote>
          <cite className="text-gray-600 font-semibold text-lg">
            — {personalizedAuthor}
          </cite>
        </div>
          </div>
    </section>
  );
};