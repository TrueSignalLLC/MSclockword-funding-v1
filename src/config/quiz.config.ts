import { config } from './environment.config';

export const quizConfig = {
  steps: [
    {
      id: 'funding_amount',
      type: 'button-group' as const,
      question: 'How much do you need?',
      helper: 'If you are unsure, 10% of annual revenue is a good place to start',
      options: [
        { value: '5k-49k', label: '$5-49,999' },
        { value: '50k-99k', label: '$50k-99,999' },
        { value: '100k-249k', label: '$100k-249,999' },
        { value: '250k-500k', label: '$250k-500k' },
        { value: '500k-1m', label: '$500k-1M' },
        { value: '1m-5m', label: '$1-4.99M' },
        { value: '5m-15m', label: '$5M-15M' }
      ],
      required: true,
      sidebar: {
        title: 'Funding Amount',
        content: 'We offer uncapped funding for qualifying businesses. Higher amounts may require additional documentation.'
      }
    },
    {
      id: 'company_type',
      type: 'button-group' as const,
      question: 'Type of company?',
      helper: 'Select your business structure.',
      options: [
        { value: 'llc', label: 'Limited Liability Company | LLC' },
        { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
        { value: 'partnership', label: 'Partnership' },
        { value: 'c_corp', label: 'C Corporation' },
        { value: 's_corp', label: 'S Corporation' }
      ],
      required: true,
      sidebar: {
        title: 'Business Structure',
        content: 'Different business structures have different funding requirements and qualification criteria.'
      }
    },
    {
      id: 'financing_purpose',
      type: 'multi-select' as const,
      question: 'What are you getting the financing for?',
      helper: 'Select all that apply.',
      options: [
        { value: 'mergers_acquisitions', label: 'Mergers and acquisitions' },
        { value: 'working_capital', label: 'Working Capital / Cash Flow' },
        { value: 'equipment', label: 'Equipment Purchase' },
        { value: 'expansion', label: 'Expansion' },
        { value: 'inventory', label: 'Inventory' },
        { value: 'payroll', label: 'Payroll' },
        { value: 'other', label: 'Other' }
      ],
      required: true,
      sidebar: {
        title: 'Financing Purpose',
        content: 'Understanding how you plan to use the funds helps us match you with the right financing options.'
      }
    },
    {
      id: 'monthly_revenue',
      type: 'slider' as const,
      question: "What's your average monthly revenue?",
      helper: 'Move the slider to select your monthly revenue range.',
      min: 50000,
      max: 50000000,
      step: 50000,
      formatValue: (value: number) => {
        if (value >= 50000000) return '$50,000,000+';
        if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
        if (value >= 1000) return `$${(value / 1000).toFixed(0)}k`;
        return `$${value.toLocaleString()}`;
      },
      required: true,
      sidebar: {
        title: 'Monthly Revenue',
        content: 'Your monthly revenue helps us determine the appropriate funding amount and terms for your business.'
      }
    },
    {
      id: 'credit_score',
      type: 'button-group' as const,
      question: "What's your estimated personal credit score?",
      helper: "We use this to match you with the best funding options.",
      options: [
        { value: '720+', label: 'Excellent (720+)' },
        { value: '680-719', label: 'Good (680 - 719)' },
        { value: '640-679', label: 'Fair (640 - 679)' },
        { value: '639-', label: 'Poor (639 or less)' }
      ],
      required: true,
      sidebar: {
        title: 'Credit Score Impact',
        content: 'Higher credit scores typically qualify for better rates. We also offer revenue-based options that don\'t rely heavily on credit.'
      }
    },
    {
      id: 'business_age',
      type: 'button-group' as const,
      question: 'When did you start your business?',
      helper: 'Select how long your business has been operating.',
      options: [
        { value: '0-5months', label: '0 - 5 Months' },
        { value: '6-12months', label: '6 - 12 Months' },
        { value: '1-2years', label: '1 - 2 Years' },
        { value: '2-5years', label: '2 - 5 Years' },
        { value: '5-10years', label: '5 - 10 Years' },
        { value: '10+years', label: '10+ Years' }
      ],
      required: true,
      sidebar: {
        title: 'Business Age',
        content: 'Time in business affects funding options and terms. Newer businesses may have different qualification requirements.'
      }
    },
    {
      id: 'business_industry',
      type: 'button-group' as const,
      question: 'What industry is your business in?',
      helper: 'Select the industry that best describes your business.',
      options: [
        { value: 'construction', label: 'Construction' },
        { value: 'transportation', label: 'Transportation and Warehousing' },
        { value: 'hospitality', label: 'Accommodation and Food Services' },
        { value: 'retail', label: 'Retail Trade' },
        { value: 'other', label: 'Other' }
      ],
      required: true,
      sidebar: {
        title: 'Industry Type',
        content: 'Different industries have different funding needs and qualification requirements.'
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
      { id: 'business_zip', type: 'text', label: 'Business ZIP Code', placeholder: 'ZIP Code', required: true },
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