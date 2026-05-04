// client/src/pages/Booking.jsx
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { orderService } from '../services/orderService';
import { whatsappService } from '../services/whatsappService';
import api from '../services/api';

const IMAGES = {
  hero:     'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1600&q=85&fit=crop',
  kigali:   'https://images.unsplash.com/photo-1590736704728-f4730bb30770?w=900&q=80&fit=crop',
  hills:    'https://images.unsplash.com/photo-1627556704302-624286467c65?w=900&q=80&fit=crop',
  business: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=900&q=80&fit=crop',
  meeting:  'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=900&q=80&fit=crop',
};

// Static fallback services (used only if DB fetch fails)
const STATIC_SERVICES = [
  {
    id: 'a', icon: 'fa-file-contract',
    name: 'Essential Entry', tagline: 'Single IremboGov process, professionally handled.',
    price: 'Entry Tier', timeline: '24–72 Hours',
    description: 'A single government service navigated correctly the first time.',
    features: ['Single IremboGov service navigation', 'Document checklist within 24 hours', 'Digital delivery file', '14-day post-delivery support'],
    image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80&fit=crop',
  },
  {
    id: 'b', icon: 'fa-building-columns',
    name: 'Business Setup', tagline: 'Full RDB registration. End-to-end.',
    price: 'Standard Tier', timeline: '5–7 Business Days',
    description: 'Complete Rwanda Development Board registration management.',
    features: ['Full RDB company registration', 'TIN & trading licence', 'Bank account introduction', '30-day post-registration support'],
    popular: true,
    image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=600&q=80&fit=crop',
  },
  {
    id: 'c', icon: 'fa-people-group',
    name: 'NGO Setup', tagline: 'Rwanda Governance Board registration, precisely managed.',
    price: 'Premium Tier', timeline: '7–14 Business Days',
    description: 'Complex RGB registration handled with precision and no surprises.',
    features: ['RGB registration management', 'Pre-application error audit', 'Ministry alignment support', '45-day post-registration support'],
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80&fit=crop',
  },
  {
    id: 'd', icon: 'fa-star',
    name: 'VIP Relocation', tagline: 'Full-service entry. From the tarmac to settled.',
    price: 'Elite Tier', timeline: 'From arrival day',
    description: 'From landing to fully settled — every detail managed.',
    features: ['Airport arrival management', 'Accommodation coordination', 'Banking & SIM setup', '60-day dedicated support'],
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80&fit=crop',
  },
];

