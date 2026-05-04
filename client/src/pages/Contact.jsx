// client/src/pages/Contact.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CONTACT_INFO, FAQS } from '../utils/constants';
import { whatsappService } from '../services/whatsappService';

const IMAGES = {
  hero:      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=85&fit=crop',
  kigali:    'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=900&q=80&fit=crop',
  hills:     'https://images.unsplash.com/photo-1627556704302-624286467c65?w=900&q=80&fit=crop',
  map:       'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=1400&q=80&fit=crop',
  meeting:   'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80&fit=crop',
  business:  'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=900&q=80&fit=crop',
};

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name:'', email:'', phone:'', service:'', message:'', inquiryType:'general' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const inquiryTypes = [
    { value:'general',     label:'General Inquiry',  icon:'fa-comment-dots' },
    { value:'booking',     label:'Booking Question', icon:'fa-calendar-days' },
    { value:'support',     label:'Support Request',  icon:'fa-headset' },
    { value:'partnership', label:'Partnership',      icon:'fa-handshake' },
  ];

  const serviceOptions = [
    'Essential Entry (IremboGov)',
    'Business Setup & RDB Registration',
    'NGO & RGB Registration',
    'VIP Relocation & Full Entry',
    'Not sure — need guidance',
  ];

  const contactOptions = [
    { icon:'fa-brands fa-whatsapp', label:'WhatsApp — Fastest Response', sub:'+250 788 553 034 · Responds within 2 hours', href:'https://wa.me/250788553034', primary:true },
    { icon:'fa-calendar-days',      label:'Book via Calendly',            sub:'calendly.com/kaze-concierge · 30-min slots available', href:'https://calendly.com/kaze-concierge' },
    { icon:'fa-envelope',           label:'Email',                        sub:`hello@kazeconcierge.rw · Response within 4 hours`, href:`mailto:${CONTACT_INFO?.email || 'hello@kazeconcierge.rw'}` },
    { icon:'fa-location-dot',       label:'Based In',                     sub:'Eastern Province, Rwanda · Serving clients globally', href:null },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim())    newErrors.name    = 'Name is required';
    if (!formData.email.trim())   newErrors.email   = 'Email is required';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const message = `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone || 'Not provided'}\nService: ${formData.service || 'Not specified'}\nType: ${inquiryTypes.find(t => t.value === formData.inquiryType)?.label}\n\nMessage:\n${formData.message}`.trim();
      whatsappService?.openWhatsApp(message);
      alert('✅ Message sent. We will respond within 2 hours.');
      setFormData({ name:'', email:'', phone:'', service:'', message:'', inquiryType:'general' });
    } catch {
      alert('Failed to send. Please contact us directly via WhatsApp.');
    } finally {
      setSubmitting(false);
    }
  };

  const faqs = FAQS?.slice(0, 6) || [
    { id:1, category:'Process',  question:'How does the free audit call work?',              answer:'It is a 20-minute call where we diagnose your exact need and confirm the right service package. You receive two actionable insights during this call regardless of whether you engage us.' },
    { id:2, category:'Process',  question:'When does work begin?',                           answer:'No work begins until you have confirmed the written proposal and a 50% deposit is received. This protects you as much as it protects us.' },
    { id:3, category:'Timeline', question:'How long does RDB business registration take?',  answer:'5–7 business days from the point we have all required documents. We provide a precise document checklist within 24 hours of your audit call.' },
    { id:4, category:'Payment',  question:'How do I pay from abroad?',                      answer:'We accept Wise, Remitly, and MTN Mobile Money. All payments are invoiced via Wave. No cash-in-hand. Every transaction is documented and traceable.' },
    { id:5, category:'Trust',    question:'Are you a registered business?',                  answer:'Yes. IKaze Concierge is formally registered with RDB (Rwanda Development Board). Our registration is verifiable and on record.' },
    { id:6, category:'Scope',    question:'Do you handle NGO registration?',                 answer:'Yes. We manage the full RGB (Rwanda Governance Board) registration process including pre-application error audits, documentation preparation, and Ministry alignment support.' },
  ];

  return (
    <div style={{ minHeight:'100vh', background:'#FDFBF8', fontFamily:"'Outfit',system-ui,sans-serif" }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        :root{--forest:#10878b;--forest-dk:#0b6e72;--forest-lt:#04999f;--gold:#C9973A;--gold-lt:#E8C27A;--gold-pale:#FAF4E8;--ivory:#F8F5EF;--warm-white:#FDFBF8;--charcoal:#1A1A1A;--slate:#3D4A45;--muted:#6B7A74;--border:#DDD5C4;--radius:2px;--transition:0.35s cubic-bezier(0.4,0,0.2,1);}
        .contact-label{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);}
        .form-label{font-size:0.72rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:0.4rem;}
        .form-input,.form-select,.form-textarea{font-family:'Outfit',system-ui,sans-serif;font-size:0.92rem;color:var(--charcoal);background:#fff;border:1px solid var(--border);padding:0.85rem 1rem;width:100%;outline:none;border-radius:var(--radius);transition:border-color 0.2s,box-shadow 0.2s;appearance:none;}
        .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--forest);box-shadow:0 0 0 3px rgba(11,110,114,0.08);}
        .form-input.error,.form-textarea.error{border-color:#8B2020;}
        .form-textarea{resize:vertical;min-height:130px;}
        .form-error{font-size:0.78rem;color:#8B2020;margin-top:0.25rem;}
        .inquiry-btn{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0.85rem;border:1.5px solid var(--border);background:#fff;cursor:pointer;transition:var(--transition);border-radius:var(--radius);gap:0.35rem;}
        .inquiry-btn.active{border-color:var(--forest);background:var(--gold-pale);}
        .inquiry-btn:hover{border-color:var(--forest-lt);}
        .contact-option{display:flex;gap:1.2rem;padding:1.2rem 1.5rem;background:var(--ivory);border:1px solid var(--border);align-items:center;transition:var(--transition);cursor:pointer;text-decoration:none;color:inherit;}
        .contact-option:hover{border-color:var(--gold);background:var(--gold-pale);}
        .contact-option.primary{border-color:var(--forest);background:rgba(11,110,114,0.04);}
        .contact-option.primary:hover{background:var(--gold-pale);border-color:var(--gold);}
        .faq-item{border:1px solid var(--border);background:#fff;cursor:pointer;transition:var(--transition);margin-bottom:0;border-top:none;}
        .faq-item:first-child{border-top:1px solid var(--border);}
        .faq-item:hover{background:var(--ivory);}
        .faq-answer{font-size:0.92rem;color:var(--slate);line-height:1.75;padding:0 1.5rem 1.2rem;border-top:1px solid var(--border);}
        .btn-gold{display:inline-flex;align-items:center;gap:0.6rem;background:var(--gold);color:var(--forest-dk);font-size:0.8rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:1rem 2.2rem;border:none;cursor:pointer;border-radius:var(--radius);transition:var(--transition);}
        .btn-gold:hover{background:var(--gold-lt);transform:translateY(-1px);}
        .btn-outline{display:inline-flex;align-items:center;gap:0.6rem;background:transparent;color:var(--forest);font-size:0.8rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:1rem 2.2rem;border:1px solid var(--forest);cursor:pointer;border-radius:var(--radius);transition:var(--transition);}
        .btn-outline:hover{background:var(--forest);color:#fff;}
        @media(max-width:768px){.two-col{grid-template-columns:1fr!important}.three-col{grid-template-columns:1fr 1fr!important}}
      `}</style>

{/* ── HERO with full background image ── */}
<section style={{ position: 'relative', padding: '8rem 0 5rem', overflow: 'hidden' }}>
  <img
    src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=90&fit=crop"
    alt="Luxury hotel and Kigali skyline, Rwanda"
    style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center center',
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
      textAlign: 'center',
    }}
  >
    <p
      className="contact-label"
      style={{ color: 'var(--gold-lt)', marginBottom: '1.2rem' }}
    >
      Get in Touch
    </p>

    <h1
      style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: 'clamp(2.5rem,5vw,5rem)',
        fontWeight: 300,
        color: '#fff',
        letterSpacing: '-0.02em',
        lineHeight: 1.1,
        marginBottom: '1rem',
      }}
    >
      Begin with a conversation.
    </h1>

    <p
      style={{
        fontSize: '1.05rem',
        color: 'rgba(255,255,255,0.58)',
        maxWidth: 560,
        margin: '0 auto',
        lineHeight: 1.75,
      }}
    >
      Twenty minutes. No obligation. You leave knowing exactly what IKaze can do
      for your specific situation.
    </p>
  </div>
</section>

      {/* ── CONTACT METHODS with image sidebar ── */}
      <section style={{ background:'#fff', padding:'5rem 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 420px', gap:'4rem', alignItems:'start' }} className="two-col">
            <div>
              <p className="contact-label" style={{ marginBottom:'1rem' }}>Reach Us Directly</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(1.8rem,3vw,2.8rem)', fontWeight:300, color:'var(--forest-dk)', letterSpacing:'-0.02em', marginBottom:'2rem' }}>
                For many clients, a direct WhatsApp message is the fastest route.
              </h2>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {contactOptions.map((opt, i) => (
                  opt.href ? (
                    <a key={i} href={opt.href} target={opt.href.startsWith('http')?'_blank':undefined} rel="noreferrer" className={`contact-option ${opt.primary?'primary':''}`}>
                      <div style={{ width:44, height:44, borderRadius:'50%', background:opt.primary?'var(--forest)':'var(--gold-pale)', border:`1px solid ${opt.primary?'transparent':'var(--border)'}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <i className={opt.icon} style={{ color:opt.primary?'var(--gold-lt)':'var(--gold)', fontSize:'1.1rem' }} />
                      </div>
                      <div>
                        <span style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--forest-dk)', display:'block' }}>{opt.label}</span>
                        <span style={{ fontSize:'0.8rem', color:'var(--muted)' }}>{opt.sub}</span>
                      </div>
                      {opt.primary && <span style={{ marginLeft:'auto', fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'var(--gold)', color:'var(--forest-dk)', padding:'0.2rem 0.6rem', borderRadius:1, flexShrink:0 }}>Recommended</span>}
                    </a>
                  ) : (
                    <div key={i} className="contact-option">
                      <div style={{ width:44, height:44, borderRadius:'50%', background:'var(--gold-pale)', border:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                        <i className={opt.icon} style={{ color:'var(--gold)', fontSize:'1.1rem' }} />
                      </div>
                      <div>
                        <span style={{ fontWeight:600, fontSize:'0.9rem', color:'var(--forest-dk)', display:'block' }}>{opt.label}</span>
                        <span style={{ fontSize:'0.8rem', color:'var(--muted)' }}>{opt.sub}</span>
                      </div>
                    </div>
                  )
                ))}
              </div>
              {/* Response guarantee */}
              <div style={{ marginTop:'2rem', background:'var(--forest)', padding:'1.5rem 2rem', display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                <i className="fa-solid fa-shield-halved" style={{ color:'var(--gold-lt)', fontSize:'1.2rem', flexShrink:0, marginTop:'0.15rem' }} />
                <div>
                  <p style={{ fontWeight:600, fontSize:'0.9rem', color:'#fff', marginBottom:'0.25rem' }}>Our Response Guarantee</p>
                  <p style={{ fontSize:'0.82rem', color:'rgba(255,255,255,0.65)', lineHeight:1.65 }}>
                    Every inquiry receives a personal response within 2 hours during business hours (8am–8pm EAT, Monday–Saturday). If you do not hear from us within 2 hours, message us on WhatsApp directly.
                  </p>
                </div>
              </div>
            </div>

            {/* Image sidebar */}
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              <div style={{ height:280, overflow:'hidden', borderRadius:2, position:'relative' }}>
                <img src={IMAGES.kigali} alt="Kigali skyline" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(7,60,64,0.5) 0%,transparent 60%)' }} />
                <div style={{ position:'absolute', bottom:16, left:16 }}>
                  <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'0.9rem', fontStyle:'italic', color:'rgba(255,255,255,0.9)' }}>Eastern Province, Rwanda</p>
                </div>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                <div style={{ height:130, overflow:'hidden', borderRadius:2 }}>
                  <img src={IMAGES.hills} alt="Rwanda hills" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
                <div style={{ height:130, overflow:'hidden', borderRadius:2 }}>
                  <img src={IMAGES.meeting} alt="Business meeting" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT FORM + SIDEBAR ── */}
      <section style={{ background:'var(--ivory)', padding:'7rem 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:'6rem', alignItems:'start' }} className="two-col">
            {/* FORM */}
            <div style={{ background:'#fff', border:'1px solid var(--border)', padding:'3rem' }}>
              <p className="contact-label" style={{ marginBottom:'0.75rem' }}>Send a Message</p>
              <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:300, color:'var(--forest-dk)', marginBottom:'2rem', letterSpacing:'-0.02em', lineHeight:1.2 }}>
                Tell us what you need.<br />We respond within 2 hours.
              </h2>

              <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
                <div>
                  <label className="form-label">What can we help you with?</label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.5rem' }} className="three-col">
                    {inquiryTypes.map(t => (
                      <button key={t.value} type="button" className={`inquiry-btn ${formData.inquiryType===t.value?'active':''}`} onClick={() => setFormData(prev => ({ ...prev, inquiryType:t.value }))}>
                        <i className={`fa-solid ${t.icon}`} style={{ color:formData.inquiryType===t.value?'var(--forest)':'var(--muted)', fontSize:'1.1rem' }} />
                        <span style={{ fontSize:'0.72rem', fontWeight:500, color:formData.inquiryType===t.value?'var(--forest-dk)':'var(--muted)', textAlign:'center', lineHeight:1.3 }}>{t.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input className={`form-input ${errors.name?'error':''}`} name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input className={`form-input ${errors.email?'error':''}`} name="email" type="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>
                </div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div>
                    <label className="form-label">WhatsApp / Phone (Optional)</label>
                    <input className="form-input" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} placeholder="+250 XXX XXX XXX" />
                  </div>
                  <div>
                    <label className="form-label">Service Interested In</label>
                    <select className="form-select" name="service" value={formData.service} onChange={handleInputChange}>
                      <option value="">Select a service...</option>
                      {serviceOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="form-label">Message *</label>
                  <textarea className={`form-textarea ${errors.message?'error':''}`} name="message" value={formData.message} onChange={handleInputChange} placeholder="Tell us about your situation and what you need..." />
                  {errors.message && <p className="form-error">{errors.message}</p>}
                </div>
                <button type="submit" className="btn-gold" disabled={submitting} style={{ width:'100%', justifyContent:'center', opacity:submitting?0.7:1 }}>
                  {submitting
                    ? <><i className="fa-solid fa-circle-notch fa-spin" />Sending...</>
                    : <><i className="fa-solid fa-paper-plane" />Send Message — Response in 2 Hours</>
                  }
                </button>
                <p style={{ fontSize:'0.75rem', color:'var(--muted)', textAlign:'center', lineHeight:1.6 }}>
                  By submitting this form you agree to receive communications from IKaze Concierge. We will never share your information.
                </p>
              </form>
            </div>

            {/* SIDEBAR */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              {/* Office info */}
              <div style={{ background:'#fff', border:'1px solid var(--border)', padding:'2rem' }}>
                <p className="contact-label" style={{ marginBottom:'1.2rem' }}>Office Information</p>
                {[
                  { icon:'fa-location-dot', label:'Address',        value:CONTACT_INFO?.address || 'Eastern Province, Rwanda' },
                  { icon:'fa-clock',        label:'Business Hours', value:CONTACT_INFO?.businessHours || 'Mon–Sat, 8am–8pm EAT' },
                  { icon:'fa-globe',        label:'Time Zone',      value:'East Africa Time (EAT) — UTC +3' },
                  { icon:'fa-phone',        label:'Phone',          value:CONTACT_INFO?.phone || '+250 788 553 034' },
                ].map((item, i) => (
                  <div key={i} style={{ display:'flex', gap:'1rem', alignItems:'flex-start', padding:'0.9rem 0', borderBottom:i<3?'1px solid var(--border)':'none' }}>
                    <i className={`fa-solid ${item.icon}`} style={{ color:'var(--gold)', fontSize:'0.95rem', marginTop:'0.2rem', flexShrink:0, width:18, textAlign:'center' }} />
                    <div>
                      <p style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--muted)', marginBottom:'0.15rem' }}>{item.label}</p>
                      <p style={{ fontSize:'0.9rem', color:'var(--forest-dk)', fontWeight:500 }}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Urgency CTA with image background */}
              <div style={{ position:'relative', overflow:'hidden' }}>
                <img src={IMAGES.business} alt="" aria-hidden="true" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.15 }} />
                <div style={{ background:'var(--forest-dk)', padding:'2rem', position:'relative' }}>
                  <p style={{ fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:'var(--gold-lt)', marginBottom:'0.75rem' }}>Immediate Help</p>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.5rem', fontWeight:300, color:'#fff', marginBottom:'0.75rem', lineHeight:1.3 }}>
                    For urgent enquiries, WhatsApp is the fastest route.
                  </h3>
                  <p style={{ fontSize:'0.85rem', color:'rgba(255,255,255,0.6)', marginBottom:'1.5rem', lineHeight:1.7 }}>
                    We respond within 2 hours and can schedule your audit call the same day in most cases.
                  </p>
                  <a href="https://wa.me/250788553034" target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem', background:'var(--gold)', color:'var(--forest-dk)', fontSize:'0.8rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', padding:'0.9rem 1.8rem', textDecoration:'none', borderRadius:2 }}>
                    <i className="fa-brands fa-whatsapp" style={{ fontSize:'1rem' }} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Book now CTA */}
              <div style={{ background:'var(--ivory)', border:'1px solid var(--border)', padding:'2rem' }}>
                <p className="contact-label" style={{ marginBottom:'0.75rem' }}>Ready to Plan?</p>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'1.5rem', fontWeight:300, color:'var(--forest-dk)', marginBottom:'0.75rem', lineHeight:1.3 }}>
                  Skip the form. Start planning your Rwanda process today.
                </h3>
                <p style={{ fontSize:'0.85rem', color:'var(--slate)', marginBottom:'1.5rem', lineHeight:1.7 }}>
                  Book a 20-minute free audit — no obligation, no payment required.
                </p>
                <button className="btn-outline" onClick={() => navigate('/booking')} style={{ width:'100%', justifyContent:'center' }}>
                  <i className="fa-solid fa-calendar-check" />
                  Book a Free Audit
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background:'#fff', padding:'7rem 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ textAlign:'center', marginBottom:'4rem' }}>
            <p className="contact-label" style={{ marginBottom:'1rem' }}>Common Questions</p>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(2rem,3.5vw,3.2rem)', fontWeight:300, color:'var(--forest-dk)', letterSpacing:'-0.02em' }}>
              Frequently asked questions
            </h2>
          </div>
          <div style={{ maxWidth:780, margin:'0 auto' }}>
            {faqs.map((faq, i) => (
              <div key={faq.id||i} className="faq-item" onClick={() => setExpandedFaq(expandedFaq===i?null:i)}>
                <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', gap:'1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1rem', flex:1 }}>
                    <span style={{ background:'var(--gold-pale)', border:'1px solid var(--border)', padding:'0.2rem 0.6rem', fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--gold)', flexShrink:0, borderRadius:1 }}>{faq.category}</span>
                    <p style={{ fontWeight:600, fontSize:'0.92rem', color:'var(--forest-dk)', lineHeight:1.4 }}>{faq.question}</p>
                  </div>
                  <i className="fa-solid fa-chevron-down" style={{ color:'var(--gold)', fontSize:'0.85rem', flexShrink:0, transition:'transform 0.3s ease', transform:expandedFaq===i?'rotate(180deg)':'rotate(0deg)' }} />
                </div>
                {expandedFaq===i && <div className="faq-answer">{faq.answer}</div>}
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:'3rem' }}>
            <p style={{ fontSize:'0.9rem', color:'var(--muted)', marginBottom:'1.5rem' }}>Still have questions?</p>
            <a href="https://wa.me/250788553034" target="_blank" rel="noreferrer" className="btn-gold" style={{ textDecoration:'none' }}>
              <i className="fa-brands fa-whatsapp" />
              Ask Us Directly on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── MAP with full image ── */}
      <section style={{ background:'var(--ivory)', padding:'4rem 0' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ position:'relative', height:320, overflow:'hidden', borderRadius:2 }}>
            <img src={IMAGES.map} alt="Rwanda map view" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', inset:0, background:'rgba(7,60,64,0.72)' }} />
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'1rem' }}>
              <i className="fa-solid fa-location-dot" style={{ color:'var(--gold)', fontSize:'3rem' }} />
              <div style={{ textAlign:'center' }}>
                <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:'2rem', fontWeight:300, color:'#fff', marginBottom:'0.5rem' }}>Find Us in Rwanda</h3>
                <p style={{ color:'rgba(255,255,255,0.6)', fontSize:'0.9rem' }}>Eastern Province, Rwanda · Serving clients globally</p>
              </div>
              <a href="https://www.google.com/maps/place/Rwanda" target="_blank" rel="noreferrer" className="btn-gold" style={{ textDecoration:'none', marginTop:'0.5rem' }}>
                <i className="fa-solid fa-map-location-dot" />
                Open in Maps
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;