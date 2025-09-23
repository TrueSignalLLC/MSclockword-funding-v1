import React from 'react';
import { Star } from 'lucide-react';

export const SocialProofWall: React.FC = () => {
  const testimonials = [
    {
      quote: "From quiz to installation in 2 days. Why did I waste 3 weeks researching?",
      name: "Sarah Mitchell",
      location: "Dallas, TX",
      image: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      quote: "The quiz knew exactly what my older home needed. No pushy sales, just options.",
      name: "Robert Chen",
      location: "Seattle, WA",
      image: "https://randomuser.me/api/portraits/men/44.jpg"
    },
    {
      quote: "Saved $240 on insurance the first year. The system paid for itself.",
      name: "Maria Rodriguez",
      location: "Phoenix, AZ",
      image: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      quote: "Installation was seamless and the monitoring team is incredibly responsive.",
      name: "David Thompson",
      location: "Miami, FL",
      image: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    {
      quote: "Finally feel safe leaving for work trips. The app alerts are instant.",
      name: "Jennifer Park",
      location: "Portland, OR",
      image: "https://randomuser.me/api/portraits/women/45.jpg"
    },
    {
      quote: "Best decision we made as new homeowners. Professional and reliable.",
      name: "Michael Johnson",
      location: "Denver, CO",
      image: "https://randomuser.me/api/portraits/men/67.jpg"
    },
    {
      quote: "The smart home integration works flawlessly with our existing setup.",
      name: "Lisa Wang",
      location: "San Francisco, CA",
      image: "https://randomuser.me/api/portraits/women/29.jpg"
    },
    {
      quote: "Customer service is outstanding. They answered all my questions patiently.",
      name: "James Wilson",
      location: "Chicago, IL",
      image: "https://randomuser.me/api/portraits/men/55.jpg"
    },
    {
      quote: "Worth every penny for the peace of mind. Highly recommend to everyone.",
      name: "Amanda Davis",
      location: "Atlanta, GA",
      image: "https://randomuser.me/api/portraits/women/51.jpg"
    }
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          10,000+ Families Already Sleep Better
        </h2>
        
        {/* Scrolling testimonials container */}
        <div className="relative">
          <div className="flex animate-scroll-testimonials md:animate-scroll-testimonials-desktop space-x-6">
            {/* Duplicate testimonials for seamless loop */}
            {[...testimonials, ...testimonials].map((testimonial, index) => (
              <div key={index} className="flex-shrink-0 w-80 bg-gray-50 p-6 rounded-lg">
                <div className="flex mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-3 object-cover"
                  />
                  <div className="text-sm text-gray-600">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p>{testimonial.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes scroll-testimonials {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        @keyframes scroll-testimonials-desktop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-scroll-testimonials {
          animation: scroll-testimonials 20s linear infinite;
        }
        
        .animate-scroll-testimonials-desktop {
          animation: scroll-testimonials-desktop 40s linear infinite;
        }
        
        @media (max-width: 768px) {
          .animate-scroll-testimonials-desktop {
            animation: scroll-testimonials 20s linear infinite;
          }
        }
      `}</style>
    </section>
  );
};