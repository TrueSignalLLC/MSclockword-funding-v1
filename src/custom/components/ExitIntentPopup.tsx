import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { quizConfig } from '../../config/quiz.config';
import { useNavigate } from 'react-router-dom';
import { storeQuizAnswer } from '../../core/utils/session';

// Global variable (valid only until the page is reloaded)
let popupAlreadyShown = false;

export const ExitIntentPopup: React.FC = () => {
    const navigate = useNavigate();
    const [selectedFundingAmount, setSelectedFundingAmount] = useState('');
    const [showFundingAmountError, setShowFundingAmountError] = useState(false);
    const [showExitPopup, setShowExitPopup] = useState(false);

    const handleGetQualified = () => {
        if (!selectedFundingAmount) {
            setShowFundingAmountError(true);
            return;
        }
        storeQuizAnswer('funding_amount', selectedFundingAmount);
        navigate('/quiz');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    useEffect(() => {
        // === DESKTOP: detect mouse leaving the viewport ===
        const handleMouseLeave = (event: MouseEvent) => {
            if (event.clientY <= 0 && !popupAlreadyShown) {
                setShowExitPopup(true); // show the exit-intent popup
                popupAlreadyShown = true; // mark that popup has been shown
            }
        };
        document.addEventListener("mouseleave", handleMouseLeave);

        // === MOBILE: detect back button / popstate event ===
        const handlePopState = () => {
            if (!popupAlreadyShown) {
                setShowExitPopup(true); // show the popup on first back attempt
                popupAlreadyShown = true;
                // immediately push a fake state so the user stays on the same page
                window.history.pushState({ exitIntent: true }, "", window.location.href);
            } else {
                // if popup was already shown, allow normal back navigation
                window.history.back();
            }
        };

        // Push a fake history state on page load to intercept the first back button
        window.history.pushState({ exitIntent: true }, "", window.location.href);
        window.addEventListener("popstate", handlePopState);

        return () => {
            // cleanup event listeners on component unmount
            document.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("popstate", handlePopState);
        };
    }, []);


    if (!showExitPopup) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white pt-6 flex items-center justify-center">
                    <img
                        src="/logo__2_-removebg-preview.png"
                        alt="Clockwork Funding Logo"
                        className="w-[240px] h-[79px]"
                    />
                    <button
                        onClick={() => setShowExitPopup(false)}
                        className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <div className="p-6">
                    <div className="space-y-6">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                COMPLETE YOUR INFO TO APPLY NOW
                            </h3>
                            {quizConfig.steps[0].helper && (
                                <p className="text-gray-700 mb-6">
                                    This form takes <span className="font-bold">20 - 30 seconds on average</span> and will <span className="font-bold">NOT</span> take a hard credit pull.
                                </p>
                            )}
                        </div>

                        <div className="max-w-md mx-auto space-y-4">
                            <select
                                value={selectedFundingAmount}
                                onChange={(e) => {
                                    setSelectedFundingAmount(e.target.value);
                                    setShowFundingAmountError(false);
                                }}
                                className="w-full p-4 border-2 border-gray-300 rounded-xl text-center text-lg font-semibold bg-white focus:border-clockwork-orange-500 focus:ring-2 focus:ring-clockwork-orange-500 focus:outline-none"
                            >
                                <option value="">Select funding amount...</option>
                                {quizConfig.steps[0].options?.map((option: any, index: number) => (
                                    <option key={index} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {showFundingAmountError && (
                                <p className="text-red-600 text-sm text-center">
                                    Please select a funding amount to continue
                                </p>
                            )}

                            <button
                                onClick={handleGetQualified}
                                className="w-full bg-clockwork-orange-500 hover:bg-clockwork-orange-600 disabled:bg-gray-400 text-white font-bold text-xl py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                disabled={!selectedFundingAmount}
                            >
                                Get Qualified
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
