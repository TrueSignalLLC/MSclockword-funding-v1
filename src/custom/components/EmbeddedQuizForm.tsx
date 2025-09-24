import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { quizConfig } from '../../config/quiz.config';
import { validateField } from '../../core/utils/validation';
import { getSessionData, storeQuizAnswer, storeFormField, getFinalSubmissionPayload, storeValidation } from '../../core/utils/session';
import { config } from '../../config/environment.config';
import { useCompliance } from '../../core/hooks/useCompliance';
import { OTPModal } from '../../core/components/OTPModal';
import { PhoneValidationPopup } from '../../core/components/PhoneValidationPopup';

interface EmbeddedQuizFormProps {
  initialAnswers?: Record<string, any>;
  onStepChange?: (step: number) => void;
}

export const EmbeddedQuizForm: React.FC<EmbeddedQuizFormProps> = ({ initialAnswers, onStepChange }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingStage, setLoadingStage] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [showPhoneValidation, setShowPhoneValidation] = useState(false);
  const [otpAttempts, setOtpAttempts] = useState(0);
  const [otpLoading, setOtpLoading] = useState(false);
  const [tcpaConsent, setTcpaConsent] = useState(false);
  
  // Email validation state
  const [emailValidation, setEmailValidation] = useState({
    loading: false,
    valid: null as boolean | null,
    error: null as string | null
  });
  
  // Debounce timeout ref for email validation
  const emailValidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Phone validation state
  const [phoneValidation, setPhoneValidation] = useState({
    loading: false,
    valid: null as boolean | null,
    error: null as string | null,
    status: null as 'valid' | 'invalid' | 'needs_otp' | 'otp_sent' | null,
    message: null as string | null,
    phoneType: null as string | null,
  });
  
  // Debounce timeout ref for phone validation
  const phoneValidationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const [quizData, setQuizData] = useState({
    funding_amount: initialAnswers?.funding_amount || '',
    company_type: '',
    financing_purpose: [] as string[],
    annual_revenue: 500000,
    credit_score: '',
    business_age: '',
    business_industry: '',
    business_zip: '',
    business_name: '',
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    leadid_token: ''
  });

  const [validationStates, setValidationStates] = useState<Record<string, any>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const { getCompliancePayload } = useCompliance();

  // Load session data on mount
  useEffect(() => {
    const sessionData = getSessionData();
    
    // Merge initial answers with session data, giving priority to initialAnswers
    const mergedAnswers = {
      ...sessionData.quiz_answers,
      ...initialAnswers
    };
    
    if (mergedAnswers.funding_amount) {
      setQuizData(prev => ({
        ...prev,
        funding_amount: mergedAnswers.funding_amount,
        company_type: mergedAnswers.company_type || '',
        financing_purpose: mergedAnswers.financing_purpose || [],
        annual_revenue: mergedAnswers.annual_revenue !== undefined ? mergedAnswers.annual_revenue : 500000,
        credit_score: mergedAnswers.credit_score || '',
        business_age: mergedAnswers.business_age || '',
        business_industry: mergedAnswers.business_industry || ''
      }));
    }
    
    // If we have initial answers (coming from home page), start from step 1
    if (initialAnswers?.funding_amount) {
      setCurrentStep(1);
      onStepChange?.(1);
    }
  }, [initialAnswers]);

  // Update parent component when step changes
  useEffect(() => {
    onStepChange?.(currentStep);
  }, [currentStep, onStepChange]);
  // Email validation handler with debouncing
  const handleEmailValidation = async (email: string) => {
    // Clear existing timeout
    if (emailValidationTimeoutRef.current) {
      clearTimeout(emailValidationTimeoutRef.current);
    }
    
    // If email is empty, reset validation state
    if (!email.trim()) {
      setEmailValidation({
        loading: false,
        valid: null,
        error: null
      });
      return;
    }
    
    // Set loading state immediately
    setEmailValidation(prev => ({
      ...prev,
      loading: true,
      error: null
    }));
    
    // Debounce the validation call
    emailValidationTimeoutRef.current = setTimeout(async () => {
      try {
        const sessionData = getSessionData();
        
        // Find email field configuration from quiz config
        const emailFieldConfig = quizConfig.submission.fields.find(field => field.id === 'email');
        
        if (!emailFieldConfig) {
          setEmailValidation({
            loading: false,
            valid: false,
            error: 'Email validation not configured'
          });
          return;
        }
        
        // Create a step-like object for validation
        const emailStep = {
          id: 'email',
          type: 'email' as const,
          validation: {
            required: true,
            apiEndpoint: config.api.emailValidation
          }
        };
        
        const result = await validateField(emailStep, email, sessionData);
        
        const validationState = {
          loading: false,
          valid: result.valid,
          error: result.error
        };
        
        setEmailValidation(validationState);
        
        // Store validation result in session
        storeValidation('email', {
          valid: result.valid,
          error: result.error,
          timestamp: new Date().toISOString()
        });
        
      } catch (error) {
        console.error('Email validation error:', error);
        const errorState = {
          loading: false,
          valid: false,
          error: 'Validation failed. Please try again.'
        };
        setEmailValidation(errorState);
        
        storeValidation('email', {
          valid: false,
          error: 'Validation failed',
          timestamp: new Date().toISOString()
        });
      }
    }, 800); // 800ms debounce delay
  };

  // Phone validation handler with debouncing
  const handlePhoneValidation = async (phone: string) => {
    // Clear existing timeout
    if (phoneValidationTimeoutRef.current) {
      clearTimeout(phoneValidationTimeoutRef.current);
    }
    
    // If phone is empty, reset validation state
    if (!phone.trim()) {
      setPhoneValidation({
        loading: false,
        valid: null,
        error: null,
        status: null,
        message: null,
        phoneType: null,
      });
      return;
    }
    
    // Set loading state immediately
    setPhoneValidation(prev => ({
      ...prev,
      loading: true,
      error: null,
      status: null,
      message: null,
    }));
    
    // Debounce the validation call
    phoneValidationTimeoutRef.current = setTimeout(async () => {
      try {
        const sessionData = getSessionData();
        
        // Find phone field configuration from quiz config
        const phoneFieldConfig = quizConfig.submission.fields.find(field => field.id === 'phone');
        
        if (!phoneFieldConfig) {
          setPhoneValidation({
            loading: false,
            valid: false,
            error: 'Phone validation not configured',
            status: 'invalid',
            message: null,
            phoneType: null,
          });
          return;
        }
        
        // Create a step-like object for validation
        const phoneStep = {
          id: 'phone',
          type: 'tel' as const,
          validation: {
            required: true,
            apiEndpoint: config.api.phoneValidation
          }
        };
        
        const result = await validateField(phoneStep, phone, sessionData);
        
        // Check if OTP is required from the API response
        const otpRequired = result.data?.otp_required === true;
        const actualStatus = otpRequired ? 'needs_otp' : (result.valid ? 'valid' : 'invalid');
        
        const validationState = {
          loading: false,
          valid: result.valid,
          error: result.error,
          status: actualStatus,
          message: result.message || null,
          phoneType: result.data?.phone_type || result.phoneType || null,
        };
        
        setPhoneValidation(validationState);
        
        // Store validation result in session
        storeValidation('phone', {
          valid: result.valid,
          error: result.error,
          status: actualStatus,
          message: result.message,
          phoneType: result.data?.phone_type || result.phoneType,
          otpRequired: otpRequired,
          phoneLocation: result.data?.phone_location,
          validationDate: result.data?.validation_date,
          timestamp: new Date().toISOString()
        });
        
        // Log for debugging
        if (otpRequired) {
          console.log('Phone requires OTP verification - will show popup on submit');
          // Automatically open phone validation popup when OTP is required
          setShowPhoneValidation(true);
        }
        
      } catch (error) {
        console.error('Phone validation error:', error);
        const errorState = {
          loading: false,
          valid: false,
          error: 'Validation failed. Please try again.',
          status: 'invalid' as const,
          message: null,
          phoneType: null,
        };
        setPhoneValidation(errorState);
        
        storeValidation('phone', {
          valid: false,
          error: 'Validation failed',
          timestamp: new Date().toISOString()
        });
      }
    }, 800); // 800ms debounce delay
  };

  const steps = quizConfig.steps;
  const totalSteps = 12; // Updated total of 12 steps
  
  // Loading screen configuration
  const loadingStages = [
    { progress: 25, message: 'Analyzing your business profile...' },
    { progress: 50, message: 'Checking funding availability...' },
    { progress: 75, message: 'Matching with lenders...' },
    { progress: 100, message: 'Funding options found!' }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      const currentStepConfig = steps[currentStep];
      
      // Check if this is the business industry question (step 6, last quiz question before loading)
      if (currentStep === 6) {
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
        // Store the answer for all question types
        if (steps[currentStep].type !== 'button-group' && steps[currentStep].type !== 'name-fields') {
          const answer = getAnswerForStep(currentStepConfig);
          storeQuizAnswer(currentStepConfig.id, answer);
        } else if (steps[currentStep].type === 'name-fields') {
          // Store both first and last name
          storeFormField('first_name', quizData.first_name);
          storeFormField('last_name', quizData.last_name);
        }
        setCurrentStep(prev => prev + 1);
      }
    } else if (currentStep === steps.length - 1) {
      // Final step - phone number submission
      // Check if phone needs OTP verification
      if (phoneValidation.status === 'needs_otp') {
        setShowPhoneValidation(true);
        return;
      }
      
      // If phone is valid or doesn't need OTP, proceed with submission
      if (phoneValidation.valid === true) {
        await handleSubmit();
      } else {
        alert('Please ensure your phone number is valid before proceeding.');
      }
    } else if (showLoadingScreen) {
      // Skip loading if user somehow clicks next during loading
      return;
    }
  };

  const handleBack = () => {
    if (showLoadingScreen) {
      // Go back to last quiz question (business industry)
      setShowLoadingScreen(false);
      setCurrentStep(6);
    } else if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const getAnswerForStep = (step: any) => {
    switch (step.id) {
      case 'funding_amount':
        return quizData.funding_amount;
      case 'company_type':
        return quizData.company_type;
      case 'financing_purpose':
        return quizData.financing_purpose;
      case 'annual_revenue':
        return formatSliderValue(quizData.annual_revenue);
      case 'credit_score':
        return quizData.credit_score;
      case 'business_age':
        return quizData.business_age;
      case 'business_industry':
        return quizData.business_industry;
      case 'business_zip':
        return quizData.business_zip;
      case 'business_name':
        return quizData.business_name;
      case 'full_name':
        return quizData.first_name && quizData.last_name ? `${quizData.first_name} ${quizData.last_name}` : '';
      case 'email':
        return quizData.email;
      case 'phone':
        return quizData.phone;
      default:
        return '';
    }
  };

  const canProceed = () => {
    if (showLoadingScreen) {
      return false; // No proceeding during loading
    }
    
    if (currentStep <= 6) {
      // Original quiz questions (steps 0-6)
      const currentStepConfig = steps[currentStep];
      const answer = getAnswerForStep(currentStepConfig);
      
      return answer !== '' && answer !== null && answer !== undefined;
    } else if (currentStep === 7) {
      // Business ZIP - no validation required
      return quizData.business_zip.trim() !== '';
    } else if (currentStep === 8) {
      // Business name - no validation required
      return quizData.business_name.trim() !== '';
    } else if (currentStep === 9) {
      // Full name - no validation required
      return quizData.first_name.trim() !== '' && quizData.last_name.trim() !== '';
    } else if (currentStep === 10) {
      // Email - requires validation
      return quizData.email.trim() !== '' && 
             emailValidation.valid === true &&
             !emailValidation.loading;
    } else if (currentStep === 11) {
      // Phone - requires validation
      return quizData.phone.trim() !== '' &&
             (phoneValidation.valid === true || phoneValidation.status === 'needs_otp') &&
             !phoneValidation.loading &&
             !showPhoneValidation &&
             !showOTPModal;
    } else {
      return false;
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      console.log('=== FORM SUBMISSION DEBUG ===');
      
      // Get compliance data
      const complianceData = getCompliancePayload();
      
      // Get TCPA consent text from quiz config
      const tcpaText = quizConfig.submission.consent.text;
      
      // Prepare final payload
      const payload = {
        ...getFinalSubmissionPayload(),
        ...complianceData,
        tcpa_text: tcpaText,
        consent: true
      };
      
      console.log('1. Payload prepared:', payload);
      console.log('2. Webhook endpoint:', config.api.leadSubmit);

      // Submit to webhook
      if (config.api.leadSubmit) {
        console.log('3. Starting fetch request...');
        
        // Use proxy endpoint for development to avoid CORS issues
        const endpoint = config.api.leadSubmit.includes('cryptochainitalia.app.n8n.cloud') 
          ? '/api/webhook'
          : config.api.leadSubmit;
        
        console.log('3a. Using endpoint:', endpoint);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        console.log('4. Fetch completed. Response details:');
        console.log('   - response.ok:', response.ok);
        console.log('   - response.status:', response.status);
        console.log('   - response.statusText:', response.statusText);
        console.log('   - response.headers:', response.headers);
        console.log('   - response.url:', response.url);
        
        // Get response text first (before JSON parsing)
        const responseText = await response.text();
        console.log('5. Raw response text:', responseText);
        
        let responseData;
        try {
          responseData = JSON.parse(responseText);
          console.log('6. Parsed JSON response:', responseData);
        } catch (jsonError) {
          console.error('7. JSON parsing failed:', jsonError);
          throw new Error(`Invalid JSON response: ${responseText}`);
        }

        if (response.ok) {
          // Check if the response indicates success and has a redirectURL
          if (responseData.status === true && responseData.redirectURL) {
            console.log('8. Success with redirectURL:', responseData.redirectURL);
            // Redirect to the URL provided by the webhook
            window.location.href = responseData.redirectURL;
          } else if (responseData.status === true) {
            console.log('9. Success but no redirectURL - using fallback');
            // Success but no redirectURL - use fallback
            window.location.href = '/thank-you';
          } else {
            console.log('10. Response indicates failure:', responseData);
            // Response indicates failure
            throw new Error(responseData.message || 'Submission failed');
          }
        } else {
          console.log('11. HTTP error response:', response.status, response.statusText);
          throw new Error('Submission failed');
        }
      } else {
        console.log('12. No submission endpoint configured');
        throw new Error('No submission endpoint configured');
      }
    } catch (error) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error details:', error);
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      alert(`There was an error submitting your application: ${error instanceof Error ? error.message : 'Please try again.'}`);
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION END ===');
    }
  };

  // Send OTP function
  const sendOTP = async (): Promise<void> => {
    setOtpLoading(true);
    try {
      if (!config.api.sendOTP) {
        throw new Error('OTP endpoint not configured');
      }
      
      const response = await fetch(config.api.sendOTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: quizData.phone,
          ...getSessionData()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send OTP');
      }
      
      // Close phone validation popup and open OTP modal
      setShowPhoneValidation(false);
      setShowOTPModal(true);
      setOtpAttempts(0);
      
      // Update phone validation status
      setPhoneValidation(prev => ({
        ...prev,
        status: 'otp_sent',
        message: 'OTP sent successfully'
      }));
      
    } catch (error) {
      console.error('Send OTP error:', error);
      alert('Failed to send OTP. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };
  
  // Verify OTP function
  const verifyOTP = async (code: string): Promise<{ success: boolean; message?: string }> => {
    try {
      if (!config.api.verifyOTP) {
        throw new Error('OTP verification endpoint not configured');
      }
      
      const response = await fetch(config.api.verifyOTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: quizData.phone,
          code: code,
          ...getSessionData()
        })
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        // Update phone validation to valid
        setPhoneValidation(prev => ({
          ...prev,
          valid: true,
          status: 'valid',
          message: 'Phone verified successfully'
        }));
        
        // Store validation result
        storeValidation('phone', {
          valid: true,
          status: 'valid',
          message: 'Phone verified successfully',
          timestamp: new Date().toISOString()
        });
        
        // Close OTP modal
        setShowOTPModal(false);
        
        return { success: true };
      } else {
        return { 
          success: false, 
          message: result.message || 'Invalid verification code' 
        };
      }
      
    } catch (error) {
      console.error('Verify OTP error:', error);
      return { 
        success: false, 
        message: 'Verification failed. Please try again.' 
      };
    }
  };
  
  // Resend OTP function
  const resendOTP = async (): Promise<void> => {
    await sendOTP();
  };

  const formatSliderValue = (value: number) => {
    if (value >= 50000000) return '$50,000,000+';
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
    return `$${value.toLocaleString()}`;
  };

  const getSliderStep = (value: number) => {
    if (value <= 1000000) return 50000; // 50k increments up to 1M
    if (value >= 10000000) return 500000; // 500k increments above 10M
    return 100000; // 100k increments between 1M and 10M
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200">

      {/* Content */}
      <div className="min-h-[400px]">
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
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                {steps[currentStep].question}
              </h3>
              {steps[currentStep].helper && (
                <p className="text-sm text-gray-500 mb-8">
                  {steps[currentStep].helper}
                </p>
              )}
            </div>

            {/* Question Content */}
            {steps[currentStep].type === 'button-group' && (
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col space-y-4">
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
                    className={`w-full p-3 border-2 rounded-xl text-center transition-all duration-200 hover:border-clockwork-orange-500 hover:bg-clockwork-orange-200 hover:shadow-lg ${
                      getAnswerForStep(steps[currentStep]) === option.value
                        ? 'border-clockwork-orange-500 bg-clockwork-orange-100'
                        : 'border-gray-300 bg-clockwork-orange-50'
                    }`}
                  >
                    <span className="font-bold text-lg md:text-xl text-gray-900">{option.label}</span>
                  </button>
                ))}
                </div>
              </div>
            )}

            {steps[currentStep].type === 'multi-select' && (
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col space-y-4">
                {steps[currentStep].options?.map((option: any, index: number) => (
                  <label
                    key={index}
                    className="w-full flex items-center justify-center p-3 border-2 rounded-xl cursor-pointer hover:border-clockwork-orange-500 hover:bg-clockwork-orange-200 hover:shadow-lg transition-all duration-200 bg-clockwork-orange-50"
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
                      className="w-6 h-6 text-clockwork-orange-500 border-2 border-gray-300 rounded focus:ring-clockwork-orange-500 focus:ring-2 mr-4"
                    />
                    <span className="font-bold text-lg md:text-xl text-gray-900">{option.label}</span>
                  </label>
                ))}
                </div>
              </div>
            )}

            {steps[currentStep].type === 'slider' && (
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="text-center mb-6">
                    <div className="text-6xl md:text-7xl font-bold text-clockwork-orange-500 mb-4">
                      {formatSliderValue(quizData.annual_revenue)}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="range"
                      min={50000}
                      max={50000000}
                      step={50000}
                      value={quizData.annual_revenue}
                      onChange={(e) => {
                        setQuizData(prev => ({
                          ...prev,
                          annual_revenue: parseInt(e.target.value)
                        }));
                      }}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>$50k</span>
                      <span>$50M</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {steps[currentStep].type === 'input' && (
              <div className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  {steps[currentStep].id === 'email' ? (
                    <div className="space-y-2">
                      <input
                        type={steps[currentStep].inputType}
                        value={quizData[steps[currentStep].id as keyof typeof quizData] as string}
                        onChange={(e) => {
                          setQuizData(prev => ({ ...prev, [steps[currentStep].id]: e.target.value }));
                          storeFormField(steps[currentStep].id, e.target.value);
                          if (steps[currentStep].id === 'email') {
                            handleEmailValidation(e.target.value);
                          }
                        }}
                        placeholder={steps[currentStep].placeholder}
                        className={`w-full px-6 py-4 border-2 border-clockwork-orange-500 rounded-xl focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent bg-white text-center text-lg font-semibold ${
                          steps[currentStep].id === 'email' && emailValidation.valid === true 
                            ? 'border-2 border-green-500' 
                            : steps[currentStep].id === 'email' && emailValidation.valid === false 
                            ? 'border-2 border-red-500' 
                            : 'border-2 border-clockwork-orange-500'
                        }`}
                        required
                      />
                      
                      {/* Email validation feedback */}
                      {steps[currentStep].id === 'email' && emailValidation.valid === true && !emailValidation.loading && (
                        <p className="text-sm text-green-600 text-center">
                          ✓ Email is valid
                        </p>
                      )}
                      
                      {/* Email validation loading and errors */}
                      {steps[currentStep].id === 'email' && emailValidation.loading && (
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Validating email...</span>
                        </div>
                      )}
                      
                      {steps[currentStep].id === 'email' && emailValidation.error && (
                        <p className="text-sm text-red-600 text-center">
                          {emailValidation.error}
                        </p>
                      )}
                    </div>
                  ) : steps[currentStep].id === 'phone' ? (
                    <div className="space-y-2">
                      <input
                        type={steps[currentStep].inputType}
                        value={quizData[steps[currentStep].id as keyof typeof quizData] as string}
                        onChange={(e) => {
                          setQuizData(prev => ({ ...prev, [steps[currentStep].id]: e.target.value }));
                          storeFormField(steps[currentStep].id, e.target.value);
                          handlePhoneValidation(e.target.value);
                        }}
                        placeholder={steps[currentStep].placeholder}
                        className={`w-full px-6 py-4 border-2 border-clockwork-orange-500 rounded-xl focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent bg-white text-center text-lg font-semibold ${
                          phoneValidation.valid === true 
                            ? 'border-2 border-green-500' 
                            : phoneValidation.valid === false 
                            ? 'border-2 border-red-500' 
                            : 'border-2 border-clockwork-orange-500'
                        }`}
                        required
                      />
                      
                      {/* Phone validation feedback */}
                      {phoneValidation.valid === true && !phoneValidation.loading && (
                        <p className="text-sm text-green-600 text-center">
                          ✓ Phone number is valid
                          {phoneValidation.phoneType && (
                            <span className="ml-2 text-gray-500">({phoneValidation.phoneType})</span>
                          )}
                        </p>
                      )}
                      
                      {/* Phone validation loading, errors, and OTP notice */}
                      {phoneValidation.loading && (
                        <div className="flex items-center justify-center gap-2 text-sm text-blue-600">
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span>Validating phone number...</span>
                        </div>
                      )}
                      
                      {phoneValidation.error && (
                        <p className="text-sm text-red-600 text-center">
                          {phoneValidation.error}
                        </p>
                      )}
                      
                      {phoneValidation.status === 'needs_otp' && (
                        <p className="text-sm text-orange-600 text-center">
                          📱 This mobile number will require SMS verification
                        </p>
                      )}
                    </div>
                  ) : (
                    <input
                      type={steps[currentStep].inputType}
                      value={quizData[steps[currentStep].id as keyof typeof quizData] as string}
                      onChange={(e) => {
                        setQuizData(prev => ({ ...prev, [steps[currentStep].id]: e.target.value }));
                        storeFormField(steps[currentStep].id, e.target.value);
                      }}
                      placeholder={steps[currentStep].placeholder}
                      className="w-full px-6 py-4 border-2 border-clockwork-orange-500 rounded-xl focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent bg-white text-center text-lg font-semibold"
                      required
                    />
                  )}
                </div>
              </div>
            )}

            {steps[currentStep].type === 'name-fields' && (
              <div className="max-w-2xl mx-auto">
                <div className="space-y-4">
                  <input
                    type="text"
                    value={quizData.first_name}
                    onChange={(e) => {
                      setQuizData(prev => ({ ...prev, first_name: e.target.value }));
                      storeFormField('first_name', e.target.value);
                    }}
                    placeholder="First Name"
                    className="w-full px-6 py-4 border-2 border-clockwork-orange-500 rounded-xl focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent bg-white text-center text-lg font-semibold"
                    required
                  />
                  <input
                    type="text"
                    value={quizData.last_name}
                    onChange={(e) => {
                      setQuizData(prev => ({ ...prev, last_name: e.target.value }));
                      storeFormField('last_name', e.target.value);
                    }}
                    placeholder="Last Name"
                    className="w-full px-6 py-4 border-2 border-clockwork-orange-500 rounded-xl focus:ring-2 focus:ring-clockwork-orange-500 focus:border-transparent bg-white text-center text-lg font-semibold"
                    required
                  />
                </div>
              </div>
            )}
          </div>
        ) : (
          <></>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
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
        </div>
        
        {!showLoadingScreen && currentStep === 11 && (
          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            {isSubmitting ? (
              'Submitting...'
            ) : (
              'Get My Funding Options'
            )}
          </button>
        )}
        
        {!showLoadingScreen && ((currentStep < 11 && currentStep > 6) || (currentStep === 3 && steps[currentStep].type === 'slider')) && (
          <button
            onClick={handleNext}
            disabled={!canProceed() || isSubmitting}
            className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Phone Validation Popup */}
      <PhoneValidationPopup
        isOpen={showPhoneValidation}
        phoneNumber={quizData.phone}
        onConfirm={sendOTP}
        onCancel={() => setShowPhoneValidation(false)}
        loading={otpLoading}
      />
      
      {/* OTP Modal */}
      <OTPModal
        isOpen={showOTPModal}
        phoneNumber={quizData.phone}
        onVerify={verifyOTP}
        onResend={resendOTP}
        onClose={() => setShowOTPModal(false)}
        maxAttempts={3}
      />
    </div>
  );
};