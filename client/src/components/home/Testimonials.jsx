// client/src/components/home/Testimonials.jsx

import React from 'react';
import Card from '../ui/Card';

const testimonials = [
  {
    text: "I had been trying to sort my mother's land title from the UK for nearly a year. IKaze resolved it in 11 days. I received a complete file with every document, every reference number, and a summary of what to do next. I did not have to ask for a single update.",
    name: 'Agathe N.',
    role: 'Diaspora Client, UK National Land Authority service',
    initial: 'A',
  },
  {
    text: "As an investor entering Rwanda for the first time, I needed more than just paperwork processing. I needed someone who understood how things actually work on the ground. IKaze gave me that and they did it with a level of professionalism I did not expect to find.",
    name: 'Michael B.',
    role: 'Foreign Investor RDB Business Setup, Kigali',
    initial: 'M',
  },
  {
    text: "Our NGO registration was taking months before we engaged IKaze. They identified three errors in our original filing within 24 hours of reviewing our documents. The correct application was filed within a week. The efficiency was remarkable.",
    name: 'Sarah O.',
    role: 'NGO Director RGB Registration, Rwanda',
    initial: 'S',
  },
];

const trustSignals = [
  {
    faIcon: 'fa-clipboard-list',
    title: 'Every engagement is documented',
    body: 'You receive a complete digital file for every engagement not a verbal update. Reference numbers, submission confirmations, and next steps. Always.',
  },
  {
    faIcon: 'fa-balance-scale',
    title: 'Written scope before work begins',
    body: 'Every engagement starts with a written scope agreement. No work begins without your confirmation. No surprises in scope, timeline, or cost.',
  },
  {
    faIcon: 'fa-credit-card',
    title: 'Secure, international payment options',
    body: 'Pay via Wise, Remitly, or MTN Mobile Money. Documented invoices via Wave. No cash-in-hand. No informal transactions. Every payment is traceable.',
  },
  {
    faIcon: 'fa-lock',
    title: 'Zero undisclosed payments',
    body: 'We do not make informal payments to government officials on your behalf. We navigate systems through their proper channels legally, professionally, and with a documented trail.',
  },
];

const clientCountries = [
  { flag: '🇬🇧', label: 'United Kingdom' },
  { flag: '🇧🇪', label: 'Belgium' },
  { flag: '🇺🇸', label: 'United States' },
  { flag: '🇨🇦', label: 'Canada' },
];

const Testimonials = () => {
  return (
    <section className="section-padding bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: trust signals */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-primary-teal mb-4">
              Why Clients Trust IKaze
            </p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-neutral-darkNavy mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
              Trust is not claimed.<br />
              It is earned through evidence.
            </h2>
            <p className="text-lg text-neutral-darkGray leading-relaxed mb-10">
              You are engaging a service that handles sensitive documents, government submissions, and processes
              with real financial and legal consequences. Here is why our clients trust us with theirs.
            </p>

            <div className="space-y-6">
              {trustSignals.map((signal, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-teal/10 rounded flex items-center justify-center flex-shrink-0">
                    <i className={`fas ${signal.faIcon} text-primary-teal`} />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-darkNavy mb-1 text-sm">{signal.title}</p>
                    <p className="text-sm text-neutral-darkGray leading-relaxed">{signal.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: testimonials */}
          <div className="space-y-6">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="animate-slide-up border border-neutral-lightGray"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Stars */}
                <div className="flex items-center mb-4 gap-1">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className="fas fa-star text-yellow-400 text-sm" />
                  ))}
                </div>

                <p className="text-neutral-darkGray mb-6 italic text-sm leading-relaxed">
                  "{testimonial.text}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {testimonial.initial}
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-darkNavy text-sm">{testimonial.name}</p>
                    <p className="text-xs text-neutral-gray">{testimonial.role}</p>
                  </div>
                </div>
              </Card>
            ))}

            {/* Client country flags */}
            <div className="flex items-center gap-4 pt-2 flex-wrap">
              <span className="text-xs font-semibold tracking-widest uppercase text-neutral-gray">Clients from:</span>
              {clientCountries.map((country) => (
                <div key={country.label} className="flex items-center gap-2">
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-xs text-neutral-gray">{country.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;