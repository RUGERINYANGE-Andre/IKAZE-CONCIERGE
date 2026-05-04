// client/src/pages/Register.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const COUNTRIES = [
  'Rwanda', 'Uganda', 'Kenya', 'Tanzania', 'Burundi', 'DRC Congo',
  'Ethiopia', 'South Africa', 'Nigeria', 'Ghana', 'United States',
  'United Kingdom', 'France', 'Germany', 'China', 'India',
  'Japan', 'Canada', 'Australia', 'Other',
];

const VISIT_PURPOSES = [
  { value: 'tourism',         label: '🏔️ Tourism & Sightseeing' },
  { value: 'business',        label: '💼 Business & Conferences' },
  { value: 'medical',         label: '🏥 Medical Tourism' },
  { value: 'education',       label: '🎓 Education & Research' },
  { value: 'honeymoon',       label: '💕 Honeymoon & Romance' },
  { value: 'family',          label: '👨‍👩‍👧 Family Visit' },
  { value: 'gorilla_trekking',label: '🦍 Gorilla Trekking' },
  { value: 'other',           label: '✈️ Other' },
];

// ─── Client Registration Form ───────────────────────────────────────────────
const ClientRegisterForm = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    country: '',
    visitPurpose: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validateStep1 = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = 'Full name is required';
    else if (formData.name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters';

    if (!formData.email.trim())
      errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Enter a valid email address';

    if (!formData.phone.trim())
      errs.phone = 'Phone number is required';
    else if (formData.phone.trim().length < 9)
      errs.phone = 'Enter a valid phone number';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs = {};
    if (!formData.country)      errs.country = 'Please select your country';
    if (!formData.visitPurpose) errs.visitPurpose = 'Please select visit purpose';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep2()) return;
    setLoading(true);
    setError('');
    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step >= 1 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            {step > 1 ? '✓' : '1'}
          </div>
          <span className={`ml-2 text-sm font-medium ${
            step >= 1 ? 'text-teal-600' : 'text-gray-400'
          }`}>
            Personal Info
          </span>
        </div>
        <div className={`w-16 h-1 mx-3 rounded transition-all ${
          step >= 2 ? 'bg-teal-500' : 'bg-gray-200'
        }`} />
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
            step >= 2 ? 'bg-teal-500 text-white' : 'bg-gray-200 text-gray-500'
          }`}>
            2
          </div>
          <span className={`ml-2 text-sm font-medium ${
            step >= 2 ? 'text-teal-600' : 'text-gray-400'
          }`}>
            Visit Details
          </span>
        </div>
      </div>

      {/* Global Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
            <p className="text-gray-500 text-sm">Tell us about yourself</p>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">👤</span>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
                  fieldErrors.name
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-teal-500'
                }`}
              />
            </div>
            {fieldErrors.name && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.name}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">📧</span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your@email.com"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
                  fieldErrors.email
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-teal-500'
                }`}
              />
            </div>
            {fieldErrors.email && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">📱</span>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+250 XXX XXX XXX"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
                  fieldErrors.phone
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-teal-500'
                }`}
              />
            </div>
            {fieldErrors.phone && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.phone}</p>
            )}
            <p className="text-gray-400 text-xs mt-1">
              💡 Used to verify your identity when logging in
            </p>
          </div>

          <button
            type="button"
            onClick={() => validateStep1() && setStep(2)}
            className="w-full bg-teal-500 hover:bg-teal-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Visit Details</h3>
            <p className="text-gray-500 text-sm">Help us personalize your experience</p>
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Country of Origin <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2">🌍</span>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none appearance-none bg-white ${
                  fieldErrors.country
                    ? 'border-red-400 bg-red-50'
                    : 'border-gray-200 focus:border-teal-500'
                }`}
              >
                <option value="">Select your country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {fieldErrors.country && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.country}</p>
            )}
          </div>

          {/* Visit Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Purpose of Visit <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {VISIT_PURPOSES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, visitPurpose: p.value }));
                    setFieldErrors((prev) => ({ ...prev, visitPurpose: '' }));
                  }}
                  className={`p-3 rounded-lg border text-xs text-left transition-all ${
                    formData.visitPurpose === p.value
                      ? 'border-teal-500 bg-teal-50 text-teal-700 font-medium'
                      : 'border-gray-200 text-gray-600 hover:border-teal-300'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
            {fieldErrors.visitPurpose && (
              <p className="text-red-500 text-xs mt-1">{fieldErrors.visitPurpose}</p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 text-sm">
            <p className="font-semibold text-teal-800 mb-2">📋 Account Summary</p>
            <div className="space-y-1 text-teal-700 text-xs">
              <p>👤 {formData.name}</p>
              <p>📧 {formData.email}</p>
              <p>📱 {formData.phone}</p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold py-3 rounded-lg transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-teal-500 hover:bg-teal-600 disabled:bg-teal-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account 🎉'
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

// ─── Admin Registration Form ─────────────────────────────────────────────────
const AdminRegisterForm = () => {
  const navigate = useNavigate();
  const { registerAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    adminSecret: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    setError('');
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim())
      errs.name = 'Full name is required';

    if (!formData.email.trim())
      errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errs.email = 'Enter a valid email';

    if (!formData.phone.trim())
      errs.phone = 'Phone number is required';

    if (!formData.password)
      errs.password = 'Password is required';
    else if (formData.password.length < 6)
      errs.password = 'Password must be at least 6 characters';

    if (!formData.confirmPassword)
      errs.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';

    if (!formData.adminSecret.trim())
      errs.adminSecret = 'Admin secret key is required';

    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await registerAdmin(formData);
      setSuccess('Admin account created! Redirecting...');
      setTimeout(() => navigate('/admin'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({
    label, name, type = 'text', placeholder, required, toggle, onToggle,
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <input
          type={toggle !== undefined ? (toggle ? 'text' : 'password') : type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full px-4 py-3 border rounded-lg text-sm outline-none transition-colors pr-${onToggle ? '10' : '4'} ${
            fieldErrors[name]
              ? 'border-red-400 bg-red-50'
              : 'border-gray-200 focus:border-red-400'
          }`}
        />
        {onToggle && (
          <button
            type="button"
            onClick={onToggle}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            {toggle ? '🙈' : '👁️'}
          </button>
        )}
      </div>
      {fieldErrors[name] && (
        <p className="text-red-500 text-xs mt-1">{fieldErrors[name]}</p>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-gray-900">Admin Registration</h3>
        <p className="text-gray-500 text-sm">
          Requires a secret key — contact your system administrator
        </p>
      </div>

      {/* Warning Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <span className="text-amber-500 text-xl">⚠️</span>
        <div>
          <p className="text-amber-800 font-semibold text-sm">Restricted Access</p>
          <p className="text-amber-700 text-xs mt-1">
            Admin accounts require a secret key. Only authorized personnel can create admin accounts.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-start gap-2">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      <InputField
        label="Full Name"
        name="name"
        placeholder="Admin Name"
        required
      />
      <InputField
        label="Email Address"
        name="email"
        type="email"
        placeholder="admin@ikaze.com"
        required
      />
      <InputField
        label="Phone Number"
        name="phone"
        type="tel"
        placeholder="+250 XXX XXX XXX"
        required
      />
      <InputField
        label="Password"
        name="password"
        placeholder="Min. 6 characters"
        required
        toggle={showPassword}
        onToggle={() => setShowPassword(!showPassword)}
      />
      <InputField
        label="Confirm Password"
        name="confirmPassword"
        placeholder="Repeat your password"
        required
        toggle={showConfirmPassword}
        onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
      />

      {/* Admin Secret */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Admin Secret Key <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2">🔑</span>
          <input
            type="password"
            name="adminSecret"
            value={formData.adminSecret}
            onChange={handleChange}
            placeholder="Enter admin secret key"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg text-sm outline-none transition-colors ${
              fieldErrors.adminSecret
                ? 'border-red-400 bg-red-50'
                : 'border-gray-200 focus:border-red-400'
            }`}
          />
        </div>
        {fieldErrors.adminSecret && (
          <p className="text-red-500 text-xs mt-1">{fieldErrors.adminSecret}</p>
        )}
        <p className="text-gray-400 text-xs mt-1">
          Contact your system administrator for the secret key
        </p>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Creating Admin Account...
          </>
        ) : (
          '🔐 Create Admin Account'
        )}
      </button>
    </form>
  );
};

// ─── Main Register Page ──────────────────────────────────────────────────────
const Register = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 transition-all ${
            isAdmin
              ? 'bg-gradient-to-br from-red-500 to-red-700'
              : 'bg-gradient-to-br from-teal-500 to-teal-700'
          }`}>
            <span className="text-white text-3xl font-bold">IK</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Account
          </h1>
          <p className="text-gray-500">
            {isAdmin
              ? 'Register as an Ikaze administrator'
              : 'Join Ikaze — Your Rwanda experience starts here'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              !isAdmin
                ? 'bg-white text-teal-600 shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            👤 Client Register
          </button>
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2.5 rounded-lg font-semibold text-sm transition-all ${
              isAdmin
                ? 'bg-white text-red-600 shadow-md'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            🔐 Admin Register
          </button>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {isAdmin ? <AdminRegisterForm /> : <ClientRegisterForm />}
        </div>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{' '}
          <Link to="/login" className={`font-semibold hover:underline ${
            isAdmin ? 'text-red-500' : 'text-teal-600'
          }`}>
            Sign in here
          </Link>
        </p>

        <p className="text-center text-xs text-gray-400 mt-3">
          By creating an account, you agree to our{' '}
          <a href="#" className="text-teal-500 hover:underline">Terms</a>
          {' '}and{' '}
          <a href="#" className="text-teal-500 hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Register;