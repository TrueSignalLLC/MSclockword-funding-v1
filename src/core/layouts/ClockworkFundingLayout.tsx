import React from 'react';
import { ClockworkFAQ } from '../../custom/components/ClockworkFAQ';
import { ClockworkHero } from '../../custom/components/ClockworkHero';
import { FundingBenefits } from '../../custom/components/FundingBenefits';
import { FundWhatOthersWont } from '../../custom/components/FundWhatOthersWont';
import { NoHiddenFeesMiddlemen } from '../../custom/components/NoHiddenFeesMiddlemen';
import { OurApproach } from '../../custom/components/OurApproach';
import { ProcessSection } from '../../custom/components/ProcessSection';
import { UltraFlexibleFunding } from '../../custom/components/UltraFlexibleFunding';
import { ComplianceScripts } from '../components/ComplianceScripts';
import { Footer } from '../components/Footer';
import { ExitIntentPopup } from '../../custom/components/ExitIntentPopup';

export const ClockworkFundingLayout: React.FC = () => {

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

  return (
    <div className="min-h-screen bg-white">
      <ExitIntentPopup />
      <ComplianceScripts />
      <ClockworkHero />
      <FundingBenefits onScrollToHero={handleScrollToHero} />
      <OurApproach onScrollToHero={handleScrollToHero} />
      <ProcessSection onScrollToHero={handleScrollToHero} />
      <UltraFlexibleFunding />
      <NoHiddenFeesMiddlemen />
      <FundWhatOthersWont onScrollToHero={handleScrollToHero} />
      <ClockworkFAQ onScrollToHero={handleScrollToHero} />
      <Footer />
    </div>
  );
};