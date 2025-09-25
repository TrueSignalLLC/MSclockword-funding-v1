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
  
  // Submission-specific loading stages
  const loadingStages = [
    { progress: 15, message: 'Encrypting your information...', minTime: 1500, maxTime: 3000 },
    { progress: 30, message: 'Securely transmitting data...', minTime: 2000, maxTime: 4000 },
    { progress: 45, message: 'Verifying business details...', minTime: 2500, maxTime: 4000 },
    { progress: 60, message: 'Analyzing funding eligibility...', minTime: 3000, maxTime: 5000 },
    { progress: 75, message: 'Matching with lender network...', minTime: 3000, maxTime: 5000 },
    { progress: 85, message: 'Preparing your options...', minTime: 2000, maxTime: 4000 },
    { progress: 95, message: 'Finalizing matches...', minTime: 1500, maxTime: 3000 },
    { progress: 100, message: 'Success! Redirecting...', minTime: 1000, maxTime: 1000 }
  ];

  const handleNext = async () => {
    if (currentStep < steps.length - 1) {
      // Store the answer for all question types
      const currentStepConfig = steps[currentStep];
      if (steps[currentStep].type !== 'button-group' && steps[currentStep].type !== 'name-fields') {
        const answer = getAnswerForStep(currentStepConfig);
        storeQuizAnswer(currentStepConfig.id, answer);
      } else if (steps[currentStep].type === 'name-fields') {
        // Store both first and last name
        storeFormField('first_name', quizData.first_name);
        storeFormField('last_name', quizData.last_name);
      }
      setCurrentStep(prev => prev + 1);
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
      // Don't allow going back during submission loading
      return;
    }
    
    if (currentStep > 0) {
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
        
        const endpoint = config.api.leadSubmit;
        console.log('3a. Using endpoint:', endpoint);
        
        // Show loading screen for submission
        setShowLoadingScreen(true);
        setLoadingProgress(0);
        setLoadingStage(0);
        
        // Track timing
        const startTime = Date.now();
        let apiCompleted = false;
        let shouldContinueAnimation = true;
        
        // Create AbortController for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => {
          controller.abort();
          console.log('Request aborted after 25 seconds');
        }, 25000); // 25 second timeout
        
        // Start the API call with timeout
        const apiPromise = fetch(endpoint, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        }).then(response => {
          clearTimeout(timeoutId);
          apiCompleted = true;
          console.log('API completed in', Date.now() - startTime, 'ms');
          return response;
        }).catch(error => {
          clearTimeout(timeoutId);
          apiCompleted = true;
          if (error.name === 'AbortError') {
            console.log('Request timed out');
            throw new Error('Request timeout - but your submission may have been received');
          }
          throw error;
        });
        
        // Run intelligent loading animation
        const animationPromise = intelligentLoadingAnimation(
          loadingStages,
          () => apiCompleted,
          () => shouldContinueAnimation
        );
        
        try {
          // Race between API call and timeout
          const response = await Promise.race([
            apiPromise,
            animationPromise.then(() => apiPromise) // Ensure we wait for API even if animation completes
          ]);
          
          console.log('4. Response received:', {
            ok: response.ok,
            status: response.status,
            statusText: response.statusText,
            timeElapsed: Date.now() - startTime + 'ms'
          });
          
          // Parse response
          const responseText = await response.text();
          console.log('5. Raw response text:', responseText);
          
          let responseData;
          try {
            responseData = JSON.parse(responseText);
            console.log('6. Parsed JSON response:', responseData);
          } catch (jsonError) {
            console.error('JSON parsing failed:', jsonError);
            // If we got a 200 but no JSON, still treat as success
            if (response.ok) {
              await finalizeLoadingAnimation(true);
              window.location.href = '/thank-you';
              return;
            }
            throw new Error('Invalid response format');
          }
          
          // Finalize animation based on success
          await finalizeLoadingAnimation(response.ok);
          
          // Handle redirect
          if (response.ok && responseData.status === true) {
            const redirectUrl = responseData.redirectURL || '/thank-you';
            console.log('Redirecting to:', redirectUrl);
            
            // Small delay for user to see success
            await new Promise(resolve => setTimeout(resolve, 500));
            window.location.href = redirectUrl;
          } else {
            // Even on failure, redirect to thank you
            console.log('Non-success response, but redirecting anyway');
            window.location.href = '/thank-you';
          }
          
        } catch (error: any) {
          console.error('Submission error:', error);
          shouldContinueAnimation = false;
          
          // Check if it was a timeout
          if (error.message?.includes('timeout')) {
            // Show success anyway - submission might have gone through
            await finalizeLoadingAnimation(true, 'Processing complete! Redirecting...');
          } else {
            // Other error - still show completion
            await finalizeLoadingAnimation(true, 'Finalizing your request...');
          }
          
          // Always redirect to thank you
          window.location.href = '/thank-you';
        }
        
      } else {
        console.log('No submission endpoint configured');
        throw new Error('No submission endpoint configured');
      }
    } catch (error) {
      console.error('=== SUBMISSION ERROR ===');
      console.error('Error details:', error);
      
      // Hide loading screen
      setShowLoadingScreen(false);
      
      // Don't show error alert - just redirect
      console.log('Error occurred but redirecting to thank-you page');
      window.location.href = '/thank-you';
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION END ===');
    }
  };

  // Intelligent loading animation that adapts to API response time
  const intelligentLoadingAnimation = async (
    stages: Array<{ progress: number; message: string; minTime: number; maxTime: number }>,
    isApiComplete: () => boolean,
    shouldContinue: () => boolean
  ) => {
    const animationStartTime = Date.now();
    const MIN_TOTAL_TIME = 4000; // Minimum 4 seconds for good UX
    const MAX_TOTAL_TIME = 20000; // Maximum 20 seconds before forcing completion
    
    for (const [index, stage] of stages.entries()) {
      if (!shouldContinue()) break;
      
      setLoadingProgress(stage.progress);
      setLoadingStage(index);
      
      const stageStartTime = Date.now();
      const totalElapsed = stageStartTime - animationStartTime;
      
      // Calculate dynamic wait time
      let waitTime = stage.minTime;
      
      if (isApiComplete() && stage.progress > 60) {
        // API done and we're past 60% - speed up
        waitTime = Math.min(500, stage.minTime);
      } else if (totalElapsed > MAX_TOTAL_TIME * 0.8) {
        // We're approaching max time - speed up
        waitTime = Math.min(300, stage.minTime);
      } else if (!isApiComplete() && totalElapsed < MAX_TOTAL_TIME * 0.5) {
        // API not done and we have time - use normal or extended timing
        waitTime = stage.maxTime;
      }
      
      await new Promise(resolve => setTimeout(resolve, waitTime));
      
      // Check if we should exit early
      if (isApiComplete() && totalElapsed > MIN_TOTAL_TIME && stage.progress >= 75) {
        // API done, minimum time met, and we're far enough - can exit
        break;
      }
      
      if (totalElapsed > MAX_TOTAL_TIME) {
        // Maximum time exceeded - force completion
        console.log('Loading animation max time reached');
        break;
      }
    }
  };

  // Finalize the loading animation
  const finalizeLoadingAnimation = async (success: boolean, customMessage?: string) => {
    // Set to 100% with appropriate message
    setLoadingProgress(100);
    
    const finalMessage = customMessage || (success ? 'Success! Redirecting...' : 'Completing request...');
    
    // Find or create final stage
    const finalStageIndex = 7; // Assuming 8 stages total
    setLoadingStage(finalStageIndex);
    
    // Show final message briefly
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Hide loading screen
    setShowLoadingScreen(false);
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
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return `${value.toLocaleString()}`;
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
                Processing Your Application
              </h3>
              <p className="text-gray-600 mb-8">
                Please wait while we securely process your information and prepare your funding options.
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
              <h3 className="text-2xl md:text-5xl font-bold text-gray-900 mb-6">
                {steps[currentStep].question}
              </h3>
              {steps[currentStep].helper && (
                <p className="text-xs md:text-sm text-gray-500 mb-4 md:mb-8">
                  {steps[currentStep].helper}
                </p>
              )}
            </div>

            {/* Question Content */}
            {steps[currentStep].type === 'button-group' && (
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col space-y-2 md:space-y-4">
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
                    className={`w-full p-2 md:p-3 border-2 rounded-xl text-center transition-all duration-200 hover:border-clockwork-orange-500 hover:bg-clockwork-orange-200 hover:shadow-lg text-sm md:text-base ${
                      getAnswerForStep(steps[currentStep]) === option.value
                        ? 'border-clockwork-orange-500 bg-clockwork-orange-100'
                        : 'border-gray-300 bg-clockwork-orange-50'
                    }`}
                  >
                    <span className="font-bold text-sm md:text-base text-gray-900">{option.label}</span>
                  </button>
                ))}
                </div>
              </div>
            )}

            {steps[currentStep].type === 'slider' && (
              <div className="max-w-2xl mx-auto">
                <div className="space-y-6">
                  {/* Slider Value Display */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-clockwork-orange-500 mb-2">
                      {steps[currentStep].formatValue ? 
                        steps[currentStep].formatValue(quizData.annual_revenue) : 
                        `$${quizData.annual_revenue.toLocaleString()}`
                      }
                    </div>
                  </div>
                  
                  {/* Slider */}
                  <div className="px-4">
                    <input
                      type="range"
                      min={steps[currentStep].min || 50000}
                      max={steps[currentStep].max || 50000000}
                      step={getSliderStep(quizData.annual_revenue)}
                      value={quizData.annual_revenue}
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        setQuizData(prev => ({
                          ...prev,
                          annual_revenue: value
                        }));
                      }}
                      className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #f97316 0%, #f97316 ${
                          ((quizData.annual_revenue - (steps[currentStep].min || 50000)) / 
                           ((steps[currentStep].max || 50000000) - (steps[currentStep].min || 50000))) * 100
                        }%, #e5e7eb ${
                          ((quizData.annual_revenue - (steps[currentStep].min || 50000)) / 
                           ((steps[currentStep].max || 50000000) - (steps[currentStep].min || 50000))) * 100
                        }%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  
                  {/* Range Labels */}
                  <div className="flex justify-between text-sm text-gray-500 px-4">
                    <span>$50K</span>
                    <span>$50M+</span>
                  </div>
                </div>
              </div>
            )}

            {steps[currentStep].type === 'multi-select' && (
              <div className="max-w-2xl mx-auto">
                <div className="flex flex-col space-y-2 md:space-y-4">
                {steps[currentStep].options?.map((option: any, index: number) => (
                  <label
                    key={index}
                    className="w-full flex items-center justify-center p-2 md:p-3 border-2 rounded-xl cursor-pointer hover:border-clockwork-orange-500 hover:bg-clockwork-orange-200 hover:shadow-lg transition-all duration-200 bg-clockwork-orange-50"
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
                      className="sr-only"
                    />
                    <span className="font-bold text-sm md:text-base text-gray-900">{option.label}</span>
                  </label>
                ))}
                </div>
              </div>
            )}

            {steps[currentStep].type === 'input' && (
              <div className="space-y-6">
                <div className="max-w-md mx-auto">
                  <input
                    type={steps[currentStep].inputType || 'text'}
                    value={
                      steps[currentStep].id === 'business_zip' ? quizData.business_zip :
                      steps[currentStep].id === 'business_name' ? quizData.business_name :
                      steps[currentStep].id === 'email' ? quizData.email :
                      steps[currentStep].id === 'phone' ? quizData.phone :
                      ''
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      if (steps[currentStep].id === 'business_zip') {
                        setQuizData(prev => ({ ...prev, business_zip: value }));
                      } else if (steps[currentStep].id === 'business_name') {
                        setQuizData(prev => ({ ...prev, business_name: value }));
                      } else if (steps[currentStep].id === 'email') {
                        setQuizData(prev => ({ ...prev, email: value }));
                        // Trigger email validation
                        handleEmailValidation(value);
                      } else if (steps[currentStep].id === 'phone') {
                        setQuizData(prev => ({ ...prev, phone: value }));
                        // Trigger phone validation
                        handlePhoneValidation(value);
                      }
                    }}
                    placeholder={steps[currentStep].placeholder}
                    className="w-full p-4 border-2 border-gray-300 rounded-xl text-center text-lg font-semibold bg-white focus:border-clockwork-orange-500 focus:ring-2 focus:ring-clockwork-orange-500 focus:outline-none"
                  />
                  
                  {/* Email validation feedback */}
                  {steps[currentStep].id === 'email' && (
                    <div className="mt-3">
                      {emailValidation.loading && (
                        <p className="text-blue-600 text-sm text-center">Validating email...</p>
                      )}
                      {emailValidation.valid === true && (
                        <p className="text-green-600 text-sm text-center">✓ Email is valid</p>
                      )}
                      {emailValidation.valid === false && emailValidation.error && (
                        <p className="text-red-600 text-sm text-center">{emailValidation.error}</p>
                      )}
                    </div>
                  )}
                  
                  {/* Phone validation feedback */}
                  {steps[currentStep].id === 'phone' && (
                    <div className="mt-3">
                      {phoneValidation.loading && (
                        <p className="text-blue-600 text-sm text-center">Validating phone...</p>
                      )}
                      {phoneValidation.valid === true && (
                        <p className="text-green-600 text-sm text-center">✓ Phone is valid</p>
                      )}
                      {phoneValidation.status === 'needs_otp' && (
                        <p className="text-orange-600 text-sm text-center">Phone verification required</p>
                      )}
                      {phoneValidation.valid === false && phoneValidation.error && (
                        <p className="text-red-600 text-sm text-center">{phoneValidation.error}</p>
                      )}
                    </div>
                  )}
                </div>
                
                {/* Centered navigation buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Get My Funding Options
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                {/* TCPA text for phone input */}
                {steps[currentStep].id === 'phone' && (
                  <div className="max-w-md mx-auto text-center text-xs text-gray-500 mt-4">
                    {quizConfig.submission.consent.text}
                  </div>
                )}
              </div>
            )}

            {steps[currentStep].type === 'name-fields' && (
              <div className="space-y-6">
                <div className="space-y-4 max-w-md mx-auto">
                  <input
                    type="text"
                    value={quizData.first_name}
                    onChange={(e) => setQuizData(prev => ({ ...prev, first_name: e.target.value }))}
                    placeholder="First Name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-clockwork-orange-500 focus:outline-none transition-colors"
                  />
                  <input
                    type="text"
                    value={quizData.last_name}
                    onChange={(e) => setQuizData(prev => ({ ...prev, last_name: e.target.value }))}
                    placeholder="Last Name"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-clockwork-orange-500 focus:outline-none transition-colors"
                  />
                </div>
                
                {/* Centered navigation buttons */}
                <div className="flex items-center justify-center gap-4">
                  <button 
                    onClick={handleBack}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Go back"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="bg-clockwork-orange-500 hover:bg-clockwork-orange-600 disabled:bg-gray-400 text-white font-semibold px-8 py-3 rounded-lg transition-colors flex items-center gap-2"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {/* Navigation Buttons */}
        {!showLoadingScreen && currentStep <= 6 && currentStep < steps.length && 
         (steps[currentStep].type === 'slider' || 
          steps[currentStep].type === 'multi-select') && (
          <div className="mt-8 flex justify-between items-center">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                currentStep === 0
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
              aria-label="Go back"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all duration-200 ${
                canProceed()
                  ? 'bg-clockwork-orange-500 hover:bg-clockwork-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Next
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};