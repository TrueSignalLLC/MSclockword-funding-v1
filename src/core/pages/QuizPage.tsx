import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { EmbeddedQuizForm } from '../../custom/components/EmbeddedQuizForm';
import { getSessionData } from '../utils/session';
import { Footer } from '../components/Footer';

export const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [initialQuizData, setInitialQuizData] = useState<Record<string, any> | null>(null);

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
            <div className="flex items-center">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-8 h-8 bg-clockwork-orange-500 rounded-full flex items-center justify-center">
                    <Settings className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-clockwork-blue-600 rounded-full flex items-center justify-center">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                </div>
                <span className="text-xl font-bold text-gray-900">Clockwork Funding</span>
              </div>
            </div>
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

      <Footer />
    </div>
  );
};