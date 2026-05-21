// client/src/pages/About.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const IMAGES = {
  // ── originals ──
  hero:        'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=85&fit=crop',
  kigaliCity:  'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=900&q=80&fit=crop',
  hills:       'https://images.unsplash.com/photo-1627556704302-624286467c65?w=900&q=80&fit=crop',
  landscape:   'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=900&q=80&fit=crop',
  business:    'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=900&q=80&fit=crop',
  market:      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=900&q=80&fit=crop',
  meeting:     'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80&fit=crop',
  // ── new ──
  aerial:      'https://images.unsplash.com/photo-1611348586804-61bf6c080437?w=1400&q=85&fit=crop',
  greenHills:  'https://images.unsplash.com/photo-1489392191049-fc10c97e64b6?w=1200&q=85&fit=crop',
  sunrise:     'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=85&fit=crop',
  savanna:     'https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=1200&q=85&fit=crop',
  dusk:        'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=1200&q=85&fit=crop',
  africanCity: 'https://images.unsplash.com/photo-1580746738099-78d6833b3472?w=1200&q=85&fit=crop',
};

const About = () => {
  const navigate = useNavigate();

  const credentials = [
    { icon: 'fa-landmark',   title: 'RDB Registered Business',        description: 'Formally registered, verifiable, and accountable under Rwandan law.' },
    { icon: 'fa-file-lines', title: 'IremboGov Certified Expertise',  description: 'Deep operational knowledge across all major IremboGov service categories.' },
    { icon: 'fa-globe',      title: 'International Client Experience', description: 'UK, Belgium, USA, Canada, Netherlands, and across East Africa.' },
    { icon: 'fa-handshake',  title: 'Partner Network',                 description: 'Vetted relationships with law firms, translators, banks, and transport professionals.' },
    { icon: 'fa-bolt',       title: 'No Subcontracting',               description: "Every engagement is managed directly by IKaze's principal. No handoffs." },
  ];

  const pillars = [
    { icon: 'fa-bolt',          img: IMAGES.dusk,      title: 'Speed',         description: 'Document checklist within 24 hours. Submission within 48 hours of receipt. Status updates without prompting. We respect your time because we understand what your time costs.' },
    { icon: 'fa-crosshairs',    img: IMAGES.greenHills, title: 'Accuracy',     description: 'We have mapped every relevant IremboGov service, every RDB pathway, and every RGB requirement. We do not guess. We do not estimate. We deliver documented, reference-numbered outcomes.' },
    { icon: 'fa-shield-halved', img: IMAGES.sunrise,   title: 'Accountability', description: 'Every engagement produces a complete digital file. Every commitment is written. Every outcome is documented. You receive a reference number, not a promise.' },
  ];

  const trustSignals = [
    { icon: 'fa-clipboard-list', title: 'Every engagement is documented',        description: 'You receive a complete digital file for every engagement — not a verbal update. Reference numbers, submission confirmations, and next steps. Always.' },
    { icon: 'fa-scale-balanced', title: 'Written scope before work begins',       description: 'Every engagement starts with a written scope agreement. No work begins without your confirmation. No surprises in scope, timeline, or cost.' },
    { icon: 'fa-credit-card',    title: 'Secure, international payment options',  description: 'Pay via Wise, Remitly, or MTN Mobile Money. Documented invoices via Wave. No cash-in-hand. No informal transactions. Every payment is traceable.' },
    { icon: 'fa-lock',           title: 'Zero undisclosed payments',              description: 'We do not make informal payments to government officials on your behalf. We navigate systems through proper channels — legally, professionally, and with a documented trail.' },
  ];

  const audiences = [
    { tag: '01', title: 'Diaspora Rwandans',       subtitle: 'Managing processes from abroad',    img: IMAGES.kigaliCity,  description: 'Systems have changed. Contacts are lost. IremboGov, permits, logistics — it is confusing when you have been away. We close that gap with precision.' },
    { tag: '02', title: 'Foreign Investors',        subtitle: 'Entering the Rwandan market',       img: IMAGES.africanCity, description: "Rwanda's business environment is exceptional. Its bureaucracy rewards those who know the correct pathway. We are that pathway, executed at professional standards." },
    { tag: '03', title: 'NGO Founders & Directors', subtitle: 'Registering & operating in Rwanda', img: IMAGES.meeting,     description: 'RGB registration is complex and unforgiving of errors. Ministry alignment requires knowledge and relationships. We navigate both on your behalf.' },
    { tag: '04', title: 'Relocating Executives',    subtitle: 'VIP entry & settlement',            img: IMAGES.hills,       description: 'From the moment your flight lands to the day you feel settled — accommodation, banking, documentation, school introductions. Rwanda from Day 1, not a logistical challenge.' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-ivory, #F8F5EF)', fontFamily: "'Outfit', system-ui, sans-serif" }}>

      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        :root {
          --forest: #10878b; --forest-dk: #0b6e72; --forest-lt: #17baa7;
          --gold: #C9973A; --gold-lt: #E8C27A; --gold-pale: #FAF4E8;
          --ivory: #F8F5EF; --warm-white: #FDFBF8;
          --charcoal: #1A1A1A; --slate: #3D4A45; --muted: #6B7A74;
          --border: #DDD5C4; --radius: 2px;
          --transition: 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .about-label { font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold); }
        .about-hero-title { font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2.8rem,5vw,4.8rem);font-weight:300;line-height:1.08;letter-spacing:-0.02em;color:#fff; }
        .about-hero-title em { font-style:italic;color:var(--gold-lt); }
        .section-title { font-family:'Cormorant Garamond',Georgia,serif;font-size:clamp(2rem,3.5vw,3.2rem);font-weight:300;line-height:1.15;letter-spacing:-0.02em;color:var(--forest-dk); }

        /* Pillar cards — bg image fades in on hover */
        .pillar-card { background:rgba(255,255,255,0.04);border-bottom:2px solid transparent;padding:2.5rem 2rem;transition:var(--transition);position:relative;overflow:hidden; }
        .pillar-card:hover { background:rgba(255,255,255,0.07);border-bottom-color:var(--gold); }
        .pillar-card-bg { position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 0.6s ease; pointer-events:none; }
        .pillar-card:hover .pillar-card-bg { opacity:0.09; }
        .pillar-inner { position:relative;z-index:1; }
        .pillar-title { font-family:'Cormorant Garamond',Georgia,serif;font-size:1.6rem;font-weight:400;color:var(--gold-lt);margin-bottom:0.75rem; }

        .credential-row { display:flex;gap:1.2rem;align-items:flex-start;padding:1.2rem 0;border-bottom:1px solid var(--border); }
        .credential-row:last-child { border-bottom:none; }
        .trust-signal-row { display:flex;gap:1.2rem;align-items:flex-start;padding:1.5rem 0;border-bottom:1px solid var(--border); }
        .trust-signal-row:last-child { border-bottom:none; }

        /* Audience cards — bg image at low opacity, lifts on hover */
        .audience-card { background:#fff;border:1px solid var(--border);border-left:3px solid var(--border);transition:var(--transition);position:relative;overflow:hidden; }
        .audience-card:hover { border-left-color:var(--gold);box-shadow:0 4px 20px rgba(0,0,0,0.08); }
        .audience-card-bg { position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.06;transition:opacity 0.5s ease;pointer-events:none; }
        .audience-card:hover .audience-card-bg { opacity:0.14; }
        .audience-inner { position:relative;z-index:1;padding:2rem; }
        .audience-tag { font-family:'Cormorant Garamond',serif;font-size:0.85rem;color:var(--gold);font-weight:500;letter-spacing:0.08em;display:block;margin-bottom:0.5rem; }
        .audience-title { font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:400;color:var(--forest-dk);margin-bottom:0.2rem;line-height:1.2; }
        .audience-subtitle { font-size:0.72rem;font-weight:500;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);margin-bottom:0.9rem; }

        /* Image strip between hero and story */
        .img-strip { display:grid;grid-template-columns:repeat(3,1fr);height:200px; }
        .img-strip-cell { position:relative;overflow:hidden; }
        .img-strip-cell img { width:100%;height:100%;object-fit:cover;transition:transform 0.6s ease; }
        .img-strip-cell:hover img { transform:scale(1.05); }
        .img-strip-cell::after { content:'';position:absolute;inset:0;background:linear-gradient(to top,rgba(11,110,114,0.55) 0%,transparent 55%); }
        .img-strip-label { position:absolute;bottom:0.75rem;left:1rem;z-index:1;font-size:0.62rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:rgba(255,255,255,0.75); }

        /* Panorama break */
        .panorama { position:relative;height:210px;overflow:hidden; }
        .panorama img { width:100%;height:100%;object-fit:cover;object-position:center 55%; }
        .panorama-overlay { position:absolute;inset:0;background:linear-gradient(to right,rgba(11,110,114,0.6) 0%,rgba(11,110,114,0.2) 40%,rgba(11,110,114,0.2) 60%,rgba(11,110,114,0.6) 100%); }
        .panorama-quote { position:absolute;inset:0;display:flex;align-items:center;justify-content:center;padding:0 2rem; }

        /* Small thumbnail hover */
        .thumb { overflow:hidden;border-radius:2px;border:1px solid var(--border); }
        .thumb img { width:100%;height:100%;object-fit:cover;opacity:0.78;transition:transform 0.5s ease,opacity 0.3s ease; }
        .thumb:hover img { transform:scale(1.08);opacity:1; }

        .vs-table { width:100%;border-collapse:collapse; }
        .vs-table th { padding:0.8rem 1.5rem;font-size:0.7rem;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;text-align:left; }
        .vs-table th:first-child { color:var(--muted); }
        .vs-table th:last-child { color:var(--gold-lt);background:rgba(201,151,58,0.08); }
        .vs-table td { padding:1rem 1.5rem;font-size:0.88rem;border-top:1px solid rgba(255,255,255,0.06);color:rgba(255,255,255,0.55);vertical-align:top; }
        .vs-table td:first-child { font-weight:500;color:rgba(255,255,255,0.75);width:30%; }
        .vs-table td:last-child { color:rgba(255,255,255,0.85);background:rgba(201,151,58,0.05); }
        .vs-check { color:var(--gold-lt);font-weight:600; }
        .vs-cross { color:rgba(255,255,255,0.25); }

        .btn-gold-custom { display:inline-flex;align-items:center;gap:0.6rem;background:var(--gold);color:var(--forest-dk);font-size:0.8rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:1rem 2.2rem;border:none;cursor:pointer;border-radius:var(--radius);transition:var(--transition); }
        .btn-gold-custom:hover { background:var(--gold-lt);transform:translateY(-1px); }
        .btn-outline-custom { display:inline-flex;align-items:center;gap:0.6rem;background:transparent;color:var(--gold);font-size:0.8rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:1rem 2.2rem;border:1px solid var(--gold);cursor:pointer;border-radius:var(--radius);transition:var(--transition); }
        .btn-outline-custom:hover { background:var(--gold);color:var(--forest-dk); }
        .hero-trust-num { font-family:'Cormorant Garamond',serif;font-size:1.8rem;font-weight:300;color:var(--gold-lt);line-height:1; }
        .hero-trust-label { font-size:0.72rem;letter-spacing:0.1em;text-transform:uppercase;color:rgba(255,255,255,0.5); }
        .img-placeholder { background:linear-gradient(135deg,var(--forest-dk) 0%,var(--forest) 100%);border-radius:2px;overflow:hidden;position:relative; }

        @media(max-width:768px){.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr!important}.four-col{grid-template-columns:1fr 1fr!important}.img-strip{grid-template-columns:1fr!important;height:auto}}
      `}</style>

      {/* ── HERO ── */}
     {/* ── HERO ── */}
<section style={{ position: 'relative', padding: '8rem 0 5rem', overflow: 'hidden' }}>
  <img
    src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=1800&q=85&fit=crop"
    alt="Luxury hotel in Kigali, Rwanda"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center',
    }}
  />

  <div
    style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(7,60,64,0.82)',
    }}
  />

  <div
    style={{
      position: 'absolute',
      inset: 0,
      backgroundImage:
        'repeating-linear-gradient(135deg, transparent, transparent 80px, rgba(201,151,58,0.04) 80px, rgba(201,151,58,0.04) 81px)',
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
    }}
  />

  <div
    style={{
      maxWidth: 1280,
      margin: '0 auto',
      padding: '0 clamp(1.5rem,5vw,4rem)',
      position: 'relative',
    }}
  >
    <div style={{ maxWidth: 820, margin: '0 auto', textAlign: 'center' }}>
      <p className="about-label" style={{ marginBottom: '1.5rem' }}>
        About IKaze
      </p>

      <h1 className="about-hero-title" style={{ marginBottom: '1.5rem' }}>
        Built by someone who has navigated
        <br />
        <em>these systems from both sides.</em>
      </h1>

      <p
        style={{
          fontSize: '1.05rem',
          color: 'rgba(255,255,255,0.65)',
          lineHeight: 1.8,
          maxWidth: 640,
          margin: '0 auto 3rem',
        }}
      >
        Between your ambition and Rwanda&apos;s systems we are the bridge.
        Professional execution, every time.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '3rem',
          justifyContent: 'center',
          paddingTop: '2.5rem',
          borderTop: '1px solid rgba(201,151,58,0.25)',
          flexWrap: 'wrap',
        }}
      >
        {[
          ['100%', 'Client Satisfaction'],
          ['48h', 'Max Response Time'],
          ['5+', 'Service Categories'],
          ['RDB', 'Registered Business'],
        ].map(([num, label]) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div className="hero-trust-num">{num}</div>
            <div className="hero-trust-label" style={{ marginTop: '0.25rem' }}>
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* ── IMAGE STRIP — after hero ── */}
      <div className="img-strip">
        {[
          { src: IMAGES.greenHills, label: 'Eastern Province' },
          { src: IMAGES.aerial,     label: 'Kigali, Rwanda' },
          { src: IMAGES.sunrise,    label: 'Land of a Thousand Hills' },
        ].map(item => (
          <div key={item.label} className="img-strip-cell">
            <img src={item.src} alt={item.label} />
            <span className="img-strip-label">{item.label}</span>
          </div>
        ))}
      </div>

      {/* ── OUR STORY ── */}
      <section style={{ background: 'var(--warm-white)', padding: '7rem 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.1fr', gap: '6rem', alignItems: 'start' }} className="two-col">

            {/* Image column */}
            <div>
              <div className="img-placeholder" style={{ height: 460, marginBottom: '0.6rem' }}>
                <img src={IMAGES.kigaliCity} alt="Kigali, Rwanda" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.88 }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(transparent, rgba(7,60,64,0.88))', padding: '2rem 1.5rem' }}>
                  <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', lineHeight: 1.55 }}>
                    "We understand how Rwanda works not how it is supposed to work."
                  </p>
                  <p style={{ fontSize: '0.72rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold-lt)', marginTop: '0.4rem' }}>IKaze Concierge, Kigali</p>
                </div>
              </div>
              {/* 3-image mosaic */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                {[IMAGES.hills, IMAGES.landscape, IMAGES.savanna].map((src, i) => (
                  <div key={i} className="img-placeholder thumb" style={{ height: 130 }}>
                    <img src={src} alt="" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>

            {/* Content column */}
            <div>
              <p className="about-label" style={{ marginBottom: '1.2rem' }}>Our Story</p>
              <h2 className="section-title" style={{ marginBottom: '2rem' }}>
                Founded from direct experience of the friction that matters.
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--slate)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                IKaze Concierge was founded from a direct experience of the friction that every diaspora Rwandan, every foreign investor, and every incoming NGO encounters when engaging Rwanda's government processes. Not theoretical friction the specific, operational friction of forms that require documents in formats that are not obvious, portals that timeout unexpectedly, and ministries that operate on schedules that are difficult to predict from abroad.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--slate)', lineHeight: 1.85, marginBottom: '1.5rem' }}>
                <strong style={{ color: 'var(--forest-dk)' }}>The insight that drives IKaze is simple:</strong> Rwanda has built a genuinely impressive administrative infrastructure. IremboGov is a serious achievement. RDB has created one of Africa's most business-friendly registration environments. But accessing these systems with confidence requires knowledge that takes time to accumulate. IKaze provides that knowledge, immediately, at professional standards.
              </p>
              <p style={{ fontSize: '1rem', color: 'var(--slate)', lineHeight: 1.85, marginBottom: '2.5rem' }}>
                We are based in Eastern Province with operational reach across Rwanda. We serve clients in the UK, Belgium, the United States, Canada, the Netherlands, and across East Africa. Every engagement is handled directly not outsourced, not delegated to junior staff.
              </p>
              <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--gold)', marginBottom: '2.5rem' }}>
                "Rwanda moves fast. We make sure you move with it."
              </p>
              <div>
                {credentials.map((c, i) => (
                  <div key={i} className="credential-row">
                    <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--gold-pale)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa-solid ${c.icon}`} style={{ color: 'var(--gold)', fontSize: '0.9rem' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--forest-dk)', marginBottom: '0.15rem' }}>{c.title}</p>
                      <p style={{ fontSize: '0.82rem', color: 'var(--muted)', lineHeight: 1.6 }}>{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY IKAZE (Pillars) ── */}
      <section style={{ background: 'var(--forest-dk)', padding: '7rem 0', position: 'relative', overflow: 'hidden' }}>
        <img src={IMAGES.business} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,60,64,0.92)' }} />
        <div style={{ position: 'absolute', top: -200, right: -200, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle,rgba(201,151,58,0.07) 0%,transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)', position: 'relative' }}>
          <p className="about-label" style={{ color: 'var(--gold-lt)', marginBottom: '1.5rem' }}>Why IKaze</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,3.5vw,3.5rem)', fontWeight: 300, color: '#fff', lineHeight: 1.15, maxWidth: 680, marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            Not an agent. Not a travel service.<br />A professional execution partner.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: 560, lineHeight: 1.8, marginBottom: '4rem' }}>
            IKaze exists at the intersection of local knowledge, professional accountability, and international standards.
          </p>

          {/* Pillar cards — each has its own bg image revealed on hover */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5px', background: 'rgba(201,151,58,0.1)', marginBottom: '4rem' }} className="three-col">
            {pillars.map((p, i) => (
              <div key={i} className="pillar-card">
                <img src={p.img} alt="" aria-hidden="true" className="pillar-card-bg" />
                <div className="pillar-inner">
                  <i className={`fa-solid ${p.icon}`} style={{ fontSize: '1.4rem', color: 'var(--gold)', display: 'block', marginBottom: '1.2rem' }} />
                  <div className="pillar-title">{p.title}</div>
                  <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.75 }}>{p.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* VS Table */}
          <div style={{ maxWidth: 820 }}>
            <p className="about-label" style={{ color: 'var(--gold-lt)', marginBottom: '2rem' }}>IKaze vs The Alternatives</p>
            <div style={{ overflowX: 'auto' }}>
              <table className="vs-table">
                <thead>
                  <tr>
                    <th>What You Need</th>
                    <th>Law Firm / Agent / DIY</th>
                    <th>IKaze Concierge</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Business registered in 5 days','2–6 weeks with a law firm; unpredictable with agents','✓ 5–7 business days from document receipt. Guaranteed.'],
                    ['Clear process transparency','Legal jargon, opaque timelines, follow-up required constantly','✓ Step-by-step updates. You know where your file is at all times.'],
                    ['Single point of contact','Multiple departments, multiple handoffs, no one owns the outcome','✓ One dedicated contact. One WhatsApp number. Direct and available.'],
                    ['Documented delivery','PDF report at best; verbal confirmation with informal agents','✓ Complete digital file: all confirmations, reference numbers, next steps.'],
                    ['Premium pricing justified','High hourly legal fees for work you cannot verify','✓ Fixed-scope packages. Transparent pricing. No hidden charges.'],
                  ].map(([need, other, kaze], i) => (
                    <tr key={i}>
                      <td>{need}</td>
                      <td className="vs-cross">{other}</td>
                      <td className="vs-check">{kaze}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── PANORAMA BREAK ── */}
      <div className="panorama">
        <img src={IMAGES.savanna} alt="Rwanda landscape" />
        <div className="panorama-overlay" />
        <div className="panorama-quote">
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.3rem,2.5vw,2rem)', fontWeight: 300, fontStyle: 'italic', color: 'rgba(255,255,255,0.92)', textAlign: 'center', textShadow: '0 2px 12px rgba(0,0,0,0.4)', maxWidth: 700 }}>
            "The land of a thousand hills and one professional partner."
          </p>
        </div>
      </div>

      {/* ── WHO WE SERVE ── */}
      <section style={{ background: 'var(--ivory)', padding: '7rem 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ position: 'relative', textAlign: 'center', marginBottom: '4rem', overflow: 'hidden', padding: '3rem 0' }}>
            <img src={IMAGES.meeting} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06 }} />
            <p className="about-label" style={{ marginBottom: '1.2rem', position: 'relative' }}>Who We Serve</p>
            <h2 className="section-title" style={{ position: 'relative' }}>We specialise in serving those who<br />need more than a tour guide.</h2>
          </div>

          {/* Audience cards — each with their own bg image */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }} className="two-col">
            {audiences.map((a, i) => (
              <div key={i} className="audience-card">
                <img src={a.img} alt="" aria-hidden="true" className="audience-card-bg" />
                <div className="audience-inner">
                  <span className="audience-tag">{a.tag} / 04</span>
                  <div className="audience-title">{a.title}</div>
                  <div className="audience-subtitle">{a.subtitle}</div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--slate)', lineHeight: 1.75 }}>{a.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST / TESTIMONIALS ── */}
      <section style={{ background: 'var(--warm-white)', padding: '7rem 0' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'start' }} className="two-col">

            {/* Left — trust signals */}
            <div>
              <p className="about-label" style={{ marginBottom: '1.2rem' }}>Why Clients Trust IKaze</p>
              <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>
                Trust is not claimed.<br />It is earned through evidence.
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--slate)', lineHeight: 1.85, marginBottom: '3rem' }}>
                You are engaging a service that handles sensitive documents, government submissions, and processes with real financial and legal consequences. Here is why our clients trust us with theirs.
              </p>
              <div>
                {trustSignals.map((s, i) => (
                  <div key={i} className="trust-signal-row">
                    <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'var(--gold-pale)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa-solid ${s.icon}`} style={{ color: 'var(--gold)', fontSize: '1rem' }} />
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.92rem', color: 'var(--forest-dk)', marginBottom: '0.3rem' }}>{s.title}</p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--slate)', lineHeight: 1.7 }}>{s.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              4-image thumbnail row
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: '2.5rem' }}>
                {[IMAGES.market, IMAGES.hills, IMAGES.business, IMAGES.dusk].map((src, i) => (
                  <div key={i} className="thumb" style={{ height: 80 }}>
                    <img src={src} alt="" aria-hidden="true" />
                  </div>
                ))}
              </div>
            </div>

            {/* Right — testimonials */}
            <div>
              {[
                { text: "I had been trying to sort my mother's land title from the UK for nearly a year. IKaze resolved it in 11 days. I received a complete file with every document, every reference number, and a summary of what to do next. I did not have to ask for a single update.", name: 'Agathe N.', role: 'Diaspora Client, UK National Land Authority service', avatar: 'A', bgImg: IMAGES.kigaliCity, dark: true },
                { text: 'As an investor entering Rwanda for the first time, I needed more than just paperwork processing. I needed someone who understood how things actually work on the ground. IKaze gave me that and did it with a level of professionalism I did not expect to find.', name: 'Michael B.', role: 'Foreign Investor RDB Business Setup, Kigali', avatar: 'M', bgImg: null, dark: false },
                { text: 'Our NGO registration was taking months before we engaged IKaze. They identified three errors in our original filing within 24 hours of reviewing our documents. The correct application was filed within a week. The efficiency was remarkable.', name: 'Sarah O.', role: 'NGO Director RGB Registration, Rwanda', avatar: 'S', bgImg: null, dark: false },
              ].map((t, i) => (
                <div key={i} style={{ background: t.dark ? 'var(--forest-dk)' : 'var(--ivory)', border: `1px solid ${t.dark ? 'transparent' : 'var(--border)'}`, padding: '2rem', marginBottom: '1rem', position: 'relative', overflow: 'hidden' }}>
                  {t.bgImg && <img src={t.bgImg} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.07 }} />}
                  <p style={{ fontSize: '0.95rem', color: t.dark ? 'rgba(255,255,255,0.82)' : 'var(--slate)', lineHeight: 1.8, fontStyle: 'italic', marginBottom: '1.5rem', position: 'relative' }}>
                    "{t.text}"
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', position: 'relative' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Cormorant Garamond',serif", fontSize: '1rem', fontWeight: 500, color: 'var(--forest-dk)', flexShrink: 0 }}>{t.avatar}</div>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.85rem', color: t.dark ? '#fff' : 'var(--forest-dk)' }}>{t.name}</p>
                      <p style={{ fontSize: '0.75rem', color: t.dark ? 'rgba(255,255,255,0.5)' : 'var(--muted)' }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}

              <div style={{ padding: '1.5rem', background: 'var(--ivory)', border: '1px solid var(--border)', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>Clients currently served from</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                  {['🇬🇧 United Kingdom','🇧🇪 Belgium','🇺🇸 United States','🇨🇦 Canada','🇳🇱 Netherlands','🌍 East Africa'].map(c => (
                    <span key={c} style={{ fontSize: '0.82rem', color: 'var(--slate)' }}>{c}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA — uses aerial for freshness vs hero ── */}
      <section style={{ position: 'relative', padding: '6rem 0', textAlign: 'center', overflow: 'hidden' }}>
        <img src={IMAGES.aerial} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,60,64,0.88)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(to bottom, #20603D, #FAD201, #1F4D9B)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)', position: 'relative' }}>
          <p className="about-label" style={{ color: 'var(--gold-lt)', marginBottom: '1.5rem' }}>Begin with a Conversation</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 300, color: '#fff', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Twenty minutes. No obligation.
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.6)', maxWidth: 520, margin: '0 auto 2.5rem', lineHeight: 1.75 }}>
            You leave knowing exactly what IKaze can do for your specific situation. No sales pitch. No pressure. Just clarity.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn-gold-custom" onClick={() => navigate('/booking')}>
              <i className="fa-solid fa-calendar-check" />
              Book a Free Audit
            </button>
            <button className="btn-outline-custom" onClick={() => navigate('/contact')}>
              <i className="fa-brands fa-whatsapp" />
              WhatsApp Us
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;