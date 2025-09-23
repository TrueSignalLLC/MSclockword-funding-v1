import React, { useState, useEffect } from 'react';
import { TOFUHero } from '../../custom/components/TOFUHero';
import { PainAgitation } from '../../custom/components/PainAgitation';
import { ComparisonSection } from '../../custom/components/ComparisonSection';
import { SocialProofWall } from '../../custom/components/SocialProofWall';
import { EducationalValueProps } from '../../custom/components/EducationalValueProps';
import { SimpleHowItWorks } from '../../custom/components/SimpleHowItWorks';
import { TOFUFinalCTA } from '../../custom/components/TOFUFinalCTA';
import { Footer } from '../components/Footer';
import { QuizOverlay } from '../components/QuizOverlay';
import { ComplianceScripts } from '../components/ComplianceScripts';
import { MovingBanner } from '../components/MovingBanner';

export const TOFULayout: React.FC = () => {
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercentage = (window.scrollY / document.body.scrollHeight) * 100;
      setShowStickyBar(scrollPercentage > 25);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleQuizStart = () => {
    // Track event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'quiz_start_tofu', {
        event_category: 'engagement',
        event_label: 'TOFU Page'
      });
    }
    setIsQuizOpen(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <ComplianceScripts />
      
      <TOFUHero onQuizStart={handleQuizStart} />
      
      <MovingBanner />
      
      <PainAgitation />
      
      <ComparisonSection onQuizStart={handleQuizStart} />
      
      <SocialProofWall />
      
      <EducationalValueProps />
      
      <SimpleHowItWorks onQuizStart={handleQuizStart} />
      
      <TOFUFinalCTA onQuizStart={handleQuizStart} />
      
      <Footer />
      
      <QuizOverlay isOpen={isQuizOpen} onClose={() => setIsQuizOpen(false)} />
      
      {/* Mobile Sticky Bar */}
      {showStickyBar && (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-blue-900 p-3 shadow-lg">
          <button
            onClick={handleQuizStart}
            className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg"
          >
            Get Protected Now →
          </button>
        </div>
      )}
    </div>
  );
};