// client/src/components/home/Hero.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button';

const SLIDESHOW_IMAGES = [
    {
    src: 'https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?w=1400&q=85&fit=crop',
    alt: 'Luxury hotel swimming pool in Rwanda',
  },
  {
    src: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=1400&q=85&fit=crop',
    alt: 'Premium hotel room with city view in Kigali',
  },

  {
    src: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1400&q=85&fit=crop',
    alt: 'Luxury hotel exterior in Kigali, Rwanda',
  },
  {
    src: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1400&q=85&fit=crop',
    alt: 'Modern hotel suite in Rwanda',
  },
  {
    src: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=1400&q=85&fit=crop',
    alt: 'Elegant hotel lobby in Kigali',
  },

];

const INTERVAL_MS = 5000;

const Hero = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((index) => {
    setCurrent(index);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % SLIDESHOW_IMAGES.length);
    }, INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
      {/* ── LEFT: slideshow panel ── */}
      <div className="relative hidden lg:block order-1" style={{ minHeight: '100vh' }}>

        {/* Slideshow layers — crossfade via opacity */}
        {SLIDESHOW_IMAGES.map((img, i) => (
          <img
            key={img.src}
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full object-cover object-center"
            style={{
              opacity: i === current ? 0.92 : 0,
              transition: 'opacity 1.4s ease-in-out',
              zIndex: 1,
            }}
          />
        ))}

        {/* Teal tint overlay */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 2,
            background:
              'linear-gradient(135deg, rgba(11,110,114,0.60) 0%, rgba(11,110,114,0.25) 55%, transparent 100%)',
          }}
        />

        {/* Blend into ivory right side */}
        <div
          className="absolute inset-0"
          style={{ zIndex: 3, background: 'linear-gradient(to right, transparent 52%, #F8F5EF 100%)' }}
        />

        {/* Dot grid */}
        <div
          className="absolute inset-0"
          style={{
            zIndex: 4,
            opacity: 0.18,
            backgroundImage:
              'radial-gradient(circle at 2px 2px, rgba(201,151,58,0.7) 1px, transparent 0)',
            backgroundSize: '38px 38px',
          }}
        />

        {/* Rwanda flag stripe */}
        <div
          className="absolute top-0 left-0 w-1 h-full z-10"
          style={{ background: 'linear-gradient(to bottom, #20603D, #FAD201, #1F4D9B)' }}
        />

        {/* Slide counter — top left */}
        <div
          style={{
            position: 'absolute',
            top: 22,
            left: 22,
            zIndex: 10,
            fontFamily: "'Courier New', monospace",
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.55)',
            letterSpacing: '0.15em',
          }}
        >
          {String(current + 1).padStart(2, '0')} / {String(SLIDESHOW_IMAGES.length).padStart(2, '0')}
        </div>

        {/* Slide dot indicators */}
        <div
          style={{
            position: 'absolute',
            bottom: 80,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 10,
            display: 'flex',
            gap: 8,
          }}
        >
          {SLIDESHOW_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? 22 : 6,
                height: 6,
                borderRadius: i === current ? 3 : '50%',
                background: i === current ? '#E8C27A' : 'rgba(255,255,255,0.40)',
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </div>

        {/* Floating stat badge */}
        <div
          className="absolute bottom-10 left-10 z-10"
          style={{
            background: 'rgba(11,110,114,0.70)',
            border: '1px solid rgba(201,151,58,0.35)',
            backdropFilter: 'blur(10px)',
            padding: '1.25rem 1.6rem',
            maxWidth: 240,
            borderRadius: 2,
          }}
        >
          <span
            style={{
              display: 'block',
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '3rem',
              fontWeight: 300,
              color: '#E8C27A',
              lineHeight: 1,
            }}
          >
            48h
          </span>
          <span
            style={{
              display: 'block',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.65)',
              marginTop: 5,
              lineHeight: 1.45,
            }}
          >
            Average time to first submission
            <br />
            from document receipt
          </span>
        </div>

        {/* Country flag strip */}
        <div
          style={{
            position: 'absolute',
            bottom: 10,
            right: 22,
            zIndex: 8,
            display: 'flex',
            gap: 6,
            flexWrap: 'wrap',
            justifyContent: 'flex-end',
          }}
        >
          {['🇬🇧', '🇧🇪', '🇺🇸', '🇨🇦', '🇳🇱'].map((f) => (
            <span
              key={f}
              style={{
                fontSize: '1.1rem',
                opacity: 0.7,
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))',
              }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT: content ── */}
      <div
        className="flex items-center pt-28 pb-16 px-8 md:px-14 lg:px-16 order-2"
        style={{ background: '#F8F5EF', position: 'relative', overflow: 'hidden' }}
      >
        {/* Faint corner watermark — tracks current slide */}
        <img
          src={SLIDESHOW_IMAGES[current].src}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 220,
            height: 160,
            objectFit: 'cover',
            opacity: 0.07,
            borderBottomLeftRadius: 4,
            transition: 'opacity 1.4s ease-in-out',
          }}
        />

        {/* Mobile-only hero image — tracks current slide */}
        <div
          className="lg:hidden w-full mb-8 relative overflow-hidden"
          style={{ borderRadius: 2, height: 240 }}
        >
          {SLIDESHOW_IMAGES.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                opacity: i === current ? 0.88 : 0,
                transition: 'opacity 1.4s ease-in-out',
              }}
            />
          ))}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(135deg, rgba(11,110,114,0.4) 0%, transparent 70%)',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: 'linear-gradient(to bottom, #20603D, #FAD201, #1F4D9B)',
              zIndex: 3,
            }}
          />
          {/* Mobile dot indicators */}
          <div
            style={{
              position: 'absolute',
              bottom: 10,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 4,
              display: 'flex',
              gap: 6,
            }}
          >
            {SLIDESHOW_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Slide ${i + 1}`}
                style={{
                  width: i === current ? 18 : 5,
                  height: 5,
                  borderRadius: i === current ? 3 : '50%',
                  background: i === current ? '#E8C27A' : 'rgba(255,255,255,0.50)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-xl w-full" style={{ position: 'relative', zIndex: 2 }}>
          {/* Eyebrow */}
          <p
            style={{
              fontSize: '0.68rem',
              fontWeight: 600,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#C9973A',
              marginBottom: '1.3rem',
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Rwanda Entry &amp; Execution Concierge
          </p>

          <h1
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: 'clamp(2.4rem, 4.5vw, 3.5rem)',
              fontWeight: 300,
              color: '#1A2820',
              lineHeight: 1.08,
              letterSpacing: '-0.02em',
              marginBottom: '1.2rem',
            }}
          >
            Rwanda moves fast.{' '}
            <em style={{ fontStyle: 'italic', color: '#0b6e72' }}>
              We make sure
              <br />
              you move with it.
            </em>
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: '#3D4A45',
              lineHeight: 1.82,
              marginBottom: '2.2rem',
              maxWidth: 420,
              fontFamily: "'Outfit', system-ui, sans-serif",
            }}
          >
            Premium concierge support for diaspora, foreign investors, and NGO founders navigating
            Rwanda's government systems IremboGov to RDB, land titles to full relocation. Done
            right. Done fast. Done for you.
          </p>

          <div style={{ display: 'flex', gap: 12, marginBottom: '2.5rem', flexWrap: 'wrap' }}>
            <Button
              size="lg"
              variant="primary"
              onClick={() => navigate('/booking')}
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              Book Your Free Audit
              <i className="fas fa-arrow-right" style={{ fontSize: '0.7rem' }} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/services')}
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
              }}
            >
              View Services
            </Button>
          </div>

          {/* Trust indicators */}
          <div
            style={{
              display: 'flex',
              gap: '2rem',
              paddingTop: '1.8rem',
              borderTop: '1px solid #DDD5C4',
              flexWrap: 'wrap',
            }}
          >
            {[
              { num: '48h', label: 'Submission\nturnaround' },
              { num: '4', label: 'Service\ncategories' },
              { num: '100%', label: 'Documented\ndelivery' },
              { num: '2h', label: 'Response\nSLA' },
            ].map((item) => (
              <div key={item.num} style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                <span
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontSize: '2.1rem',
                    fontWeight: 300,
                    color: '#1A2820',
                    lineHeight: 1,
                  }}
                >
                  {item.num}
                </span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 600,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: '#6B7A74',
                    whiteSpace: 'pre-line',
                    lineHeight: 1.35,
                    fontFamily: "'Outfit', system-ui, sans-serif",
                  }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;