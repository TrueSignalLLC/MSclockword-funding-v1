import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { EmbeddedQuizForm } from '../../custom/components/EmbeddedQuizForm';
import { ClockworkFAQ } from '../../custom/components/ClockworkFAQ';
import { getSessionData } from '../utils/session';
import { Footer } from '../components/Footer';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [initialQuizData, setInitialQuizData] = useState<Record<string, any> | null>(null);
  const [showAdvertisingDisclosure, setShowAdvertisingDisclosure] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [totalSteps] = useState(12); // Total number of quiz steps

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

  // Calculate progress percentage
  const progressPercentage = Math.min(((currentStep + 1) / totalSteps) * 100, 100);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Banner with Logo - Matching main page */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img 
                src="/logo__2_-removebg-preview.png" 
                alt="Clockwork Funding Logo" 
                className="w-[240px] h-[79px]"
              />
            </div>
            
            <button
              onClick={() => setShowAdvertisingDisclosure(true)}
              className="text-sm text-gray-600 hover:text-clockwork-blue-600 underline transition-colors"
            >
              Advertising Disclosure
            </button>
          </div>
        </div>
      </div>

      {/* Progress Bar Section */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-3">
          <div className="flex items-center justify-center">
            <div className="max-w-md w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Progress
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-clockwork-orange-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <section className="py-4 md:py-12 min-h-screen md:min-h-0">
        <div className="w-full md:w-4/5 mx-auto px-4 md:px-6 min-h-screen md:min-h-0 flex flex-col">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-clockwork-blue-600 mb-3 hidden md:block">
              Complete Your Funding Application
            </h1>
            <p className="text-sm text-gray-500 hidden md:block">
              Let's gather a few more details to find your perfect funding match
            </p>
          </div>

          {/* Quiz Form */}
          <div className="flex-1 flex items-center md:block">
            {initialQuizData && (
              <EmbeddedQuizForm 
                initialAnswers={initialQuizData} 
                onStepChange={setCurrentStep}
              />
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <ClockworkFAQ onScrollToHero={() => {}} />

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