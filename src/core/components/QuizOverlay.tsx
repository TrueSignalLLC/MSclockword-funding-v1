import React, { useState, useEffect, useMemo } from 'react';
import { useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, Loader2, CheckCircle, XCircle, AlertCircle, Shield } from 'lucide-react';
import { quizConfig } from '../../config/quiz.config';
import { validateField } from '../utils/validation';
import { getSessionData, storeQuizAnswer, storeValidation, storeFormField, getFinalSubmissionPayload, storeComplianceData } from '../utils/session';
import { config } from '../../config/environment.config';
import { withErrorBoundary, reportError } from '../utils/errorHandler';
import { OTPModal } from './OTPModal';
import { PhoneValidationPopup } from './PhoneValidationPopup';
import { complianceConfig } from '../../config/compliance.config';
import { useCompliance } from '../hooks/useCompliance';
import { 
  loadJornayaScript, 
} from '../utils/compliance';

interface EmailValidationState {
  loading: boolean;
  valid: boolean | null;
  error: string | null;
  suggestion?: string;
}

interface PhoneValidationState {
  loading: boolean;
  status: 'valid' | 'invalid' | null;
  error: string | null;
  message?: string;
  phoneType?: string;
}

interface QuizOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuizOverlay: React.FC<QuizOverlayProps> = ({ isOpen, onClose }) => {
  // Build steps from config - MUST be first to avoid initialization errors
  const steps = useMemo(() => {
    // Skip the first question (already answered on hero page) and add contact form
    const overlaySteps = quizConfig.steps.slice(1).map(step => ({
    const overlaySteps = quizConfig.steps.slice(1).map(step => ({
      id: step.id,
      title: step.question,
      helper: step.helper,
      type: step.type,
      options: step.options || [],
      placeholder: step.placeholder,
      min: (step as any).min,
      max: (step as any).max,
      step: (step as any).step,
      formatValue: (step as any).formatValue
    }));
    
    // Add contact form step
    overlaySteps.push({
      step: (step as any).step,
      formatValue: (step as any).formatValue
    }));
    
    // Add contact form step
    overlaySteps.push({
      id: 'contact',
      title: 'Please enter your contact details:',
      type: 'contact',
      helper: '',
      options: [],
      placeholder: undefined,
      min: undefined,
      max: undefined,
      step: undefined,
      formatValue: undefined
    });
    
    return overlaySteps;
  }, []);
      placeholder: undefined,
      min: undefined,
      max: undefined,
      step: undefined,
      formatValue: undefined
    });
    
