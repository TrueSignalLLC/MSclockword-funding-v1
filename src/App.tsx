import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './core/components/ErrorBoundary';
import { getSessionData } from './core/utils/session';
import { ClockworkFundingLayout } from './core/layouts/ClockworkFundingLayout';
import { PrivacyPolicy } from './core/pages/PrivacyPolicy';
import { TermsOfService } from './core/pages/TermsOfService';
import { TCPADisclaimer } from './core/pages/TCPADisclaimer';
import { Contact } from './core/pages/Contact';
import { QuizPage } from './core/pages/QuizPage';

function App() {

  useEffect(() => {
    getSessionData();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <Routes>
          {/* Layout-based routes */}
          <Route path="/" element={<ClockworkFundingLayout />} />
          
          {/* Quiz page */}
          <Route path="/quiz" element={<QuizPage />} />
          
          {/* Legal pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/tcpa-disclaimer" element={<TCPADisclaimer />} />
          
          {/* Contact page */}
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;