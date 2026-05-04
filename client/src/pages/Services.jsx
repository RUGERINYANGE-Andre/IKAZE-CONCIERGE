// client/src/pages/Services.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/ui/Button';

const COMPARISON_FEATURES = [
  { label: 'Custom Itinerary / Scope',      tiers: [true,  true,  true,  true]  },
  { label: 'Permit & Document Assistance',  tiers: [true,  true,  true,  true]  },
  { label: 'Dedicated Concierge Contact',   tiers: [false, true,  true,  true]  },
  { label: 'Transport Coordination',        tiers: [false, true,  true,  true]  },
  { label: 'Bank Account Introduction',     tiers: [false, true,  false, false] },
  { label: 'Ministry Alignment Support',    tiers: [false, false, true,  false] },
  { label: 'Airport Arrival Management',    tiers: [false, false, false, true]  },
  { label: 'Accommodation Coordination',    tiers: [false, false, false, true]  },
  { label: '30–60 Day Post-Delivery Support', tiers: [false, true,  true,  true]  },
];

const STATIC_SERVICES = [
  {
    id: 'a', tag: '01 / 04', icon: 'fa-file-contract',
    name: 'Essential Entry', tagline: 'Single process, professionally handled.',
    for: 'Diaspora managing a single process remotely · Early-stage investors · First-time IremboGov users',
    description: 'Complete navigation of a single IremboGov service — from document checklist to submission, confirmation, and a digital delivery file. For clients who know exactly what they need and want it done correctly the first time.',
    features: ['Single IremboGov service navigation', 'Document checklist within 24 hours', 'Submission within 48 hours of receipt', '45-minute discovery consultation', 'Digital delivery file', '14-day post-delivery support'],
    timeline: '24–72 Hours',
    price: 'Entry Tier',
    popular: false,
  },
  {
    id: 'b', tag: '02 / 04', icon: 'fa-building-columns',
    name: 'Business Setup', tagline: 'Full RDB registration. End-to-end.',
    for: 'Foreign investors · Diaspora entrepreneurs · Anyone entering the Rwandan market',
    description: 'Complete end-to-end Rwanda Development Board registration management. We handle every step from selecting the right company structure to obtaining your trading licence so you can focus on building your business, not navigating its paperwork.',
    features: ['Full RDB registration management', 'TIN registration & trading licence', 'Bank account introduction', '60-minute strategy session', 'Complete digital delivery file', '30-day post-registration support'],
    timeline: '5–7 Business Days',
    price: 'Standard Tier',
    popular: true,
  },
  {
    id: 'c', tag: '03 / 04', icon: 'fa-people-group',
    name: 'NGO Setup', tagline: 'Rwanda Governance Board registration, precisely managed.',
    for: 'International NGOs · Local associations · Development foundations · Faith organisations',
    description: 'RGB registration is complex, multi-step, and unforgiving of errors. We navigate every requirement — from articles of association coordination to Ministry of Local Government alignment — with precision and without surprises.',
    features: ['RGB registration process management', 'Pre-application error audit', 'Documentation preparation & review', 'Ministry alignment support', 'Dedicated coordination channel', '45-day post-registration support'],
    timeline: '7–14 Business Days',
    price: 'Premium Tier',
    popular: false,
  },
  {
    id: 'd', tag: '04 / 04', icon: 'fa-star',
    name: 'VIP Relocation', tagline: 'Full-service entry. From the tarmac to settled.',
    for: 'Relocating executives · Expat families · Senior NGO country directors · HNW individuals',
    description: 'From the moment your flight lands to the day you feel settled — we manage every detail. Accommodation, SIM cards, banking, neighbourhood orientation, school introductions, and all documentation. Rwanda should feel like an opportunity from Day 1, not a logistical challenge.',
    features: ['Airport arrival & first-day logistics', 'Vetted accommodation coordination', 'Banking, SIM & mobile money setup', 'Full immigration support', 'School & healthcare introductions', '60-day dedicated support'],
    timeline: 'Full-service from arrival day',
    price: 'Elite Tier',
    popular: false,
  },
];