    return overlaySteps;
  }, []);

  const [currentStep, setCurrentStep] = useState(0);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isLoadingStep, setIsLoadingStep] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [validationState, setValidationState] = useState<any>({});
  const [tcpaConsent, setTcpaConsent] = useState(false);
  const [consentTimestamp, setConsentTimestamp] = useState('');
  const [emailValidationState, setEmailValidationState] = useState<EmailValidationState>({
    loading: false,
    valid: null,
    error: null,
    suggestion: undefined
  });
  const [phoneValidationState, setPhoneValidationState] = useState<PhoneValidationState>({
    loading: false,
    status: null,
    error: null
  });
  const [showExitModal, setShowExitModal] = useState(false);
  const [lastValidatedValues, setLastValidatedValues] = useState<{
    email?: string;
    phone?: string;
    zipCode?: string;
  }>({});
  const [showValidationPopup, setShowValidationPopup] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [sendingOTP, setSendingOTP] = useState(false);


  // Store answers using config IDs
    monthly_revenue: 50000,
    company_type: '',
    financing_purpose: [] as string[],
    monthly_revenue: 50000,
    business_age: '',
    business_industry: '',
    business_zip: '',
    business_age: '',
    business_industry: '',
    business_zip: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    business_name: '',
    leadid_token: '',
    xxTrustedFormCertUrl: ''
  });
  
  // Helper function to detect autofilled phone
  const isPhoneAutofilled = () => {
    const cleaned = quizData.phone.replace(/\D/g, '');
    return cleaned.length === 10 && phoneValidationState.status === null;
  };
  
  // Email autofill detection with proper dependencies
  useEffect(() => {
    if (currentStep === steps.length - 1) {
      const timer = setTimeout(() => {
        // Auto-validate email if it has content but no validation state
        if (quizData.email && quizData.email.includes('@') && emailValidationState.valid === null) {
          handleEmailValidation(quizData.email);
        }
      }, 800); // Slightly longer delay for autofill to complete
      
      return () => clearTimeout(timer);
    }
  }, [currentStep, quizData.email]); // Add quizData.email as dependency
  
  // Keep the Jornaya loading at contact form
  useEffect(() => {
    // Only load on the lead capture step (Step 6)
    if (currentStep !== steps.length - 1) return; // Contact form step
    
    if (complianceConfig.jornaya.enabled) {
      loadJornayaScript().then(() => {
        startJornayaCapture();
      });
    }
  }, [currentStep, steps.length]);
  

  // Helper function for Jornaya capture
  const startJornayaCapture = () => {
    
    let attempts = 0;
    const maxAttempts = 30; // 15 seconds with 500ms intervals
    
    const checkForLeadiD = () => {
      const leadidInput = document.getElementById('leadid_token') as HTMLInputElement;
      
      if (leadidInput && leadidInput.value && leadidInput.value.length > 0) {
        setQuizData(prev => ({
          ...prev,
          leadid_token: leadidInput.value
        }));
        storeFormField('leadid_token', leadidInput.value);
        storeComplianceData({ 
          leadid_token: leadidInput.value,
          leadid_timestamp: new Date().toISOString()
        });
        return true; // Found it
      }
      
      attempts++;
      if (attempts < maxAttempts) {
        setTimeout(checkForLeadiD, 500);
      } else {
      }
    };
    
    // Wait 1 second after script loads before checking
    setTimeout(checkForLeadiD, 1000);
  };
  
  // After qualifying questions, before contact
  const shouldShowLoading = currentStep === quizConfig.steps.length && !showThankYou;

  const checkQualification = async () => {
    // Toggle to skip qualification logic - set to false to always qualify
    const ENABLE_QUALIFICATION_CHECK = false;
    
    if (!ENABLE_QUALIFICATION_CHECK) {
      return true; // Always qualified when toggle is OFF
    }
    
    const sessionData = getSessionData();
    
    try {
      // Send all quiz answers for qualification
      const response = await fetch(config.api.qualification, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionData.session_id,
          answers: sessionData.quiz_answers,
          zip_data: sessionData.validations.zip // Include enrichment
        })
      });
      
      const result = await response.json();
      
      // Store qualification result
      storeValidation('qualification', result);
      
      return result.status === 'qualified';
    } catch (error) {
      console.error('Qualification check error:', error);
      // Default to qualified on error to not block user
      return true;
    }
  };

  const getOptions = (stepIndex: number) => {
    if (stepIndex < steps.length - 1) { // -1 because last step is contact form
      return steps[stepIndex].options?.map(opt => opt.label) || [];
    }
    return [];
  };

  const handleOptionSelect = (value: string, isMultiSelect = false) => {
    const step = steps[currentStep];
    if (step && step.id !== 'contact') {
  const handleOptionSelect = (value: string, isMultiSelect = false) => {
    const step = steps[currentStep];
    if (step && step.id !== 'contact') {
      const configStep = quizConfig.steps.find(s => s.id === step.id);
      if (!configStep) return;
      
      const selectedOption = configStep.options?.find(opt => opt.label === value);
      const answerValue = selectedOption?.value || value;
      
      if (isMultiSelect) {
        // Handle multi-select
        setQuizData(prev => {
          const currentValues = Array.isArray(prev[step.id as keyof typeof prev]) 
            ? prev[step.id as keyof typeof prev] as string[]
            : [];
          
          const newValues = currentValues.includes(answerValue)
            ? currentValues.filter(v => v !== answerValue)
            : [...currentValues, answerValue];
            
          return {
            ...prev,
            [step.id]: newValues
          };
        });
        
        // Store multi-select answer
        const currentValues = Array.isArray(quizData[step.id as keyof typeof quizData])
          ? quizData[step.id as keyof typeof quizData] as string[]
          : [];
        const newValues = currentValues.includes(answerValue)
          ? currentValues.filter(v => v !== answerValue)
          : [...currentValues, answerValue];
        storeQuizAnswer(step.id, newValues);
      } else {
        // Handle single select
        setQuizData(prev => ({
          ...prev,
          [step.id]: answerValue
        }));
        
        // Store quiz answer
        storeQuizAnswer(step.id, answerValue);
        
        // Auto-advance for single select questions
        setTimeout(() => {
          handleNext();
        }, 300);
      }
    }
  };

  const handleSliderChange = (value: number) => {
    const step = steps[currentStep];
    if (step && step.id !== 'contact') {
      setQuizData(prev => ({
        ...prev,
        [step.id]: value
      }));
            : [];
          
          const newValues = currentValues.includes(answerValue)
            ? currentValues.filter(v => v !== answerValue)
            : [...currentValues, answerValue];
            
          return {
            ...prev,
            [step.id]: newValues
          };
        });
        
        // Store multi-select answer
        const currentValues = Array.isArray(quizData[step.id as keyof typeof quizData])
          ? quizData[step.id as keyof typeof quizData] as string[]
          : [];
        const newValues = currentValues.includes(answerValue)
          ? currentValues.filter(v => v !== answerValue)
          : [...currentValues, answerValue];
        storeQuizAnswer(step.id, newValues);
      } else {
        // Handle single select
        setQuizData(prev => ({
          ...prev,
          [step.id]: answerValue
        }));
        
        // Store quiz answer
        storeQuizAnswer(step.id, answerValue);
        
        // Auto-advance for single select questions
        setTimeout(() => {
          handleNext();
        }, 300);
      }
    }
  };

  const handleSliderChange = (value: number) => {
    const step = steps[currentStep];
    if (step && step.id !== 'contact') {
      setQuizData(prev => ({
        ...prev,
        [step.id]: value
      }));
      
      // Store quiz answer
      storeQuizAnswer(step.id, value);
      if (cleaned.length <= 10) {
        let formatted: string;
        if (cleaned.length > 6) {
          formatted = '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3, 6) + '-' + cleaned.slice(6);
        } else if (cleaned.length > 3) {
          formatted = '(' + cleaned.slice(0, 3) + ') ' + cleaned.slice(3);
        } else {
          formatted = cleaned;
        }
        value = formatted;
      }
    }
    
    // Update local state
    setQuizData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Store form field data
    if (['first_name', 'last_name', 'phone', 'email'].includes(field)) {
      storeFormField(field, value);
    } else if (field === 'business_zip') {
      // Store business ZIP as quiz answer
      storeQuizAnswer('business_zip', value);
    } else if (field === 'business_zip') {
      // Store business ZIP as quiz answer
      storeQuizAnswer('business_zip', value);
    }

    // Handle business ZIP validation when 5 digits entered
    if (field === 'business_zip' && value.length === 5) {
      // Get the config and session data
      const zipStep = {
        id: 'business_zip',
        validation: {
      const zipStep = {
        id: 'business_zip',
        validation: {
          apiEndpoint: config.api.zipValidation,
          mockDelay: 1500,
          message: 'Please enter a valid ZIP code'
        }
      };
          mockDelay: 1500,
          message: 'Please enter a valid ZIP code'
        }
      };
      const sessionData = getSessionData();
      
      // Execute validation and handle response
      try {
        const result = await validateField(zipStep, value, sessionData);
        console.log('QuizOverlay received:', result);
        
        // Update state when response arrives
        setValidationState({
          loading: false,
          valid: result.valid,
          error: result.error
        });
        
        // Store entire validation response if valid
        if (result.valid) {
          console.log('About to store validation with:', result);
          storeValidation('business_zip', result);
          // Check immediately after storing
          const stored = JSON.parse(sessionStorage.getItem('session_data'));
          console.log('Session storage after store:', stored);
        }
      } catch (error) {
        // Handle any unexpected errors
        setValidationState({
          loading: false,
          valid: false,
          error: 'Validation failed'
        });
      }
    }
  };

  const handleEmailValidation = async (email: string) => {
    if (!email) return;
    
    // Skip if unchanged
    if (email === lastValidatedValues.email) {
      return;
    }
    
    const emailLower = email.toLowerCase();
    
    // Check for @ symbol
    if (!email.includes('@')) {
      setEmailValidationState({
        loading: false,
        valid: false,
        error: 'Email must include @ symbol',
        suggestion: undefined
      });
      return;
    }
    
    // Split email to check domain
    const [localPart, domain] = emailLower.split('@');
    
    // Common domain typos
    const domainTypos: Record<string, string> = {
      'gmial.com': 'gmail.com',
      'gmai.com': 'gmail.com',
      'gmil.com': 'gmail.com',
      'hotmial.com': 'hotmail.com',
      'hotmal.com': 'hotmail.com',
      'hotmil.com': 'hotmail.com',
      'hotmsl.com': 'hotmail.com',
      'hotms.com': 'hotmail.com',
      'yahooo.com': 'yahoo.com',
      'yaho.com': 'yahoo.com',
      'outlok.com': 'outlook.com',
      'outloo.com': 'outlook.com'
    };
    
    // Check if domain is a known typo
    if (domainTypos[domain]) {
      const suggestedEmail = `${localPart}@${domainTypos[domain]}`;
      setEmailValidationState({
        loading: false,
        valid: false,
        error: `Did you mean ${suggestedEmail}?`,
        suggestion: suggestedEmail
      });
      return;
    }
    
    // Basic format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailValidationState({
        loading: false,
        valid: false,
        error: 'Please enter a valid email format',
        suggestion: undefined
      });
      return;
    }
    
    // Check for spaces
    if (email.includes(' ')) {
      setEmailValidationState({
        loading: false,
        valid: false,
        error: 'Email cannot contain spaces',
        suggestion: undefined
      });
      return;
    }
    
    // All client-side checks passed, now call API
    setEmailValidationState({ loading: true, valid: null, error: null });
    
    const emailConfig = {
      id: 'email',
      validation: {
        apiEndpoint: config.api.emailValidation,
        mockDelay: 1500,
        message: 'Please enter a valid email address'
      }
    };
    
    const sessionData = getSessionData();
    
    try {
      const result = await validateField(emailConfig, email, sessionData);
      
      // Track this as the last validated value
      setLastValidatedValues(prev => ({
        ...prev,
        email: email
      }));
      
      setEmailValidationState({
        loading: false,
        valid: result.valid,
        error: result.error
      });
      
      if (result.valid) {
        storeValidation('email', result);
      }
    } catch (error) {
      setEmailValidationState({
        loading: false,
        valid: false,
        error: 'Validation failed'
      });
    }
  };

  // Add this handler for applying suggestion
  const applySuggestion = (suggestedEmail: string) => {
    handleInputChange('email', suggestedEmail);
    setEmailValidationState({
      loading: false,
      valid: null,
      error: null,
      suggestion: undefined
    });
    // Trigger validation with corrected email
    handleEmailValidation(suggestedEmail);
  };

  // Phone Validation Handler
  const handlePhoneValidation = async (phone: string) => {
    const cleaned = phone.replace(/\D/g, '');
    
    if (cleaned.length !== 10) return;
    if (phone === lastValidatedValues.phone) return;
    
    setPhoneValidationState({ loading: true, status: null, error: null });
    
    try {
      const sessionData = getSessionData();
      
      // Create a step object compatible with validateField
      const phoneStep = {
        id: 'phone',
        validation: {
          apiEndpoint: config.api.phoneValidation,
          mockDelay: 1500,
          message: 'Please enter a valid phone number'
        }
      };
      
      // Use validateField instead of direct fetch
      const result = await validateField(phoneStep, cleaned, sessionData);
      
      setLastValidatedValues(prev => ({ ...prev, phone }));
      
      if (result.valid && result.data) {
        const data = result.data;
        
        if (data.otp_required) {
          setPhoneValidationState({ 
            loading: false, 
            status: 'needs_otp',
            error: null,
            message: result.message || `Verification required`,
            phoneType: data.phone_type
          });
          setShowValidationPopup(true);
        } else {
          setPhoneValidationState({ 
            loading: false, 
            status: 'valid',
            error: null,
            message: 'Phone number verified',
            phoneType: data.phone_type
          });
          storeValidation('phone', data);
        }
      } else {
        setPhoneValidationState({ 
          loading: false, 
          status: 'invalid',
          error: null,
          message: result.error || 'Please enter a valid phone number'
        });
      }
    } catch (error) {
      console.error('Phone validation error:', error);
      setPhoneValidationState({ 
        loading: false, 
        status: 'invalid', 
        error: null,
        message: 'Unable to validate phone number. Please try again.' 
      });
    }
  };

  // Send OTP Handler
  const handleSendOTP = async () => {
    const cleaned = quizData.phone.replace(/\D/g, '');
    setSendingOTP(true);
    
    try {
      const sessionData = getSessionData();
      
      // Use config.api.sendOTP (which pulls from VITE_SEND_OTP)
      const response = await fetch(config.api.sendOTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: cleaned,
          session_id: sessionData.session_id
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      console.log('Send OTP response:', result);
      console.log('Checking success:', result.data?.success, result.data?.status);
      
      // FIX: Check for success in the data object, not at root level
      if (result.data?.success || result.data?.status === 'sent') {
        console.log('Success condition met, showing OTP modal');
        setShowValidationPopup(false);
        setShowOTPModal(true);
        setPhoneValidationState(prev => ({
          ...prev,
          status: 'otp_sent',
          error: null,
          message: 'Verification code sent'
        }));
      } else {
        console.log('Success condition NOT met');
        alert('Failed to send verification code. Please try again.');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      alert('Failed to send verification code. Please try again.');
    } finally {
      setSendingOTP(false);
    }
  };

  // Separate function for resending OTP
  const handleResendOTP = () => {
    console.log('Resend button clicked - calling handleSendOTP');
    handleSendOTP();
  };

  // Cancel Validation Handler
  const handleCancelValidation = () => {
    setShowValidationPopup(false);
    setPhoneValidationState({ loading: false, status: null, error: null });
    handleInputChange('phone', '');
  };

  // Verify OTP Handler
  const handleVerifyOTP = async (code: string): Promise<{ success: boolean; message?: string }> => {
    const cleaned = quizData.phone.replace(/\D/g, '');
    
    try {
      const sessionData = getSessionData();
      
      // Use config.api.verifyOTP (which pulls from VITE_VERIFY_OTP)
      const response = await fetch(config.api.verifyOTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          phone: cleaned,
          otp: code,
          session_id: sessionData.session_id
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Check for "approved" status as you mentioned
      if (result.success || result.status === 'approved' || result.status === 'valid') {
        setPhoneValidationState({ 
          loading: false, 
          status: 'valid',
          error: null,
          message: 'Phone verified successfully'
        });
        setShowOTPModal(false);
        storeValidation('phone', { status: 'valid', verified: true, ...result });
        return { success: true };
      }
      
      return { success: false, message: result.message || 'Invalid code' };
    } catch (error) {
      console.error('OTP verification error:', error);
      return { success: false, message: 'Verification failed' };
    }
  };

  const canProceed = () => {
    const step = steps[currentStep];
    
    if (step.type === 'contact') {
      // Contact step - require all fields and validations
      return quizData.business_zip &&
             validationState.valid === true &&
             quizData.first_name && 
             quizData.last_name && 
             quizData.phone && 
             quizData.email && 
             emailValidationState.valid === true &&
             phoneValidationState.status === 'valid' &&
             tcpaConsent;
    } else if (step.type === 'multi-select') {
      // Multi-select requires at least one selection
      const values = quizData[step.id as keyof typeof quizData];
      return Array.isArray(values) && values.length > 0;
    } else if (step.type === 'slider') {
      // Slider always has a value
             quizData.last_name && 
             quizData.phone && 
             quizData.email && 
             emailValidationState.valid === true &&
             phoneValidationState.status === 'valid' &&
             tcpaConsent;
    } else if (step.type === 'multi-select') {
      // Multi-select requires at least one selection
      const values = quizData[step.id as keyof typeof quizData];
      return Array.isArray(values) && values.length > 0;
    } else if (step.type === 'slider') {
      // Slider always has a value
      return true;
    } else {
      // Single select questions
      return quizData[step.id as keyof typeof quizData] !== '';
    }
  };

  const runLoadingAnimation = async () => {
    setIsLoadingStep(true);
    const stages = quizConfig.loadingStep.stages;
    
    // Run qualification check during loading
    let isQualified = true;
    
    for (let stage of stages) {
      setLoadingProgress(stage.progress);
      setLoadingMessage(stage.message);
      
      // Run qualification check at 50% progress
      if (stage.progress === 50 && config.api.qualification) {
        isQualified = await checkQualification();
      }
      
      await new Promise(resolve => setTimeout(resolve, 750));
    }
    
    setIsLoadingStep(false);
    
    // Only proceed to contact form if qualified
    if (isQualified) {
      setCurrentStep(currentStep + 1);
    } else {
      // Handle disqualification - could show different message or redirect
      setShowThankYou(true);
    }
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 2) { // Second to last step (before contact form)
      // After last qualifying question, show loading
      await runLoadingAnimation();
    } else if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    const submitWithErrorHandling = withErrorBoundary(() => {
      handleFinalSubmission();
    });
    
    submitWithErrorHandling();
  };

  const handleFinalSubmission = async () => {
    try {
      // Get TrustedForm certificate using the correct selector pattern
      const trustedFormCertUrl = (document.querySelector('[id^="xxTrustedFormCertUrl"]') as HTMLInputElement)?.value || '';
      
      // Get EVERYTHING including TrustedForm data
      const sessionData = getSessionData();
      const payload = {
        ...getFinalSubmissionPayload(),
        // Include TrustedForm certificate
        xxTrustedFormCertUrl: trustedFormCertUrl,
        consent: {
          tcpa_agreed: tcpaConsent,
          tcpa_timestamp: consentTimestamp,
          tcpa_text: quizConfig.submission.consent.text,
          tcpa_version: '2025_v1'
        }
      };
      
      console.log('Final submission payload:', payload);
      
      const response = await fetch(config.api.leadSubmit, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const result = await response.json();
      
      // Log for debugging only
      if (config.features.debugMode) {
        console.log('Final submission payload:', payload);
        console.log('Submission result:', result);
      }
      
      // Store quiz data in sessionStorage for outcome page
      const quizFormData = {
        firstName: quizData.first_name,
        lastName: quizData.last_name,
        email: quizData.email,
        phone: quizData.phone,
        zip: quizData.business_zip,
        city: sessionData.validations?.zip?.data?.city || 'your area',
        homeStatus: quizData.business_type,
        installPref: quizData.funding_amount,
        intentTiming: quizData.funding_timeline,
        existingSystem: quizData.credit_score,
        homeType: quizData.business_type === 'owner' ? 'owned' : 'rental'
      };
      
      sessionStorage.setItem('quiz_data', JSON.stringify(quizFormData));
      
      // For now, redirect to ADT outcome
      // Later this will be determined by webhook response
      window.location.href = '/outcome';
      
      return result;
    } catch (error) {
      reportError(error as Error, { context: 'final_submission' });
      
      // Log errors only in debug mode
      if (config.features.debugMode) {
        console.error('Submission error:', error);
      }
      
      // Still show thank you - don't block user experience
      setShowThankYou(true);
    }
  };

  const getThankYouMessage = () => {
    if (quizData.funding_timeline === 'asap') {
      return "A funding specialist will contact you within 15 minutes to discuss your urgent funding needs and expedite your application.";
    }
    return "A funding specialist will review your application and contact you with personalized funding options within 24 hours.";
  };

  if (!isOpen) return null;

  // Show loading screen
  if (isLoadingStep) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl p-8 text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${loadingProgress}%` }}
            />
          </div>
          <h3 className="text-xl font-semibold text-gray-900">
            {loadingMessage}
          </h3>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main quiz modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl" tabIndex={-1}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            {!showThankYou && (
              <button
                onClick={currentStep > 0 ? handleBack : onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {currentStep > 0 ? <ChevronLeft className="w-5 h-5" /> : <X className="w-5 h-5" />}
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {showThankYou ? 'Thank You!' : `Step ${currentStep + 1} of ${steps.length}`}
            </h2>
          </div>
          {!showThankYou && (
            <button
              onClick={() => {
                if (currentStep > 0 && !showThankYou) {
                  setShowExitModal(true);
                } else {
                  onClose();
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Progress Bar */}
        {!showThankYou && (
          <div className="px-6 py-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {showThankYou ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Your Security Match is Ready!
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                {getThankYouMessage()}
              </p>
              <p className="text-sm text-gray-500">
                Check your email for your personalized recommendations and next steps.
              </p>
              <button
                onClick={onClose}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {steps[currentStep].title}
              </h3>
              
              {steps[currentStep].helper && (
                <p className="text-gray-600 mb-6">
                  {steps[currentStep].helper}
                </p>
              )}

              {/* Single Select Options */}
              {steps[currentStep].type === 'button-group' && (
                <div className="space-y-3">
                  {getOptions(currentStep).map((option, index) => (
                    <label
                      key={index}
                      className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <input
                        type="radio"
                        name={`step-${currentStep}-${steps[currentStep].id}`}
                        value={option}
                        checked={(() => {
                          const step = steps[currentStep];
                          const configStep = quizConfig.steps.find(s => s.id === step.id);
                          if (!configStep) return false;
                          const selectedOption = configStep.options?.find(opt => opt.label === option);
                          return quizData[step.id as keyof typeof quizData] === selectedOption?.value;
                        })()}
                        onChange={(e) => handleOptionSelect(e.target.value)}
                        className="w-4 h-4 text-blue-600 mr-3"
                      />
                      <span className="text-gray-900">{option}</span>
                    </label>
                  ))}
                </div>
              )}

              {/* Multi-Select Options */}
              {steps[currentStep].type === 'multi-select' && (
                <div className="space-y-3">
                  {getOptions(currentStep).map((option, index) => {
                    const step = steps[currentStep];
                    const configStep = quizConfig.steps.find(s => s.id === step.id);
                    const selectedOption = configStep?.options?.find(opt => opt.label === option);
                    const values = Array.isArray(quizData[step.id as keyof typeof quizData]) 
                      ? quizData[step.id as keyof typeof quizData] as string[]
                      : [];
                    const isSelected = values.includes(selectedOption?.value || option);
                    
                    return (
                      <label
                        key={index}
                        className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50' 
                            : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleOptionSelect(option, true)}
                          className="w-4 h-4 text-blue-600 mr-3"
                        />
                        <span className="text-gray-900">{option}</span>
                      </label>
                    );
                  })}
                </div>
              )}

              {/* Slider */}
              {steps[currentStep].type === 'slider' && (
                <div>
                  <div className="mb-6">
                    <div className="text-center mb-4">
                      <span className="text-3xl font-bold text-blue-600">
                        {steps[currentStep].formatValue ? 
                          steps[currentStep].formatValue!(quizData.monthly_revenue) : 
                          `$${quizData.monthly_revenue.toLocaleString()}`
                        }
                      </span>
                    </div>
                    <input
                      type="range"
                      min={steps[currentStep].min}
                      max={steps[currentStep].max}
                      step={quizData.monthly_revenue >= 10000000 ? 500000 : 50000}
                      value={quizData.monthly_revenue}
                      onChange={(e) => handleSliderChange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-2">
                      <span>$50k</span>
                      <span>$50M+</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Form */}
              {steps[currentStep].type === 'contact' && (
                <form 
                  id="lead-capture-form" 
                  onSubmit={(e) => e.preventDefault()} 
                  onFocus={() => {
                    // Validate email if filled but not validated
                    if (quizData.email && emailValidationState.valid === null) {
                      handleEmailValidation(quizData.email);
                    }
                  }}
                  className="space-y-4"
                >
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Business ZIP Code"
                        value={quizData.business_zip}
                        onChange={(e) => handleInputChange('business_zip', e.target.value)}
                        className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        maxLength={5}
                      />
                      {validationState.loading && (
                        <Loader2 className="absolute right-4 top-4 w-5 h-5 animate-spin text-blue-500" />
                      )}
                      {validationState.valid === true && (
                        <CheckCircle className="absolute right-4 top-4 w-5 h-5 text-green-500" />
                      )}
                      {validationState.valid === false && (
                        <XCircle className="absolute right-4 top-4 w-5 h-5 text-red-500" />
                      )}
                    </div>
                    {validationState.error && (
                      <p className="mt-2 text-sm text-red-600">{validationState.error}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={quizData.first_name}
                      onChange={(e) => handleInputChange('first_name', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={quizData.last_name}
                      onChange={(e) => handleInputChange('last_name', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Business Name"
                      value={quizData.business_name}
                      onChange={(e) => handleInputChange('business_name', e.target.value)}
                      className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={quizData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      onBlur={(e) => {
                        const cleaned = e.target.value.replace(/\D/g, '');
                        if (cleaned.length === 10) {
                          handlePhoneValidation(e.target.value);
                        }
                      }}
                      onFocus={(e) => {
                        // Validate on focus if autofilled
                        if (isPhoneAutofilled()) {
                          handlePhoneValidation(e.target.value);
                        }
                      }}
                      className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    
                    {phoneValidationState.loading && (
                      <Loader2 className="absolute right-4 top-4 w-5 h-5 animate-spin text-blue-500" />
                    )}
                    
                    {phoneValidationState.status === 'valid' && (
                      <CheckCircle className="absolute right-4 top-4 w-5 h-5 text-green-500" />
                    )}
                    
                    {phoneValidationState.status === 'invalid' && (
                      <XCircle className="absolute right-4 top-4 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  
                  {/* Clickable verify button for autofilled phone */}
                  {(() => {
                    const cleaned = quizData.phone.replace(/\D/g, '');
                    const needsValidation = cleaned.length === 10 && phoneValidationState.status === null;
                    
                    if (needsValidation) {
                      return (
                        <button
                          type="button"
                          onClick={() => handlePhoneValidation(quizData.phone)}
                          className="mt-1 text-sm text-blue-600 hover:text-blue-700 underline cursor-pointer"
                        >
                          Click to verify phone number
                        </button>
                      );
                    }
                    
                    if (phoneValidationState.status === 'invalid' && phoneValidationState.message) {
                      return <p className="mt-1 text-sm text-red-600">{phoneValidationState.message}</p>;
                    }
                    
                    return null;
                  })()}
                  
                  <div className="relative">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={quizData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      onBlur={(e) => {
                        // Fire validation when leaving the field for any reason
                        if (e.target.value) {
                          handleEmailValidation(e.target.value);
                        }
                      }}
                      className="w-full p-4 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    {emailValidationState.loading && (
                      <Loader2 className="absolute right-4 top-4 w-5 h-5 animate-spin text-blue-500" />
                    )}
                    {emailValidationState.valid === true && (
                      <CheckCircle className="absolute right-4 top-4 w-5 h-5 text-green-500" />
                    )}
                    {emailValidationState.valid === false && (
                      <XCircle className="absolute right-4 top-4 w-5 h-5 text-red-500" />
                    )}
                  </div>
                  {emailValidationState.error && (
                    <p className="mt-1 text-sm text-red-600">
                      {emailValidationState.error}
                    </p>
                  )}
                  
                  {/* Jornaya LeadiD hidden input */}
                  {complianceConfig.jornaya.enabled && (
                    <input
                      id="leadid_token"
                      name="universal_leadid"
                      type="hidden"
                      value=""
                      style={{ display: 'none' }}
                    />
                  )}
                  
                  {/* TrustedForm Certificate hidden input */}
                  {complianceConfig.trustedForm.enabled && (
                    <input
                      name={complianceConfig.trustedForm.fieldName || 'xxTrustedFormCertUrl'}
                      type="hidden"
                      value=""
                      style={{ display: 'none' }}
                    />
                  )}
                  
                  <label className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg cursor-pointer border border-gray-200 hover:border-blue-300">
                    <input
                      type="checkbox"
                      id={complianceConfig.jornaya.enabled ? "leadid_tcpa_disclosure" : "tcpa_consent"}
                      checked={tcpaConsent}
                      onChange={(e) => {
                        setTcpaConsent(e.target.checked);
                        if (e.target.checked) {
                          setConsentTimestamp(new Date().toISOString());
                        }
                      }}
                      className="mt-1 w-4 h-4 text-blue-600"
                    />
                    <span 
                      className="text-xs text-gray-600 leading-relaxed [&_a]:text-blue-600 [&_a]:hover:text-blue-700 [&_a]:underline"
                      dangerouslySetInnerHTML={{ 
                        __html: quizConfig.submission.consent.text 
                      }}
                    />
                  </label>
                </form>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!showThankYou && (
          <div className="p-6 border-t border-gray-200 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {currentStep + 1} of {steps.length}
            </div>
            {(steps[currentStep].type === 'multi-select' || steps[currentStep].type === 'contact') && (
              <button
                onClick={(e) => {
                  if (!canProceed()) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                  }
                  handleNext();
                }}
                disabled={!canProceed()}
                className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                  canProceed()
                    ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-50 pointer-events-none'
                }`}
                title={!canProceed() ? 'Please complete and validate all fields' : ''}
                style={{ pointerEvents: !canProceed() ? 'none' : 'auto' }}
              >
                {currentStep === steps.length - 1 ? 'Get My Funding Options' : 'Next'}
                {currentStep < steps.length - 1 && <ChevronRight className="w-4 h-4" />}
              </button>
            )}
          </div>
        )}
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md shadow-xl">
            <h3 className="text-lg font-bold mb-2">Wait! You're almost done</h3>
            <p className="text-gray-600 mb-4">
              You're just {steps.length - currentStep} questions away from your personalized funding options.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowExitModal(false)}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-semibold"
              >
                Continue Quiz
              </button>
              <button 
                onClick={() => {
                  setShowExitModal(false);
                  onClose();
                }}
                className="flex-1 border border-gray-300 py-2 px-4 rounded-lg hover:bg-gray-50"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Phone Validation Popup - Outside main modal */}
      <PhoneValidationPopup
        isOpen={showValidationPopup}
        phoneNumber={quizData.phone}
        onConfirm={handleSendOTP}
        onCancel={handleCancelValidation}
        loading={sendingOTP}
      />

      {/* OTP Modal - Outside main modal */}
      <OTPModal
        isOpen={showOTPModal}
        phoneNumber={quizData.phone}
        onVerify={handleVerifyOTP}
        onResend={handleResendOTP}
        onClose={() => setShowOTPModal(false)}
      />
    </>
  );
};