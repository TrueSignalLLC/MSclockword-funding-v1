import React, { useState } from 'react';
import { ClockworkHero } from '../../custom/components/ClockworkHero';
import { FundingBenefits } from '../../custom/components/FundingBenefits';
import { OurApproach } from '../../custom/components/OurApproach';
import { ProcessSection } from '../../custom/components/ProcessSection';
import { OurProcess } from '../../custom/components/OurProcess';
import { UltraFlexibleFunding } from '../../custom/components/UltraFlexibleFunding';
import { NoHiddenFeesMiddlemen } from '../../custom/components/NoHiddenFeesMiddlemen';
import { FundWhatOthersWont } from '../../custom/components/FundWhatOthersWont';
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

  const handleScrollToHero = () => {
    // Scroll to the hero form section
    const heroForm = document.getElementById('hero-form');
    if (heroForm) {
      heroForm.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    } else {
      // Fallback to top of page if element not found
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  };

  const handleQuizClose = () => {
    setIsQuizOpen(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <ComplianceScripts />
      <ClockworkHero onQuizStart={handleQuizStart} />
      <FundingBenefits onScrollToHero={handleScrollToHero} />
      <OurApproach onScrollToHero={handleScrollToHero} />
      <ProcessSection onScrollToHero={handleScrollToHero} />
      <UltraFlexibleFunding />
      <NoHiddenFeesMiddlemen />
      <FundWhatOthersWont onScrollToHero={handleScrollToHero} />
      <ClockworkFAQ onScrollToHero={handleScrollToHero} />
      <Footer />
      <QuizOverlay isOpen={isQuizOpen} onClose={handleQuizClose} />
    </div>
  );
};