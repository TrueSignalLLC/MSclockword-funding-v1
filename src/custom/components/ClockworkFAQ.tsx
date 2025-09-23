import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface ClockworkFAQProps {
  onQuizStart: () => void;
}

export const ClockworkFAQ: React.FC<ClockworkFAQProps> = ({ onQuizStart }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "Is there a hard credit pull to apply?",
      answer: "First and foremost, there is NO hard credit pull to apply. We will, however, do a deeper dive into your credit history once you've agreed to work with us."
    },
    {
      question: "What are the minimum requirements for funding?",
      answer: "We typically require a 640+ credit score, at least 1 year in business, and a profitable track record. However, we also offer revenue-based financing options for high-performing companies that may not meet traditional credit requirements."
    },
    {
      question: "How quickly can I receive funding?",
      answer: "Our streamlined process allows most qualified applicants to receive funding within 24-48 hours of approval. The timeline depends on the complexity of your application and the funding amount requested."
    },
    {
      question: "What can I use the funding for?",
      answer: "Our funding is flexible and can be used for various business purposes including acquiring competitors, opening new locations, expanding operations, purchasing inventory, upgrading equipment, boosting marketing efforts, or covering day-to-day operational expenses."
    },
    {
      question: "Are there any upfront fees?",
      answer: "No, we pride ourselves on transparency. There are no upfront fees or broker kickbacks. We only succeed when you do, which means our interests are aligned with your business success."
    },
    {
      question: "What makes you different from traditional lenders?",
      answer: "Unlike traditional lenders, we fund businesses that others won't touch. We offer flexible terms, revenue-based financing options, and work with various business models including asset-heavy operations, manufacturers, construction firms, consultants, and service-based ventures."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">
            <span className="text-clockwork-blue-600">Frequently Asked Questions</span>{' '}
            <span className="text-clockwork-orange-500">FAQ</span>
          </h2>
        </div>
        
        <div className="space-y-4 mb-12">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
              >
                <h3 className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </h3>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-clockwork-orange-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-clockwork-orange-500 flex-shrink-0" />
                )}
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button
            onClick={onQuizStart}
            className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 text-white font-bold text-xl py-4 px-12 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            Apply for Funding
          </button>
        </div>
      </div>
    </section>
  );
};