import React, { useState } from 'react';
import { ClockworkHero } from '../../custom/components/ClockworkHero';
import { FundingBenefits } from '../../custom/components/FundingBenefits';
import { OurApproach } from '../../custom/components/OurApproach';
import { OurProcess } from '../../custom/components/OurProcess';
import { NoHiddenFees } from '../../custom/components/NoHiddenFees';
import { ClockworkFAQ } from '../../custom/components/ClockworkFAQ';
import { Footer } from '../components/Footer';
import { QuizOverlay } from '../components/QuizOverlay';
import { ComplianceScripts } from '../components/ComplianceScripts';

export const ClockworkFundingLayout: React.FC = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  const handleQuizStart = () => {
    // Track event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'quiz_start_clockwork', {
        event_category: 'engagement',
        event_label: 'Clockwork Funding Page'
      });
    }
    setIsQuizOpen(true);
  };

  const handleQuizClose = () => {
    setIsQuizOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <ComplianceScripts />
      <ClockworkHero onQuizStart={handleQuizStart} />
      <FundingBenefits onQuizStart={handleQuizStart} />
      <UltraFlexibleFunding />
      <OurApproach onQuizStart={handleQuizStart} />
      <UltraFlexibleFunding />
      <FundWhatOthersWont onQuizStart={handleQuizStart} />
      <ClockworkFAQ onQuizStart={handleQuizStart} />
      <Footer />
      <QuizOverlay isOpen={isQuizOpen} onClose={handleQuizClose} />
    </div>
  );
};