// client/src/pages/Login.jsx

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const credentials = isAdmin 
        ? { email: formData.email, password: formData.password }
        : { email: formData.email, phone: formData.phone };

      await login(credentials, isAdmin);
      navigate(isAdmin ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  return (
    <div className="min-h-screen bg-neutral-offWhite flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-3xl font-bold">IK</span>
          </div>
          <h1 className="text-3xl font-display font-bold text-neutral-darkNavy mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-gray">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Type Toggle */}
        <div className="flex mb-6 bg-neutral-lightGray rounded-lg p-1">
          <button
            onClick={() => setIsAdmin(false)}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              !isAdmin 
                ? 'bg-white text-primary-teal shadow-md' 
                : 'text-neutral-gray hover:text-neutral-darkNavy'
            }`}
          >
            Client Login
          </button>
          <button
            onClick={() => setIsAdmin(true)}
            className={`flex-1 py-2 rounded-md font-medium transition-all ${
              isAdmin 
                ? 'bg-white text-primary-teal shadow-md' 
                : 'text-neutral-gray hover:text-neutral-darkNavy'
            }`}
          >
            Admin Login
          </button>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              icon={<span>📧</span>}
              placeholder="your@email.com"
            />

            {isAdmin ? (
              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                icon={<span>🔒</span>}
                placeholder="Enter your password"
              />
            ) : (
              <Input
                label="Phone Number"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
                icon={<span>📱</span>}
                placeholder="+250 XXX XXX XXX"
              />
            )}

            <Button 
              type="submit" 
              className="w-full"
              loading={loading}
            >
              {isAdmin ? 'Login as Admin' : 'Login as Client'}
            </Button>
          </form>
{/* Replace the existing bottom link in Login.jsx */}
{!isAdmin && (
  <div className="mt-6 text-center space-y-2">
    <p className="text-gray-500 text-sm">
      Don't have an account?{' '}
      <Link to="/register" className="text-teal-600 font-semibold hover:underline">
        Register here →
      </Link>
    </p>
  </div>
)}
        </Card>

        <p className="text-center text-sm text-neutral-gray mt-6">
          By signing in, you agree to our{' '}
          <a href="#" className="text-primary-teal hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="#" className="text-primary-teal hover:underline">Privacy Policy</a>
        </p>
      </div>
    </div>
  );
};

export default Login;