const Services = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services');
      const data = response.data.data || [];
      setServices(data.length > 0 ? data : STATIC_SERVICES);
    } catch (err) {
      console.error('Failed to fetch services:', err);
      setServices(STATIC_SERVICES);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  const displayServices = services.length > 0 ? services : STATIC_SERVICES;

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F5EF' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 48, height: 48, border: '2px solid #C9973A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
          <p style={{ fontSize: '0.8rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6B7A74' }}>Loading services</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF8', fontFamily: "'Outfit', system-ui, sans-serif" }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --forest: #1C3A2E; --forest-dk: #10878b; --forest-lt: #10a392;
          --gold: #C9973A; --gold-lt: #E8C27A; --gold-pale: #FAF4E8;
          --ivory: #F8F5EF; --warm-white: #FDFBF8;
          --charcoal: #1A1A1A; --slate: #3D4A45; --muted: #6B7A74;
          --border: #DDD5C4; --radius: 2px;
          --transition: 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .svc-label {
          font-size: 0.7rem; font-weight: 600; letter-spacing: 0.2em;
          text-transform: uppercase; color: var(--gold);
        }
        .svc-card {
          background: #fff; position: relative; overflow: hidden;
          padding: 2.8rem 2.5rem;
          transition: var(--transition); cursor: default;
        }
        .svc-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(to right, var(--gold), var(--gold-lt));
          transform: scaleX(0); transform-origin: left;
          transition: transform 0.4s ease;
        }
        .svc-card:hover::before { transform: scaleX(1); }
        .svc-card:hover { box-shadow: 0 16px 40px rgba(0,0,0,0.08); z-index: 1; }
        .svc-card-tag {
          font-family: 'Cormorant Garamond', serif;
          font-size: 0.85rem; color: var(--gold); font-weight: 500;
          letter-spacing: 0.08em; display: block; margin-bottom: 0.6rem;
        }
        .svc-card-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.9rem; font-weight: 400; color: var(--forest-dk);
          margin-bottom: 0.4rem; line-height: 1.15;
        }
        .svc-card-for {
          font-size: 0.72rem; font-weight: 500; letter-spacing: 0.1em;
          text-transform: uppercase; color: var(--muted); margin-bottom: 1.2rem;
        }
        .svc-card-body { font-size: 0.9rem; color: var(--slate); line-height: 1.75; margin-bottom: 1.5rem; }
        .svc-timeline {
          display: inline-flex; align-items: center; gap: 0.5rem;
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; color: var(--forest);
          padding: 0.4rem 0.8rem; background: var(--gold-pale); border-radius: 1px;
          margin-top: 1rem;
        }
        .svc-feature-list { list-style: none; display: flex; flex-direction: column; gap: 0.4rem; margin-bottom: 1.5rem; }
        .svc-feature-list li {
          font-size: 0.85rem; color: var(--slate);
          display: flex; align-items: flex-start; gap: 0.6rem;
        }
        .svc-feature-list li i { color: var(--gold); flex-shrink: 0; margin-top: 0.2rem; font-size: 0.7rem; }
        .popular-badge {
          position: absolute; top: 1.5rem; right: 1.5rem;
          background: var(--gold); color: var(--forest-dk);
          font-size: 0.62rem; font-weight: 700; letter-spacing: 0.14em;
          text-transform: uppercase; padding: 0.3rem 0.7rem;
        }
        .btn-dark {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: var(--forest-dk); color: var(--gold-lt);
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; padding: 0.85rem 1.8rem;
          border: none; cursor: pointer; border-radius: var(--radius);
          transition: var(--transition); text-decoration: none;
        }
        .btn-dark:hover { background: var(--forest-lt); transform: translateY(-1px); }
        .btn-gold {
          display: inline-flex; align-items: center; gap: 0.6rem;
          background: var(--gold); color: var(--forest-dk);
          font-size: 0.78rem; font-weight: 600; letter-spacing: 0.12em;
          text-transform: uppercase; padding: 0.85rem 1.8rem;
          border: none; cursor: pointer; border-radius: var(--radius);
          transition: var(--transition);
        }
        .btn-gold:hover { background: var(--gold-lt); transform: translateY(-1px); }
        .compare-th {
          padding: 1rem 1.5rem; font-size: 0.7rem; font-weight: 600;
          letter-spacing: 0.15em; text-transform: uppercase;
        }
        .compare-td { padding: 1rem 1.5rem; font-size: 0.88rem; border-top: 1px solid var(--border); }
        @media (max-width: 768px) { .two-col { grid-template-columns: 1fr !important; } }
      `}</style>

     {/* ── HERO ── */}
<section style={{ background: 'var(--forest-dk)', padding: '8rem 0 5rem', position: 'relative', overflow: 'hidden' }}>
  
  {/* Background image */}
  <img
    src="https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1600&q=85&fit=crop"
    alt=""
    aria-hidden="true"
    style={{
      position: 'absolute', inset: 0,
      width: '100%', height: '100%',
      objectFit: 'cover', objectPosition: 'center',
      opacity: 0.18,
    }}
  />

  {/* Diagonal stripe texture overlay */}
  <div style={{
    position: 'absolute', inset: 0,
    backgroundImage: 'repeating-linear-gradient(135deg, transparent, transparent 80px, rgba(201,151,58,0.02) 80px, rgba(201,151,58,0.02) 81px)',
  }} />

  {/* Gradient vignette — keeps edges dark so text stays readable */}
  <div style={{
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at center, transparent 30%, rgba(11,110,114,0.55) 100%)',
  }} />

  {/* Rwanda flag stripe */}
  <div style={{
    position: 'absolute', left: 0, top: 0, bottom: 0, width: 4,
    background: 'linear-gradient(to bottom, #20603D, #FAD201, #1F4D9B)',
  }} />

  {/* Content */}
  <div style={{
    maxWidth: 1280, margin: '0 auto',
    padding: '0 clamp(1.5rem, 5vw, 4rem)',
    position: 'relative', zIndex: 1,
    textAlign: 'center',
  }}>
    <p className="svc-label" style={{ color: 'var(--gold-lt)', marginBottom: '1.2rem' }}>What We Do</p>
    <h1 style={{
      fontFamily: "'Cormorant Garamond', serif",
      fontSize: 'clamp(2.5rem, 5vw, 5rem)',
      fontWeight: 300, color: '#fff',
      letterSpacing: '-0.02em', lineHeight: 1.1,
      marginBottom: '1rem',
    }}>
      Four service categories.<br />One professional partner.
    </h1>
    <p style={{
      fontSize: '1.05rem', color: 'rgba(255,255,255,0.55)',
      maxWidth: 580, margin: '0 auto', lineHeight: 1.75,
    }}>
      Each service category is designed around a specific type of client need. We do not offer
      everything we offer the right things, executed to a professional standard that matches
      your expectations.
    </p>
  </div>
</section>

      {/* ── MARQUEE ── */}
      <div style={{ background: 'var(--forest)', padding: '0.75rem 0', overflow: 'hidden', borderBottom: '1px solid rgba(201,151,58,0.2)' }}>
        <div style={{ display: 'flex', gap: '4rem', animation: 'marquee 30s linear infinite', width: 'max-content' }}>
          <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } } @keyframes spin { to { transform: rotate(360deg); } }`}</style>
          {[...Array(2)].map((_, ri) =>
            ['RDB Business Registration', 'NGO & RGB Setup', 'IremboGov Services', 'VIP Relocation', 'Land Authority', 'Immigration Permits', 'Document Verification', 'Bank Account Introduction'].map((item, i) => (
              <span key={`${ri}-${i}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem', whiteSpace: 'nowrap', fontSize: '0.72rem', fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--gold)', flexShrink: 0, display: 'inline-block' }} />
                {item}
              </span>
            ))
          )}
        </div>
      </div>

      {/* ── SERVICE CARDS GRID ── */}
      <section style={{ padding: '7rem 0', background: 'var(--warm-white)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }} className="two-col">
            {displayServices.map((svc, idx) => {
              const s = STATIC_SERVICES[idx] || {};
              const icon = svc.icon_class || s.icon || 'fa-star';
              const tag = svc.tag || s.tag || `0${idx+1} / 0${displayServices.length}`;
              const forText = svc.for_text || svc.audience || s.for || '';
              const timeline = svc.timeline || s.timeline || '';
              const popular = svc.popular || s.popular || false;
              const features = svc.features || s.features || [];

              return (
                <div key={svc._id || svc.id || idx} className="svc-card">
                  {popular && <div className="popular-badge"><i className="fa-solid fa-star" style={{ marginRight: '0.3rem' }} />Most Requested</div>}
                  <span className="svc-card-tag">{tag}</span>
                  <i className={`fa-solid ${icon}`} style={{ fontSize: '1.8rem', color: 'var(--gold)', display: 'block', marginBottom: '0.8rem' }} />
                  <div className="svc-card-title">{svc.name || s.name}</div>
                  {forText && <p className="svc-card-for">{forText}</p>}
                  <p className="svc-card-body">{svc.description || s.description}</p>
                  {features.length > 0 && (
                    <ul className="svc-feature-list">
                      {features.map((f, fi) => (
                        <li key={fi}><i className="fa-solid fa-minus" />{f}</li>
                      ))}
                    </ul>
                  )}
                  {timeline && (
                    <div className="svc-timeline">
                      <i className="fa-regular fa-clock" style={{ color: 'var(--forest)' }} />
                      {timeline}
                    </div>
                  )}
                  <div style={{ marginTop: '1.5rem' }}>
                    <button
                      className={popular ? 'btn-gold' : 'btn-dark'}
                      onClick={() => navigate('/booking', { state: { selectedService: svc.name ? svc : (STATIC_SERVICES[idx] || {}) } })}
                    >
                      Book {svc.name || s.name}
                      <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <button className="btn-gold" style={{ padding: '1.1rem 2.8rem', fontSize: '0.82rem' }} onClick={() => navigate('/booking')}>
              <i className="fa-solid fa-calendar-check" />
              Book a Free 20-Minute Audit
              <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }} />
            </button>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS SUMMARY ── */}
      <section style={{ background: 'var(--ivory)', padding: '7rem 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
          <div style={{ textAlign: 'center', maxWidth: 680, margin: '0 auto 5rem' }}>
            <p className="svc-label" style={{ marginBottom: '1.2rem' }}>The Process</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 300, color: 'var(--forest-dk)', lineHeight: 1.15, marginBottom: '1rem', letterSpacing: '-0.02em' }}>
              Engaging IKaze is designed to be effortless.
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--slate)', lineHeight: 1.8 }}>
              Five clear steps from first contact to final delivery. No ambiguity. No chasing. No surprises.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0, position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2.4rem', left: '10%', right: '10%', height: 1, background: 'linear-gradient(to right, transparent, var(--border), var(--border), transparent)', zIndex: 0 }} />
            {[
              { num: '1', icon: 'fa-phone', title: 'Free Audit Call', body: '20-minute call to diagnose your exact need and confirm the right service package.' },
              { num: '2', icon: 'fa-file-pen', title: 'Written Proposal', body: 'Scope, deliverables, timeline, and investment — delivered within 24 hours.' },
              { num: '3', icon: 'fa-folder-open', title: 'Document Collection', body: 'We send a precise checklist. You provide what\'s needed. We handle everything from there.' },
              { num: '4', icon: 'fa-gears', title: 'Execution', body: 'We navigate the process. Status updates every 48 hours. You are always informed.' },
              { num: '5', icon: 'fa-check-double', title: 'Documented Delivery', body: 'Complete digital file: confirmations, reference numbers, and next-step guidance.' },
            ].map((step, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '0 0.75rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                  width: '4.8rem', height: '4.8rem', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: i === 4 ? 'var(--gold)' : 'var(--forest-dk)',
                  color: i === 4 ? 'var(--forest-dk)' : 'var(--gold-lt)',
                  border: '3px solid var(--ivory)',
                  boxShadow: '0 0 0 1px var(--border)',
                  marginBottom: '1.5rem', flexShrink: 0,
                  fontSize: '1.2rem',
                }}>
                  <i className={`fa-solid ${step.icon}`} />
                </div>
                <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--forest-dk)', marginBottom: '0.5rem', letterSpacing: '0.02em' }}>{step.title}</p>
                <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.65 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      {displayServices.length > 0 && (
        <section style={{ background: '#fff', padding: '7rem 0' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)' }}>
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
              <p className="svc-label" style={{ marginBottom: '1.2rem' }}>Compare Services</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(2rem, 3.5vw, 3.2rem)', fontWeight: 300, color: 'var(--forest-dk)', letterSpacing: '-0.02em' }}>
                Every package starts with a free audit.
              </h2>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--ivory)' }}>
                    <th className="compare-th" style={{ textAlign: 'left', color: 'var(--muted)' }}>Feature</th>
                    {['Essential Entry', 'Business Setup', 'NGO Setup', 'VIP Relocation'].slice(0, displayServices.length).map((name, i) => (
                      <th key={i} className="compare-th" style={{ textAlign: 'center', color: i === 1 ? 'var(--gold)' : 'var(--forest-dk)' }}>
                        <i className={`fa-solid ${STATIC_SERVICES[i]?.icon || 'fa-star'}`} style={{ marginRight: '0.4rem' }} />
                        {(displayServices[i]?.name) || name}
                        {(displayServices[i]?.popular || STATIC_SERVICES[i]?.popular) && (
                          <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--gold)', fontWeight: 400, marginTop: '0.25rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Most Requested</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPARISON_FEATURES.map((row, ri) => (
                    <tr key={ri} style={{ background: ri % 2 === 0 ? '#fff' : 'var(--ivory)' }}>
                      <td className="compare-td" style={{ fontWeight: 500, color: 'var(--slate)' }}>{row.label}</td>
                      {row.tiers.slice(0, displayServices.length).map((included, ti) => (
                        <td key={ti} className="compare-td" style={{ textAlign: 'center' }}>
                          {included
                            ? <i className="fa-solid fa-check" style={{ color: 'var(--gold)', fontSize: '0.95rem' }} />
                            : <i className="fa-solid fa-minus" style={{ color: 'var(--border)', fontSize: '0.95rem' }} />
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* Price row */}
                  <tr style={{ background: 'var(--ivory)' }}>
                    <td className="compare-td" style={{ fontWeight: 700, color: 'var(--forest-dk)' }}>Investment Level</td>
                    {displayServices.slice(0, 4).map((svc, si) => (
                      <td key={si} className="compare-td" style={{ textAlign: 'center' }}>
                        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 400 }}>
                          {svc.price ? `$${svc.price}` : (STATIC_SERVICES[si]?.price || '—')}
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ textAlign: 'center', marginTop: '4rem' }}>
              <button className="btn-gold" style={{ padding: '1.1rem 2.8rem', fontSize: '0.82rem' }} onClick={() => navigate('/booking')}>
                <i className="fa-solid fa-calendar-check" />
                Get Started — Book a Free Audit
                <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem' }} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* ── CTA BANNER ── */}
      <section style={{ background: 'var(--forest-dk)', padding: '5rem 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem, 5vw, 4rem)', display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: '4rem' }} className="two-col">
          <div>
            <p className="svc-label" style={{ color: 'var(--gold-lt)', marginBottom: '1rem' }}>For people who cannot afford to get Rwanda wrong.</p>
            <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
              Fixed scope. Written proposal.<br />Documented delivery.
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'flex-start' }}>
            <button className="btn-gold" style={{ padding: '1rem 2rem', whiteSpace: 'nowrap' }} onClick={() => navigate('/booking')}>
              <i className="fa-solid fa-calendar-check" />
              Book Free Audit
            </button>
            <button
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'transparent', color: 'var(--gold-lt)', border: '1px solid rgba(201,151,58,0.3)', padding: '0.85rem 1.8rem', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', borderRadius: 2, transition: 'all 0.3s ease' }}
              onClick={() => navigate('/contact')}
            >
              <i className="fa-brands fa-whatsapp" />
              WhatsApp Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Services;