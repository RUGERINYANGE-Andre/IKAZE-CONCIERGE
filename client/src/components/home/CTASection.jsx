// client/src/components/home/CTASection.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const trustItems = [
  { faIcon: 'fa-check', text: 'No payment required to start' },
  { faIcon: 'fa-check', text: 'Written proposal within 24 hours' },
  { faIcon: 'fa-check', text: '2-hour response SLA' },
  { faIcon: 'fa-check', text: '100% documented delivery' },
];

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding relative overflow-hidden">

      {/* ── Background image ── */}
      <img
        src="https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1600&q=85&fit=crop"
        alt=""
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center 40%',
        }}
      />

      {/* ── Dark teal overlay — replaces the old bg-gradient-primary ── */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(135deg, rgba(11,110,114,0.88) 0%, rgba(16,135,139,0.80) 50%, rgba(28,58,46,0.90) 100%)',
        }}
      />

      {/* ── Dot pattern ── */}
      <div
        className="absolute inset-0"
        style={{
          opacity: 0.08,
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── Rwanda flag stripe ── */}
      <div
        style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
          background: 'linear-gradient(to bottom, #20603D, #FAD201, #1F4D9B)',
        }}
      />

      {/* ── Content ── */}
      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-tealLight mb-6">
            Ready to Begin?
          </p>

          <h2
            className="font-display text-4xl md:text-5xl font-light mb-6 leading-tight"
            style={{ letterSpacing: '-0.02em' }}
          >
            Your Rwanda process,{' '}
            <em className="italic">handled professionally.</em>
          </h2>

          <p className="text-lg mb-10 max-w-2xl mx-auto leading-relaxed" style={{ color: 'rgba(255,255,255,0.75)' }}>
            Start with a free 20-minute Rwanda Entry Audit. We will identify your exact need, confirm
            the right package, and give you two actionable insights before you pay anything.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/booking')}
              className="text-sm font-semibold tracking-widest uppercase flex items-center gap-2"
            >
              Book Your Free Audit — It's 20 Minutes
              <i className="fas fa-arrow-right text-xs" />
            </Button>
            <a href="https://wa.me/250788553034"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 text-sm font-semibold tracking-widest uppercase text-white border border-white/50 hover:bg-white/10 transition-all duration-300"
            >
              <i className="fab fa-whatsapp text-lg" />
              WhatsApp Us Directly
            </a>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {trustItems.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.75)' }}>
                <i className={`fas ${item.faIcon} text-xs`} style={{ color: '#E8C27A' }} />
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;