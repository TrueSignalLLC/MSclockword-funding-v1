import React, { useState } from 'react';
import { tofuContent } from '../../config/tofuContent.config';

interface TOFUHeroProps {
  onQuizStart: () => void;
}

export const TOFUHero: React.FC<TOFUHeroProps> = ({ onQuizStart }) => {
  return (
    <section className="hero-section relative min-h-screen flex items-center bg-gradient-to-br from-slate-900 via-blue-900 to-blue-800">
      {/* Background overlay with pattern */}
      <div className="absolute inset-0 bg-black opacity-20"></div>
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      
      <div className="hero-content relative z-10 w-full max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          
          {/* Left Column - Content */}
          <div className="text-white">
            {/* Trust Badge with Logo */}
            <div className="flex items-center gap-3 mb-6">
              <img 
                src="/yourhomesecured-330x330-website (1).svg" 
                alt="YourHomeSecured Logo" 
                className="w-10 h-10"
              />
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
                <span className="text-green-400">✓</span>
                <span className="text-sm">Trusted by 10,000+ Families</span>
              </div>
            </div>
            
            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {tofuContent.hero.headline}
            </h1>
            
            {/* Subheadline */}
            <p className="text-xl md:text-2xl text-blue-100 mb-4">
              {tofuContent.hero.subheadline}
            </p>
            
            {/* Supporting text */}
            <p className="text-lg text-blue-200 mb-8">
              {tofuContent.hero.subText}
            </p>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {tofuContent.hero.stats.map((stat, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur p-4 rounded-lg">
                  <div className="text-2xl font-bold text-orange-400">
                    {stat.number}{stat.unit}
                  </div>
                  <div className="text-sm text-blue-200">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Right Column - Form */}
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Get your free Home Security Quote
              </h2>
              <p className="text-gray-600">
                No credit check • No obligation • 60 seconds
              </p>
            </div>
            
            <form className="space-y-4">
              <button
                type="button"
                onClick={onQuizStart}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-4 rounded-lg transition-all transform hover:scale-105"
              >
                Secure my home now
              </button>
              
              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  <span className="text-xs md:text-sm font-medium text-gray-700">Best Price</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✗</span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">No Credit Card</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">⏱</span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">60 Seconds</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">%</span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-600">100% Free</span>
                </div>
              </div>
              
              <p className="text-xs text-center text-gray-500">
                {tofuContent.hero.cta.subtext}
              </p>
            </form>
            
            {/* Trust indicators */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-center text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 md:mb-4">
                Trusted by Leading Brands
              </p>
              <div className="flex items-center justify-center gap-4 md:gap-8 opacity-70 mb-4">
                <img src="/ADT.jpg" alt="ADT" className="h-6 md:h-8 lg:h-10 object-contain grayscale hover:grayscale-0 transition-all" />
                <img src="/BRINKS.jpg" alt="Brinks" className="h-6 md:h-8 lg:h-10 object-contain grayscale hover:grayscale-0 transition-all" />
                <img src="/RING.jpg" alt="Ring" className="h-6 md:h-8 lg:h-10 object-contain grayscale hover:grayscale-0 transition-all" />
                <img src="/SIMPLISAFE.jpg" alt="SimpliSafe" className="h-6 md:h-8 lg:h-10 object-contain grayscale hover:grayscale-0 transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};