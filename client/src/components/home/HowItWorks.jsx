// client/src/components/home/HowItWorks.jsx

import React from 'react';

const steps = [
  {
    number: '1',
    faIcon: 'fa-phone',
    title: 'Free Audit Call',
    description: '20-minute call to diagnose your exact need and confirm the right service package.',
  },
  {
    number: '2',
    faIcon: 'fa-file-alt',
    title: 'Written Proposal',
    description: 'Scope, deliverables, timeline, and investment — sent within 24 hours of your audit call.',
  },
  {
    number: '3',
    faIcon: 'fa-folder-open',
    title: 'Document Collection',
    description: 'We send you a precise checklist. You provide what\'s needed. We handle everything from there.',
  },
  {
    number: '4',
    faIcon: 'fa-cogs',
    title: 'Execution',
    description: 'We navigate the process. Status updates every 48 hours. You are always informed — never chasing.',
  },
  {
    number: '5',
    faIcon: 'fa-check-circle',
    title: 'Documented Delivery',
    description: 'Complete digital file delivered: confirmations, reference numbers, and next-step guidance.',
  },
];

const HowItWorks = () => {
  return (
    <section className="section-padding bg-neutral-offWhite">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary-teal mb-4">
            The Process
          </p>
          <h2 className="font-display text-4xl md:text-5xl font-light text-neutral-darkNavy mb-4 leading-tight" style={{ letterSpacing: '-0.02em' }}>
            Engaging IKaze is designed to be effortless.
          </h2>
          <p className="text-lg text-neutral-darkGray">
            Five clear steps from first contact to final delivery. No ambiguity. No chasing. No surprises.
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-0 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-primary-teal/20 z-0" style={{ top: '2.5rem' }} />

          {steps.map((step, index) => (
            <div
              key={index}
              className="relative z-10 flex flex-col items-center text-center px-4 py-2 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Step circle */}
              <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-xl mb-6 relative">
                <i className={`fas ${step.faIcon} text-white text-2xl`} />
                {/* Step number badge */}
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-primary-teal text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {step.number}
                </div>
              </div>

              <h3 className="font-semibold text-neutral-darkNavy mb-2 text-base">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-darkGray leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mt-16 max-w-2xl mx-auto bg-white border border-neutral-lightGray p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-primary-teal/10 rounded flex items-center justify-center flex-shrink-0">
              <i className="fas fa-shield-alt text-primary-teal" />
            </div>
            <div>
              <p className="font-semibold text-neutral-darkNavy mb-1 text-sm tracking-wide">
                Written scope before work begins
              </p>
              <p className="text-sm text-neutral-darkGray leading-relaxed">
                Every engagement starts with a written scope agreement. No work begins without your confirmation.
                No surprises in scope, timeline, or cost.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;