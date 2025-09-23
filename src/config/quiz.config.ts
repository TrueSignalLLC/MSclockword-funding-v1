import { config } from './environment.config';

export const quizConfig = {
  steps: [
    {
      id: 'business_zip',
      type: 'input' as const,
      question: 'What is your business ZIP code?',
      placeholder: 'ZIP code',
      helper: "We'll check local lending availability.",
      validation: {
        pattern: /^\d{5}$/,
        message: 'Please enter a valid 5-digit ZIP.',
        apiEndpoint: config.api.zipValidation,
        mockDelay: 1500,
      },
      required: true,
      sidebar: {
        title: 'Why we need your ZIP',
        content: 'We use your location to match you with local lenders and check funding availability in your area.'
      }
    },
    {
      id: 'business_type',
      type: 'button-group' as const,
      question: 'What type of business do you operate?',
      helper: 'This helps us tailor funding options to your industry.',
      options: [
        { value: 'retail', label: 'Retail/E-commerce' },
        { value: 'service', label: 'Service-based' },
        { value: 'manufacturing', label: 'Manufacturing' },
        { value: 'construction', label: 'Construction' },
        { value: 'restaurant', label: 'Restaurant/Food' },
        { value: 'other', label: 'Other' }
      ],
      required: true,
      sidebar: {
        title: 'Business Type Matters',
        content: 'Different industries have different funding needs and qualification requirements.'
      }
    },
    {
      id: 'funding_amount',
      type: 'button-group' as const,
      question: 'How much funding are you seeking?',
      helper: 'Select the range that best fits your needs.',
      options: [
        { value: '50k-100k', label: '$50,000 - $100,000' },
        { value: '100k-250k', label: '$100,000 - $250,000' },
        { value: '250k-500k', label: '$250,000 - $500,000' },
        { value: '500k-1m', label: '$500,000 - $1,000,000' },
        { value: '1m+', label: '$1,000,000+' }
      ],
      required: true,
      sidebar: {
        title: 'Funding Amount',
        content: 'We offer uncapped funding for qualifying businesses. Higher amounts may require additional documentation.'
      }
    },
    {
      id: 'funding_timeline',
      type: 'button-group' as const,
      question: 'When do you need the funding?',
      helper: 'This helps us prioritize your application.',
      options: [
        { value: 'asap', label: 'ASAP (24-48 hours)' },
        { value: 'week', label: 'Within a week' },
        { value: '2_4w', label: '2-4 weeks' },
        { value: 'research', label: 'Just researching options' }
      ],
      required: true,
      sidebar: {
        title: 'Timeline Matters',
        content: 'Faster funding may have different terms and requirements. We can accommodate urgent needs.'
      }
    },
    {
      id: 'credit_score',
      type: 'button-group' as const,
      question: 'What is your approximate personal credit score?',
      helper: "We use this to match you with the best funding options.",
      options: [
        { value: '750+', label: '750+ (Excellent)' },
        { value: '700-749', label: '700-749 (Good)' },
        { value: '650-699', label: '650-699 (Fair)' },
        { value: '600-649', label: '600-649 (Poor)' },
        { value: 'below-600', label: 'Below 600' },
        { value: 'unsure', label: 'Not sure' }
      ],
      required: true,
      sidebar: {
        title: 'Credit Score Impact',
        content: 'Higher credit scores typically qualify for better rates. We also offer revenue-based options that don\'t rely on credit.'
      }
    }
  ],
  
  loadingStep: {
    duration: 3000,
    apiEndpoint: config.api.qualification,
    stages: [
      { progress: 25, message: 'Analyzing your business profile...' },
      { progress: 50, message: 'Checking funding availability...' },
      { progress: 75, message: 'Matching with lenders...' },
      { progress: 100, message: 'Funding options found!' }
    ]
  },
  
  submission: {
    fields: [
      { id: 'first_name', type: 'text', label: 'First Name', placeholder: 'First Name', required: true },
      { id: 'last_name', type: 'text', label: 'Last Name', placeholder: 'Last Name', required: true },
      { id: 'email', type: 'email', label: 'Email', placeholder: 'you@example.com', required: true },
      { id: 'phone', type: 'tel', label: 'Phone', placeholder: '(___) ___-____', required: true },
      { id: 'business_name', type: 'text', label: 'Business Name', placeholder: 'Your Business Name', required: true },
      { id: 'leadid_token', type: 'hidden', label: 'LeadiD Token', required: false }
    ],
    consent: {
      text: 'By clicking "Get My Funding Options", you expressly consent to be contacted by Clockwork Funding and our lending partners at the number/email provided (including autodialed, prerecorded, and text messages) regarding business funding solutions. You also consent to receive marketing, service notifications, and account updates via SMS messaging. Consent not required to purchase. Message & data rates may apply. Messaging frequency may vary. Reply STOP to opt out of texts. See our <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Privacy Policy</a>, <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Terms of Service</a>, and <a href="/tcpa-disclaimer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">TCPA Disclaimer</a>.',
      required: true
    },
    webhook: config.api.leadSubmit
  }
};