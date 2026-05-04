// client/src/components/home/ServiceCards.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { SERVICES } from '../../utils/constants';

// Static service definitions from the HTML — used as fallback / display data
const STATIC_SERVICES = [
  {
    id: 'business-setup',
    num: '01 / 04',
    faIcon: 'fa-building',
    name: 'Business Setup & Registration',
    for: 'Foreign investors · Entrepreneurs · Diaspora starting a business',
    body: 'Complete end-to-end Rwanda Development Board registration management. We handle every step from selecting the right company structure to obtaining your trading licence so you can focus on building your business, not navigating its paperwork.',
    features: [
      'RDB company registration (all structures)',
      'TIN registration & trading licence',
      'Bank account introduction',
      '30-day post-registration support',
    ],
    timeline: '5–7 Business Days',
  },
  {
    id: 'ngo-registration',
    num: '02 / 04',
    faIcon: 'fa-handshake',
    name: 'NGO & Association Registration',
    for: 'International NGOs · Local associations · Development foundations · Faith organisations',
    body: "Rwanda Governance Board registration is complex, multi-step, and unforgiving of errors. We navigate every requirement from articles of association coordination to Ministry of Local Government alignment with precision and without surprises.",
    features: [
      'RGB registration process management',
      'Documentation preparation & review',
      'Ministry alignment support',
      '45-day post-registration support',
    ],
    timeline: '7–14 Business Days',
    popular: true,
  },
  {
    id: 'irembo-services',
    num: '03 / 04',
    faIcon: 'fa-landmark',
    name: 'IremboGov & Government Services',
    for: 'Diaspora · Investors · Anyone needing Rwandan government processes handled',
    body: "From immigration documents to land searches, visa extensions to certificates of good conduct — we navigate IremboGov's full service catalogue with deep operational knowledge. One process or ten: we handle it with the same professional standard.",
    features: [
      'All IremboGov service categories',
      'National Land Authority searches & transfers',
      'Immigration, permits & documentation',
      'Certificate & verification services',
    ],
    timeline: '24–72 Hours (per service)',
  },
  {
    id: 'vip-relocation',
    num: '04 / 04',
    faIcon: 'fa-star',
    name: 'VIP Relocation & Full Entry',
    for: 'Relocating executives · Expat families · Senior NGO staff · HNW individuals',
    body: 'From the moment your flight lands to the day you feel settled — we manage every detail. Accommodation, SIM cards, banking, neighbourhood orientation, school introductions, and all documentation. Rwanda should feel like an opportunity from Day 1, not a logistical challenge.',
    features: [
      'Airport arrival & first-day logistics',
      'Vetted accommodation coordination',
      'Banking, SIM & mobile money setup',
      '60-day post-arrival dedicated support',
    ],
    timeline: 'Full-service from arrival day',
  },
];

const ServiceCards = () => {
  const navigate = useNavigate();

  // Use SERVICES from constants if available, otherwise use static data
  const displayServices = (SERVICES && SERVICES.length > 0) ? SERVICES : STATIC_SERVICES;

  return (
    <section className="section-padding bg-neutral-offWhite">
      {/* Marquee bar */}
      <div className="bg-neutral-darkNavy overflow-hidden border-b border-primary-teal/20 mb-16">
        <div
          className="flex gap-16 py-3 whitespace-nowrap"
          style={{ animation: 'marquee 30s linear infinite', width: 'max-content' }}
        >
          {[
            'IremboGov Service Navigation',
            'RDB Business Registration',
            'Rwanda Governance Board NGO Setup',
            'National Land Authority Services',
            'Immigration & Relocation',
            'VIP Entry & Execution',
            'IremboGov Service Navigation',
            'RDB Business Registration',
            'Rwanda Governance Board NGO Setup',
            'National Land Authority Services',
            'Immigration & Relocation',
            'VIP Entry & Execution',
          ].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-4 text-xs font-semibold tracking-widest uppercase text-white/60"
            >
              <span className="w-1 h-1 rounded-full bg-primary-teal inline-block flex-shrink-0" />
              {item}
            </span>
          ))}
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </div>

      <div className="container-custom">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end mb-16 animate-fade-in">
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary-teal mb-4">
              What We Do
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-neutral-darkNavy leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Four service categories.<br />One professional partner.
            </h2>
          </div>
          <p className="text-lg text-neutral-darkGray leading-relaxed">
            Each service category is designed around a specific type of client need. We do not offer everything
            we offer the right things, executed to a professional standard that matches your expectations.
          </p>
        </div>

        {/* Services grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-lightGray border border-neutral-lightGray">
          {STATIC_SERVICES.map((service, index) => (
            <div
              key={service.id}
              className="bg-white p-10 relative overflow-hidden group transition-all duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Gold top bar on hover */}
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-primary-teal to-primary-tealLight scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

              {/* Popular badge */}
              {service.popular && (
                <div className="absolute top-4 right-4 bg-primary-teal text-white px-3 py-1 text-xs font-semibold tracking-wider uppercase rounded-sm">
                  <i className="fas fa-star mr-1 text-xs" />
                  Most Popular
                </div>
              )}

              <span className="block text-sm font-medium tracking-widest text-primary-teal mb-3" style={{ fontFamily: 'inherit' }}>
                {service.num}
              </span>

              <div className="w-10 h-10 bg-primary-teal/10 rounded flex items-center justify-center mb-4">
                <i className={`fas ${service.faIcon} text-primary-teal text-lg`} />
              </div>

              <h3 className="font-display text-2xl font-normal text-neutral-darkNavy mb-2 leading-snug" style={{ letterSpacing: '-0.01em' }}>
                {service.name}
              </h3>

              <p className="text-xs font-semibold tracking-widest uppercase text-neutral-gray mb-4">
                {service.for}
              </p>

              <p className="text-sm text-neutral-darkGray leading-relaxed mb-5">
                {service.body}
              </p>

              <ul className="space-y-2 mb-6">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-neutral-darkGray">
                    <span className="text-primary-teal font-bold flex-shrink-0 mt-0.5">—</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary-teal/5 border border-primary-teal/20 text-xs font-semibold tracking-widest uppercase text-neutral-darkNavy">
                <i className="fas fa-clock text-primary-teal" />
                {service.timeline}
              </div>
            </div>
          ))}
        </div>

        {/* CTA link */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            variant="ghost"
            onClick={() => navigate('/services')}
            className="text-sm font-semibold tracking-widest uppercase flex items-center gap-2 mx-auto"
          >
            View Full Service Details
            <i className="fas fa-arrow-right text-xs" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;