import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { quizConfig } from '../../config/quiz.config';
import { validateField } from '../utils/validation';
import { getSessionData, storeQuizAnswer, storeFormField, getFinalSubmissionPayload } from '../utils/session';
import { config } from '../../config/environment.config';
import { useCompliance } from '../hooks/useCompliance';
import { OTPModal } from './OTPModal';
import { PhoneValidationPopup } from './PhoneValidationPopup';

interface QuizOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizOverlay: React.FC<QuizOverlayProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);
  const [showExitModal, setShowExitModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showPhoneValidation, setShowPhoneValidation] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [steps, setSteps] = useState([]);
  const [loadingStages, setLoadingStages] = useState([]);
  const { getCompliancePayload } = useCompliance();
  const totalSteps = steps.length + 1; // +1 for contact form
  
  const [quizData, setQuizData] = useState({
    funding_amount: '',
    financing_purpose: [] as string[],
    monthly_revenue: 50000,
    company_type: '',
    credit_score: '',
    business_age: '',
    business_industry: '',
    business_zip: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    business_name: ''
  });
  
  const handleClose = () => {
    setShowExitModal(true);
  };

  const handleExitConfirm = () => {
    setShowExitModal(false);
    onClose();
  };

  const handleExitCancel = () => {
    setShowExitModal(false);
  };

  const handleNext = async () => {
    if (currentStep < steps.length) {
      const currentStepConfig = steps[currentStep];
      if (currentStepConfig.id === 'monthly_revenue') {
        // Store the final quiz answer before loading
        const answer = getAnswerForStep(currentStepConfig);
        storeQuizAnswer(currentStepConfig.id, answer);
        
        // Start loading screen
        setShowLoadingScreen(true);
        setLoadingProgress(0);
        setLoadingStage(0);
        
        // Animate through loading stages
        const duration = quizConfig.loadingStep?.duration || 3000;
        const stageInterval = duration / loadingStages.length;
        
        loadingStages.forEach((stage, index) => {
          setTimeout(() => {
            setLoadingProgress(stage.progress);
            setLoadingStage(index);
          }, stageInterval * (index + 1));
        });
        
        // After loading completes, show contact form
        setTimeout(() => {
          setShowLoadingScreen(false);
          setCurrentStep(prev => prev + 1);
        }, duration + 500);
      } else {
        // Store quiz answer and move to next step
        const answer = getAnswerForStep(currentStepConfig);
        storeQuizAnswer(currentStepConfig.id, answer);
        setCurrentStep(prev => prev + 1);
      }
    } else if (showLoadingScreen) {
      // Skip loading if user somehow clicks next during loading
      return;
    } else {
      // Contact form submission
      await handleSubmit();
    }
  };

  const handleBack = () => {
    if (showLoadingScreen) {
      // Go back to last quiz question
      setShowLoadingScreen(false);
      setCurrentStep(steps.length - 1);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getAnswerForStep = (step: any) => {
    switch (step.id) {
      case 'company_type':
        return quizData.company_type;
      case 'financing_purpose':
        return quizData.financing_purpose;
      case 'monthly_revenue':
        return formatSliderValue(quizData.monthly_revenue);
      case 'credit_score':
        return quizData.credit_score;
      case 'business_age':
        return quizData.business_age;
      case 'business_industry':
        return quizData.business_industry;
      default:
        return '';
    }
  };

  const canProceed = () => {
    if (showLoadingScreen) {
      return false; // No proceeding during loading
    }
    
    if (currentStep < steps.length) {
      const currentStepConfig = steps[currentStep];
      const answer = getAnswerForStep(currentStepConfig);
      
      if (currentStepConfig.type === 'multi-select') {
        return Array.isArray(answer) && answer.length > 0;
      }
      
      return answer !== '' && answer !== null && answer !== undefined;
    } else {
      // Contact form validation
      return quizData.business_zip && 
             quizData.first_name && 
             quizData.last_name && 
             quizData.email && 
             quizData.phone && 
             quizData.business_name;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Get compliance data
      const complianceData = getCompliancePayload();
      
      // Prepare final payload
      const payload = {
        ...getFinalSubmissionPayload(),
        ...complianceData
      };

      // Submit to webhook
      if (config.api.leadSubmit) {
        const response = await fetch(config.api.leadSubmit, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          // Success - redirect or show success message
          window.location.href = '/thank-you';
        } else {
          throw new Error('Submission failed');
        }
      }
    } catch (error) {
      console.error('Submission error:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatSliderValue = (value: number) => {
    if (value >= 50000000) return '$50,000,000+';
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return `$${value.toLocaleString()}`;
  };

  const getSliderStep = (value: number) => {
    if (value >= 10000000) return 500000; // 500k increments above 10M
    return 50000; // 50k increments below 10M
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {(currentStep > 0 || showLoadingScreen) && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  disabled={showLoadingScreen && loadingProgress < 100}
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <h2 className="text-xl font-bold text-gray-900">
                {showLoadingScreen 
                  ? `Step ${steps.length + 2} of ${totalSteps}` 
                  : `Step ${currentStep + 2} of ${totalSteps}`
                }
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="px-6 py-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-clockwork-orange-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: showLoadingScreen 
                    ? `${((steps.length + 2) / totalSteps) * 100}%`
                    : `${((currentStep + 1) / totalSteps) * 100}%` 
                }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {showLoadingScreen ? (
              // Loading Screen
              <div className="space-y-8">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Finding Your Perfect Funding Match
                  </h3>
                  <p className="text-gray-600 mb-8">
                    Please wait while we analyze your information and match you with the best funding options.
                  </p>
                </div>

                {/* Loading Animation */}
                <div className="flex justify-center mb-8">
                  <div className="relative">
                    {/* Outer spinning ring */}
                    <div className="w-24 h-24 border-4 border-gray-200 rounded-full animate-spin-slow">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-clockwork-orange-500 rounded-full animate-spin"></div>
                    </div>
                    
                    {/* Inner spinning ring */}
                    <div className="absolute top-3 left-3 w-18 h-18 border-4 border-gray-100 rounded-full animate-spin-reverse-slow">
                      <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent border-t-clockwork-blue-600 rounded-full animate-spin"></div>
                    </div>
                    
                    {/* Center dot */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-clockwork-orange-500 rounded-full"></div>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="max-w-md mx-auto">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{loadingProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-clockwork-orange-500 to-clockwork-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${loadingProgress}%` }}
                    />
                  </div>
                </div>

                {/* Current Stage Message */}
                <div className="text-center">
                  <p className="text-lg font-medium text-gray-800 animate-pulse">
                    {loadingStages[loadingStage]?.message}
                  </p>
                </div>

                {/* Loading Steps */}
                <div className="max-w-md mx-auto space-y-3">
                  {loadingStages.map((stage, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-300 ${
                        index <= loadingStage
                          ? 'bg-green-50 border border-green-200'
                          : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${
                          index < loadingStage
                            ? 'bg-green-500 text-white'
                            : index === loadingStage
                            ? 'bg-clockwork-orange-500 text-white animate-pulse'
                            : 'bg-gray-300 text-gray-500'
                        }`}
                      >
                        {index < loadingStage ? (
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <span className="text-sm font-bold">{index + 1}</span>
                        )}
                      </div>
                      <span
                        className={`text-sm font-medium transition-all duration-300 ${
                          index <= loadingStage ? 'text-gray-800' : 'text-gray-500'
                        }`}
                      >
                        {stage.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : currentStep < steps.length ? (
              // Quiz Questions
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {steps[currentStep].question}
                  </h3>
                  {steps[currentStep].helper && (
                    <p className="text-gray-600 mb-6">
                      {steps[currentStep].helper}
                    </p>
                  )}
                </div>

                {/* Question Content */}
                {steps[currentStep].type === 'button-group' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
                    {steps[currentStep].options?.map((option: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => {
                          setQuizData(prev => ({
                            ...prev,
                            [steps[currentStep].id]: option.value
                          }));
                          // Store the answer immediately and auto-advance
                          storeQuizAnswer(steps[currentStep].id, option.value);
                          setTimeout(() => {
                            setCurrentStep(prev => prev + 1);
                          }, 300);
                        }}
                        className={`p-4 border-2 rounded-lg text-left transition-all duration-200 hover:border-clockwork-orange-500 hover:bg-clockwork-orange-50 ${
                          getAnswerForStep(steps[currentStep]) === option.value
                            ? 'border-clockwork-orange-500 bg-clockwork-orange-50'
                            : 'border-gray-300 bg-white'
                        }`}
                      >
                        <span className="font-semibold text-gray-900">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}

                {steps[currentStep].type === 'multi-select' && (
                  <div className="max-w-2xl mx-auto space-y-3">
                    {steps[currentStep].options?.map((option: any, index: number) => (
                      <label
                        key={index}
                        className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:border-clockwork-orange-500 hover:bg-clockwork-orange-50 transition-all duration-200"
                      >
                        <input
                          type="checkbox"
                          checked={quizData.financing_purpose.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setQuizData(prev => ({
                                ...prev,
                                financing_purpose: [...prev.financing_purpose, option.value]
                              }));
                            } else {
                              setQuizData(prev => ({
                                ...prev,
                                financing_purpose: prev.financing_purpose.filter(p => p !== option.value)
                              }));
                            }
                          }}
                          className="w-5 h-5 text-clockwork-orange-500 border-2 border-gray-300 rounded focus:ring-clockwork-orange-500 focus:ring-2 mr-4"
                        />
                        <span className="font-semibold text-gray-900">{option.label}</span>
                      </label>
                    ))}
                  </div>
                )}

                {steps[currentStep].type === 'slider' && (
                  <div className="max-w-2xl mx-auto">
                    <div className="mb-8">
                      <div className="text-center mb-6">
                        <div className="text-4xl font-bold text-clockwork-orange-500 mb-2">
                          {formatSliderValue(quizData.monthly_revenue)}
                        </div>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min={50000}
                          max={50000000}
                          step={getSliderStep(quizData.monthly_revenue)}
                          value={quizData.monthly_revenue}
                          onChange={(e) => {
                            setQuizData(prev => ({
                              ...prev,
                              monthly_revenue: parseInt(e.target.value)
                            }));
                          }}
                          className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                        
                        <div className="flex justify-between text-sm text-gray-500 mt-2">
                          <span>$50k</span>
                          <span>$50M+</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Contact Form
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Get Your Funding Options
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Complete your information to receive personalized funding recommendations.
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={quizData.first_name}
                        onChange={(e) => {
                          setQuizData(prev => ({ ...prev, first_name: e.target.value }));
                          storeFormField('first_name', e.target.value);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent"
                        placeholder="Enter your first name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={quizData.last_name}
                        onChange={(e) => {
                          setQuizData(prev => ({ ...prev, last_name: e.target.value }));
                          storeFormField('last_name', e.target.value);
                        }}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent"
                        placeholder="Enter your last name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      value={quizData.business_name}
                      onChange={(e) => {
                        setQuizData(prev => ({ ...prev, business_name: e.target.value }));
                        storeFormField('business_name', e.target.value);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent"
                      placeholder="Enter your business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={quizData.email}
                      onChange={(e) => {
                        setQuizData(prev => ({ ...prev, email: e.target.value }));
                        storeFormField('email', e.target.value);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent"
                      placeholder="Enter your email address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={quizData.phone}
                      onChange={(e) => {
                        setQuizData(prev => ({ ...prev, phone: e.target.value }));
                        storeFormField('phone', e.target.value);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent"
                      placeholder="Enter your phone number"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="text-sm text-gray-500">
              {showLoadingScreen 
                ? `Step ${steps.length + 2} of ${totalSteps}` 
                : `Step ${currentStep + 2} of ${totalSteps}`
              }
            </div>
            
            <div className="flex gap-3">
              {!showLoadingScreen && (
                <button
                  onClick={handleNext}
                  disabled={!canProceed() || isSubmitting}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    canProceed() && !isSubmitting
                      ? 'bg-clockwork-orange-500 text-white hover:bg-clockwork-orange-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </div>
                  ) : currentStep < steps.length ? (
                    'Continue'
                  ) : (
                    'Get My Funding Options'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Are you sure you want to exit?
            </h3>
            <p className="text-gray-600 mb-6">
              Your progress will be lost if you exit now.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleExitCancel}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleExitConfirm}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OTP Modal */}
      {showOTPModal && (
        <OTPModal
          isOpen={showOTPModal}
          onClose={() => setShowOTPModal(false)}
          phoneNumber={quizData.phone}
          onVerified={() => {
            setShowOTPModal(false);
            handleSubmit();
          }}
          attempts={otpAttempts}
          onAttemptsChange={setOtpAttempts}
        />
      )}

      {/* Phone Validation Popup */}
      {showPhoneValidation && (
        <PhoneValidationPopup
          isOpen={showPhoneValidation}
          onClose={() => setShowPhoneValidation(false)}
          phoneNumber={quizData.phone}
          onPhoneUpdate={(newPhone) => {
            setQuizData(prev => ({ ...prev, phone: newPhone }));
            storeFormField('phone', newPhone);
          }}
          onValidated={() => {
            setShowPhoneValidation(false);
            setShowOTPModal(true);
          }}
        />
      )}
    </>
  );
};