// Icon map for DB services that store icon as 'fa-file-contract' etc.
const ICON_MAP = {
  'Essential Entry':  { icon: 'fa-file-contract',   image: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=600&q=80&fit=crop' },
  'Business Setup':   { icon: 'fa-building-columns', image: 'https://images.unsplash.com/photo-1612392166886-ee8475b03af2?w=600&q=80&fit=crop' },
  'NGO Setup':        { icon: 'fa-people-group',     image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&q=80&fit=crop' },
  'VIP Relocation':   { icon: 'fa-star',             image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&q=80&fit=crop' },
};

const getServiceMeta = (svc, idx) => {
  const fallback = STATIC_SERVICES[idx] || {};
  const mapped   = ICON_MAP[svc.name] || {};
  return {
    icon:  svc.icon || mapped.icon  || fallback.icon  || 'fa-star',
    image: mapped.image || fallback.image || IMAGES.kigali,
  };
};

const Booking = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { currentStep, updateBookingData, setCurrentStep, resetBooking } = useBooking();

  // ── Services from DB ──────────────────────────────────────────────────────
  const [dbServices,      setDbServices]      = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);

  useEffect(() => {
    api.get('/services')
      .then(res => {
        const data = res.data?.data;
        if (Array.isArray(data) && data.length > 0) setDbServices(data);
      })
      .catch(() => {}) // silently fall back to static
      .finally(() => setServicesLoading(false));
  }, []);

  const displayServices = dbServices.length > 0 ? dbServices : STATIC_SERVICES;

  // ── Booking state ─────────────────────────────────────────────────────────
  const [selectedService, setSelectedService] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', country: '',
    visitPurpose: '', arrivalDate: '', departureDate: '',
    numberOfPeople: 1, specialRequests: '',
  });
  const [loading, setLoading]   = useState(false);
  const [errors,  setErrors]    = useState({});
  const [success, setSuccess]   = useState(false);

  // Pre-select a service if navigated from Services page
  useEffect(() => {
    if (location.state?.selectedService) {
      const svc = location.state.selectedService;
      setSelectedService(svc);
      updateBookingData({ service: svc });
      setCurrentStep(2);
    }
  }, [location.state]);

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleServiceSelect = (svc) => {
    setSelectedService(svc);
    updateBookingData({ service: svc });
    setCurrentStep(2);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim())    newErrors.name    = 'Full name is required';
    if (!formData.email.trim())   newErrors.email   = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email address';
    if (!formData.phone.trim())   newErrors.phone   = 'Phone number is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    if (!formData.arrivalDate)    newErrors.arrivalDate = 'Arrival date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      // Use MongoDB _id if available (DB service), fall back to serviceId string
      const serviceId = selectedService._id || selectedService.serviceId || selectedService.id;

      const orderData = {
        clientData: {
          name:         formData.name,
          email:        formData.email,
          phone:        formData.phone,
          country:      formData.country,
          visitPurpose: formData.visitPurpose,
        },
        serviceId,
        visitDetails: {
          arrivalDate:    formData.arrivalDate,
          departureDate:  formData.departureDate || undefined,
          numberOfPeople: Number(formData.numberOfPeople) || 1,
          specialRequests: formData.specialRequests,
        },
      };

      await orderService.createOrder(orderData);

      // Open WhatsApp after successful order
      const whatsappUrl = whatsappService.generateBookingMessage({
        serviceName: selectedService.name,
        clientName:  formData.name,
        arrivalDate: formData.arrivalDate,
      });
      window.open(whatsappUrl, '_blank');

      setSuccess(true);
      resetBooking();

      // Redirect after short delay so user sees the success state
      setTimeout(() => navigate('/'), 3000);
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to submit booking. Please try again or contact us via WhatsApp.';
      setErrors(prev => ({ ...prev, _form: msg }));
      console.error('Booking error:', error);
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ────────────────────────────────────────────────────────
  if (success) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8F5EF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Outfit',system-ui,sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet" />
        <div style={{ textAlign: 'center', maxWidth: 480, padding: '3rem 2rem' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#0b6e72', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <i className="fa-solid fa-check" style={{ color: '#E8C27A', fontSize: '1.8rem' }} />
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2.2rem', fontWeight: 300, color: '#0b6e72', marginBottom: '0.75rem' }}>Booking Submitted</h2>
          <p style={{ color: '#6B7A74', lineHeight: 1.7 }}>Your request has been received. Check your WhatsApp and email for confirmation. A written proposal will follow within 24 hours.</p>
          <p style={{ color: '#C9973A', fontSize: '0.8rem', marginTop: '1.5rem', letterSpacing: '0.08em' }}>Redirecting you shortly…</p>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#F8F5EF', fontFamily: "'Outfit',system-ui,sans-serif" }}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      <style>{`
        :root{--forest:#10878b;--forest-dk:#0b6e72;--forest-lt:#17c6d3;--gold:#C9973A;--gold-lt:#E8C27A;--gold-pale:#FAF4E8;--ivory:#F8F5EF;--warm-white:#FDFBF8;--charcoal:#1A1A1A;--slate:#3D4A45;--muted:#6B7A74;--border:#DDD5C4;--radius:2px;--transition:0.35s cubic-bezier(0.4,0,0.2,1);}
        .bk-label{font-size:0.7rem;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:var(--gold);}
        .form-label{font-size:0.72rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;color:var(--muted);display:block;margin-bottom:0.4rem;}
        .form-input,.form-select,.form-textarea{font-family:'Outfit',system-ui,sans-serif;font-size:0.92rem;color:var(--charcoal);background:#fff;border:1px solid var(--border);padding:0.85rem 1rem;width:100%;outline:none;border-radius:var(--radius);transition:border-color 0.2s,box-shadow 0.2s;appearance:none;box-sizing:border-box;}
        .form-input:focus,.form-select:focus,.form-textarea:focus{border-color:var(--forest);box-shadow:0 0 0 3px rgba(11,110,114,0.08);}
        .form-input.error,.form-select.error{border-color:#8B2020;}
        .form-error{font-size:0.78rem;color:#8B2020;margin-top:0.25rem;}
        .form-textarea{resize:vertical;min-height:110px;}
        .svc-select-card{background:#fff;border:1.5px solid var(--border);cursor:pointer;transition:var(--transition);position:relative;overflow:hidden;}
        .svc-select-card:hover{border-color:var(--forest-lt);box-shadow:0 8px 24px rgba(0,0,0,0.06);}
        .svc-select-card.selected{border-color:var(--forest);}
        .svc-select-card.selected::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:linear-gradient(to right,var(--gold),var(--gold-lt));}
        .popular-pill{display:inline-block;background:var(--gold);color:var(--forest-dk);font-size:0.62rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;padding:0.2rem 0.6rem;border-radius:1px;}
        .btn-gold{display:inline-flex;align-items:center;justify-content:center;gap:0.6rem;background:var(--gold);color:var(--forest-dk);font-size:0.8rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:1rem 2.2rem;border:none;cursor:pointer;border-radius:var(--radius);transition:var(--transition);width:100%;}
        .btn-gold:hover{background:var(--gold-lt);transform:translateY(-1px);}
        .btn-gold:disabled{opacity:0.7;transform:none;cursor:not-allowed;}
        .btn-outline{display:inline-flex;align-items:center;justify-content:center;gap:0.6rem;background:transparent;color:var(--forest);font-size:0.8rem;font-weight:600;letter-spacing:0.12em;text-transform:uppercase;padding:0.9rem 1.8rem;border:1px solid var(--border);cursor:pointer;border-radius:var(--radius);transition:var(--transition);}
        .btn-outline:hover{border-color:var(--forest);}
        .step-circle{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0;border:2px solid var(--border);transition:var(--transition);}
        .step-circle.active{background:var(--forest-dk);color:var(--gold-lt);border-color:var(--forest-dk);}
        .step-circle.completed{background:var(--gold);color:var(--forest-dk);border-color:var(--gold);}
        .step-circle.inactive{background:#fff;color:var(--muted);}
        .step-line{flex:1;height:1px;background:var(--border);margin:0 0.5rem;transition:background 0.4s;}
        .step-line.active{background:var(--gold);}
        .alert-error{background:#FFF5F5;border:1px solid #F5C6CB;color:#8B2020;padding:0.85rem 1rem;border-radius:var(--radius);font-size:0.85rem;margin-bottom:1rem;display:flex;align-items:flex-start;gap:0.5rem;}
        .spinner{width:40px;height:40px;border:2px solid var(--gold);border-top-color:transparent;border-radius:50%;animation:spin 0.9s linear infinite;margin:0 auto;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @media(max-width:768px){.two-col{grid-template-columns:1fr!important}.form-grid-2{grid-template-columns:1fr!important}}
      `}</style>

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', padding: '5rem 0 3rem', overflow: 'hidden' }}>
        <img src={IMAGES.hero} alt="Kigali Rwanda" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 30%' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(7,60,64,0.84)' }} />
        <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'linear-gradient(to bottom,#20603D,#FAD201,#1F4D9B)' }} />

        <div style={{ position: 'absolute', right: '5%', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8, opacity: 0.65 }}>
          <img src={IMAGES.kigali}   alt="" style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(201,151,58,0.3)' }} />
          <img src={IMAGES.business} alt="" style={{ width: 90, height: 70, objectFit: 'cover', borderRadius: 2, border: '1px solid rgba(201,151,58,0.3)' }} />
        </div>

        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)', textAlign: 'center', position: 'relative' }}>
          <p className="bk-label" style={{ color: 'var(--gold-lt)', marginBottom: '1rem' }}>Begin the Process</p>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.75rem' }}>
            Book a Free 20-Minute Audit
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.95rem', maxWidth: 500, margin: '0 auto' }}>
            Written proposal within 24 hours. No obligation. No payment required to begin.
          </p>
        </div>
      </div>

      {/* ── PROGRESS STEPS ── */}
      <div style={{ background: '#fff', borderBottom: '1px solid var(--border)', padding: '1.5rem 0' }}>
        <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {[
              { step: 1, label: 'Choose Service', icon: 'fa-list' },
              { step: 2, label: 'Your Details',   icon: 'fa-user' },
              { step: 3, label: 'Confirm',         icon: 'fa-check' },
            ].map((item, index) => (
              <React.Fragment key={item.step}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div className={`step-circle ${currentStep > item.step ? 'completed' : currentStep === item.step ? 'active' : 'inactive'}`}>
                    {currentStep > item.step
                      ? <i className="fa-solid fa-check" style={{ fontSize: '0.85rem' }} />
                      : <i className={`fa-solid ${item.icon}`} style={{ fontSize: '0.8rem' }} />
                    }
                  </div>
                  <p style={{ fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: currentStep === item.step ? 'var(--forest-dk)' : 'var(--muted)', whiteSpace: 'nowrap' }}>{item.label}</p>
                </div>
                {index < 2 && <div className={`step-line ${currentStep > item.step ? 'active' : ''}`} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '4rem clamp(1.5rem,5vw,4rem)' }}>

        {/* ── STEP 1: SERVICE SELECTION ── */}
        {currentStep === 1 && (
          <div style={{ maxWidth: 980, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <p className="bk-label" style={{ marginBottom: '0.75rem' }}>Step 1</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(1.8rem,3vw,2.8rem)', fontWeight: 300, color: 'var(--forest-dk)', letterSpacing: '-0.02em' }}>
                Select your service package
              </h2>
              <p style={{ fontSize: '0.9rem', color: 'var(--muted)', marginTop: '0.75rem' }}>
                Not sure? Every engagement begins with a free audit call — we will confirm the right fit.
              </p>
            </div>

            {servicesLoading ? (
              <div style={{ padding: '4rem 0', textAlign: 'center' }}>
                <div className="spinner" />
                <p style={{ marginTop: '1rem', fontSize: '0.8rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)' }}>Loading services…</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '1px', background: 'var(--border)', border: '1px solid var(--border)' }} className="two-col">
                {displayServices.map((svc, idx) => {
                  const { icon, image } = getServiceMeta(svc, idx);
                  const popular    = svc.popular || false;
                  const timeline   = svc.timeline || '';
                  const features   = svc.features || [];
                  const isSelected = selectedService
                    ? (selectedService._id && selectedService._id === svc._id) ||
                      (selectedService.id  && selectedService.id  === svc.id)  ||
                      selectedService.name === svc.name
                    : false;

                  return (
                    <div
                      key={svc._id || svc.id || idx}
                      className={`svc-select-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleServiceSelect(svc)}
                    >
                      {/* Image banner */}
                      <div style={{ height: 120, overflow: 'hidden', position: 'relative' }}>
                        <img src={image} alt="" aria-hidden="true" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.75 }} />
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(7,60,64,0.25) 0%,rgba(7,60,64,0.6) 100%)' }} />
                        {popular && (
                          <div style={{ position: 'absolute', top: 12, left: 12 }}>
                            <div className="popular-pill"><i className="fa-solid fa-star" style={{ marginRight: '0.3rem', fontSize: '0.6rem' }} />Most Requested</div>
                          </div>
                        )}
                        <div style={{ position: 'absolute', bottom: 12, left: 12 }}>
                          <i className={`fa-solid ${icon}`} style={{ fontSize: '1.5rem', color: 'var(--gold-lt)' }} />
                        </div>
                      </div>

                      {/* Card body */}
                      <div style={{ padding: '1.5rem' }}>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.7rem', fontWeight: 400, color: 'var(--forest-dk)', marginBottom: '0.3rem' }}>
                          {svc.name}
                        </h3>
                        <p style={{ fontSize: '0.78rem', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1rem' }}>
                          {svc.tagline}
                        </p>
                        {features.length > 0 && (
                          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem', padding: 0 }}>
                            {features.slice(0, 3).map((f, fi) => (
                              <li key={fi} style={{ fontSize: '0.83rem', color: 'var(--slate)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                <i className="fa-solid fa-minus" style={{ color: 'var(--gold)', flexShrink: 0, marginTop: '0.25rem', fontSize: '0.65rem' }} />
                                {f}
                              </li>
                            ))}
                          </ul>
                        )}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {svc.price != null && (
                            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: typeof svc.price === 'number' ? '1.2rem' : '1rem', color: typeof svc.price === 'number' ? 'var(--gold)' : 'var(--muted)', fontWeight: 400 }}>
                              {typeof svc.price === 'number' ? `$${svc.price.toLocaleString()}` : svc.price}
                            </span>
                          )}
                          {timeline && (
                            <span style={{ fontSize: '0.72rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--forest)', padding: '0.3rem 0.6rem', background: 'var(--gold-pale)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                              <i className="fa-regular fa-clock" />
                              {timeline}
                            </span>
                          )}
                        </div>
                        {isSelected && (
                          <div style={{ marginTop: '1rem', padding: '0.6rem', background: 'var(--gold-pale)', border: '1px solid var(--gold)', borderRadius: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <i className="fa-solid fa-check" style={{ color: 'var(--gold)', fontSize: '0.8rem' }} />
                            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--forest-dk)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <p style={{ textAlign: 'center', fontSize: '0.82rem', color: 'var(--muted)', marginTop: '1.5rem', lineHeight: 1.6 }}>
              <i className="fa-solid fa-info-circle" style={{ color: 'var(--gold)', marginRight: '0.4rem' }} />
              Not sure which package is right? Select the closest option and note your situation in the details form.
            </p>
          </div>
        )}

        {/* ── STEP 2: FORM ── */}
        {currentStep === 2 && selectedService && (
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            {/* Selected service recap */}
            <div style={{ marginBottom: '2rem', background: '#fff', border: '1px solid var(--border)', overflow: 'hidden' }}>
              <div style={{ height: 80, position: 'relative', overflow: 'hidden' }}>
                <img
                  src={getServiceMeta(selectedService, displayServices.findIndex(s => s.name === selectedService.name)).image}
                  alt=""
                  aria-hidden="true"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right,rgba(7,60,64,0.8) 0%,transparent 60%)' }} />
                <div style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <i className={`fa-solid ${getServiceMeta(selectedService, displayServices.findIndex(s => s.name === selectedService.name)).icon}`} style={{ color: 'var(--gold-lt)', fontSize: '1.4rem' }} />
                  <div>
                    <p style={{ fontSize: '0.6rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>Selected Service</p>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', fontWeight: 400, color: '#fff' }}>{selectedService.name}</p>
                  </div>
                </div>
                <button
                  className="btn-outline"
                  style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', width: 'auto', padding: '0.4rem 1rem', fontSize: '0.72rem', background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}
                  onClick={() => { setCurrentStep(1); setErrors({}); }}
                >
                  <i className="fa-solid fa-pen-to-square" />
                  Change
                </button>
              </div>
            </div>

            <div style={{ background: '#fff', border: '1px solid var(--border)', padding: '2.5rem' }}>
              <p className="bk-label" style={{ marginBottom: '0.75rem' }}>Step 2</p>
              <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '2rem', fontWeight: 300, color: 'var(--forest-dk)', marginBottom: '2rem', letterSpacing: '-0.02em' }}>
                Your details
              </h2>

              {/* Form-level error */}
              {errors._form && (
                <div className="alert-error">
                  <i className="fa-solid fa-circle-exclamation" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                  <span>{errors._form}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid-2">
                  <div>
                    <label className="form-label" htmlFor="name">Full Name *</label>
                    <input
                      id="name"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                    {errors.name && <p className="form-error">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="form-label" htmlFor="email">Email Address *</label>
                    <input
                      id="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                      autoComplete="email"
                    />
                    {errors.email && <p className="form-error">{errors.email}</p>}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid-2">
                  <div>
                    <label className="form-label" htmlFor="phone">WhatsApp / Phone *</label>
                    <input
                      id="phone"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+250 XXX XXX XXX"
                      autoComplete="tel"
                    />
                    {errors.phone && <p className="form-error">{errors.phone}</p>}
                  </div>
                  <div>
                    <label className="form-label" htmlFor="country">Country of Residence *</label>
                    <input
                      id="country"
                      className={`form-input ${errors.country ? 'error' : ''}`}
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="e.g. United Kingdom"
                      autoComplete="country-name"
                    />
                    {errors.country && <p className="form-error">{errors.country}</p>}
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="visitPurpose">Purpose of Engagement</label>
                  <select
                    id="visitPurpose"
                    className="form-select"
                    name="visitPurpose"
                    value={formData.visitPurpose}
                    onChange={handleInputChange}
                  >
                    <option value="">Select a purpose…</option>
                    <option value="Business registration">Business registration</option>
                    <option value="NGO registration">NGO registration</option>
                    <option value="Government document">Government document / IremboGov</option>
                    <option value="Relocation">Relocation to Rwanda</option>
                    <option value="Investment">Investment &amp; market entry</option>
                    <option value="Family visit">Family visit / diaspora</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }} className="form-grid-2">
                  <div>
                    <label className="form-label" htmlFor="arrivalDate">Arrival / Start Date *</label>
                    <input
                      id="arrivalDate"
                      className={`form-input ${errors.arrivalDate ? 'error' : ''}`}
                      name="arrivalDate"
                      type="date"
                      value={formData.arrivalDate}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                    />
                    {errors.arrivalDate && <p className="form-error">{errors.arrivalDate}</p>}
                  </div>
                  <div>
                    <label className="form-label" htmlFor="departureDate">Departure / End Date (Optional)</label>
                    <input
                      id="departureDate"
                      className="form-input"
                      name="departureDate"
                      type="date"
                      value={formData.departureDate}
                      onChange={handleInputChange}
                      min={formData.arrivalDate || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div>
                  <label className="form-label" htmlFor="numberOfPeople">Number of People</label>
                  <input
                    id="numberOfPeople"
                    className="form-input"
                    name="numberOfPeople"
                    type="number"
                    value={formData.numberOfPeople}
                    onChange={handleInputChange}
                    min="1"
                    max="20"
                    style={{ maxWidth: 120 }}
                  />
                </div>

                <div>
                  <label className="form-label" htmlFor="specialRequests">Additional Notes (Optional)</label>
                  <textarea
                    id="specialRequests"
                    className="form-textarea"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleInputChange}
                    placeholder="Describe your situation, any specific requirements, or questions…"
                  />
                </div>

                <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn-outline"
                    style={{ flex: '0 0 auto', padding: '0.9rem 1.6rem' }}
                    onClick={() => { setCurrentStep(1); setErrors({}); }}
                  >
                    <i className="fa-solid fa-arrow-left" />
                    Back
                  </button>
                  <button type="submit" className="btn-gold" disabled={loading} style={{ flex: 1 }}>
                    {loading
                      ? <><i className="fa-solid fa-circle-notch fa-spin" />Submitting…</>
                      : <><i className="fa-solid fa-paper-plane" />Submit Booking Request</>
                    }
                  </button>
                </div>

                <p style={{ fontSize: '0.75rem', color: 'var(--muted)', lineHeight: 1.65 }}>
                  <i className="fa-solid fa-shield-halved" style={{ color: 'var(--gold)', marginRight: '0.4rem' }} />
                  After submission you will receive a WhatsApp confirmation and an email within 2 hours. A written proposal will follow within 24 hours. No payment is required at this stage.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* ── TRUST FOOTER ── */}
      <div style={{ position: 'relative', padding: '2.5rem 0', borderTop: '1px solid rgba(201,151,58,0.15)', overflow: 'hidden' }}>
        <img src={IMAGES.meeting} alt="" aria-hidden="true" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'var(--forest-dk)' }} />
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 clamp(1.5rem,5vw,4rem)', display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap', position: 'relative' }}>
          {[
            { icon: 'fa-file-pen',      text: 'Written proposal before you pay anything' },
            { icon: 'fa-shield-halved', text: 'RDB registered & verifiable' },
            { icon: 'fa-clock',         text: 'Response within 2 hours' },
            { icon: 'fa-lock',          text: 'Zero undisclosed payments' },
          ].map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <i className={`fa-solid ${t.icon}`} style={{ color: 'var(--gold)', fontSize: '0.9rem' }} />
              <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500, letterSpacing: '0.04em' }}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Booking;