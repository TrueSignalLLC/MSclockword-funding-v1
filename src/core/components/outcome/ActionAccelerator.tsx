import React, { useState, useEffect } from 'react';
import { Phone, Calendar, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { getSessionData } from '../../utils/session';

interface ActionAcceleratorProps {
  cta: {
    primary: {
      text: string;
      action: string;
      phone?: string;
    };
    secondary: {
      text: string;
      action: string;
    };
  };
  urgency: {
    message: string;
    countdown: boolean;
  };
  userData: {
    firstName: string;
    city: string;
    zip: string;
    homeType: string;
  };
}

export const ActionAccelerator: React.FC<ActionAcceleratorProps> = ({ cta, urgency, userData }) => {
  const [showCallbackForm, setShowCallbackForm] = useState(false);
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    preferredTime: '',
    phoneNumber: '',
    notes: ''
  });

  // Replace placeholders in urgency message
  const urgencyMessage = urgency.message.replace('{city}', userData.city);

  const handlePrimaryAction = () => {
    if (cta.primary.action === 'call' && cta.primary.phone) {
      window.location.href = `tel:${cta.primary.phone}`;
    }
  };

  const handleSecondaryAction = () => {
    if (cta.secondary.action === 'calendar') {
      setShowCallbackForm(true);
    }
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the callback request to your backend
    console.log('Callback request:', formData);
    setCallbackSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setShowCallbackForm(false);
      setCallbackSubmitted(false);
      setFormData({ preferredTime: '', phoneNumber: '', notes: '' });
    }, 3000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Urgency Message */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-full mb-4">
            <AlertCircle className="w-5 h-5" />
            <span className="font-semibold">Limited Availability</span>
          </div>
          <p className="text-xl mb-2">{urgencyMessage}</p>
          <p className="text-blue-100">Secure your spot before they're gone</p>
        </div>

        {/* Main CTA Section */}
        <div className="bg-white rounded-2xl p-8 text-gray-900 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Protect Your Home?
            </h2>
            <p className="text-xl text-gray-600">
              Take action now and get protected as soon as tomorrow
            </p>
          </div>

          {!showCallbackForm ? (
            <div className="space-y-4">
              {/* Primary CTA */}
              <button
                onClick={handlePrimaryAction}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold text-xl py-4 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center gap-3"
              >
                <Phone className="w-6 h-6" />
                {cta.primary.text}
              </button>
              
              {cta.primary.phone && (
                <p className="text-center text-gray-600">
                  Call now: <span className="font-semibold">{cta.primary.phone}</span>
                </p>
              )}

              {/* Secondary CTA */}
              <button
                onClick={handleSecondaryAction}
                className="w-full border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold text-lg py-3 px-8 rounded-lg transition-colors duration-300 flex items-center justify-center gap-3"
              >
                <Calendar className="w-5 h-5" />
                {cta.secondary.text}
              </button>
            </div>
          ) : (
            /* Callback Form */
            <div>
              {!callbackSubmitted ? (
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <h3 className="text-xl font-bold text-center mb-4">
                    Schedule Your Callback
                  </h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Preferred Call Time
                    </label>
                    <select
                      value={formData.preferredTime}
                      onChange={(e) => handleInputChange('preferredTime', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select a time</option>
                      <option value="morning">Morning (9 AM - 12 PM)</option>
                      <option value="afternoon">Afternoon (12 PM - 5 PM)</option>
                      <option value="evening">Evening (5 PM - 8 PM)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Any specific questions or concerns?"
                      rows={3}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowCallbackForm(false)}
                      className="flex-1 border border-gray-300 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Schedule Callback
                    </button>
                  </div>
                </form>
              ) : (
                /* Success Message */
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-green-600 mb-2">
                    Callback Scheduled!
                  </h3>
                  <p className="text-gray-600">
                    An ADT representative will call you during your preferred time window.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-8">
          <div className="flex flex-wrap justify-center items-center gap-6 text-blue-100">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>No obligation consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Licensed professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              <span>Same-day installation available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};