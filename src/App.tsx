import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './core/components/ErrorBoundary';
import { getSessionData } from './core/utils/session';
import { ClockworkFundingLayout } from './core/layouts/ClockworkFundingLayout';
import { HeroLayout } from './core/layouts/HeroLayout';
import { TOFULayout } from './core/layouts/TOFULayout';
import { PrivacyPolicy } from './core/pages/PrivacyPolicy';
import { TermsOfService } from './core/pages/TermsOfService';
import { TCPADisclaimer } from './core/pages/TCPADisclaimer';
import { Contact } from './core/pages/Contact';
import ADTOutcome from './pages/outcome/adt';
import GenericOutcome from './pages/outcome/GenericOutcome';

function App() {
  // Temporary debugging code for environment variables
  console.log('Environment Variables Check:', {
    emailValidator: import.meta.env.VITE_EMAIL_VALIDATOR,
    zipValidator: import.meta.env.VITE_ZIP_VALIDATOR,
    phoneValidator: import.meta.env.VITE_PHONE_VALIDATOR,
    leadWebhook: import.meta.env.VITE_LEAD_WEBHOOK,
    env: import.meta.env.VITE_ENV
  });

  useEffect(() => {
    getSessionData();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Layout-based routes */}
          <Route path="/" element={<ClockworkFundingLayout />} />
          <Route path="/get-quote" element={<HeroLayout />} />
          <Route path="/quiz" element={<HeroLayout />} />
          <Route path="/start-quiz" element={<TOFULayout />} />
          
          {/* Legal pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/tcpa-disclaimer" element={<TCPADisclaimer />} />
          
          {/* Outcome pages */}
          <Route path="/outcome" element={<GenericOutcome />} />
          <Route path="/outcome/adt" element={<ADTOutcome />} />
          
          {/* Contact page */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;