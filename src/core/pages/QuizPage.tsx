import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, X } from 'lucide-react';
import { EmbeddedQuizForm } from '../../custom/components/EmbeddedQuizForm';
import { getSessionData } from '../utils/session';
import { Footer } from '../components/Footer';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [initialQuizData, setInitialQuizData] = useState<Record<string, any> | null>(null);
  const [showAdvertisingDisclosure, setShowAdvertisingDisclosure] = useState(false);

  useEffect(() => {
    const sessionData = getSessionData();
    
    // Check if funding_amount exists in session
    if (!sessionData.quiz_answers.funding_amount) {
      // Redirect back to home page if no funding amount is selected
      navigate('/');
      return;
    }
    
    // Set initial quiz data from session
    setInitialQuizData(sessionData.quiz_answers);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-clockwork-orange-500 rounded-full flex items-center justify-center">
                  <Settings className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-clockwork-blue-600 rounded-full flex items-center justify-center">
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
              </div>
              <span className="text-xl font-bold text-clockwork-blue-600">Clockwork Funding</span>
            </div>
            
            <button
              onClick={() => setShowAdvertisingDisclosure(true)}
              className="text-sm text-gray-600 hover:text-clockwork-blue-600 underline transition-colors"
            >
              Advertising Disclosure
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-clockwork-blue-600 mb-4">
              Complete Your Funding Application
            </h1>
            <p className="text-lg text-gray-600">
              Let's gather a few more details to find your perfect funding match
            </p>
          </div>

          {/* Quiz Form */}
          {initialQuizData && (
            <EmbeddedQuizForm initialAnswers={initialQuizData} />
          )}
        </div>
      </section>

      {/* Advertising Disclosure Popup */}
      {showAdvertisingDisclosure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Advertising Disclosure</h2>
              <button
                onClick={() => setShowAdvertisingDisclosure(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 leading-relaxed">
                The offers that appear are from companies which we receive compensation. This compensation may influence the selection, appearance, and order of appearance of the offers listed below. However, this compensation also facilitates the provision of certain services to you at no charge. The offers displayed in your results do not include all financial services companies or all of their available product and service offerings.
              </p>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};