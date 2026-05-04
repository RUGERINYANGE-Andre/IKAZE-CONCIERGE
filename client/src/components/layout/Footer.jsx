// client/src/components/layout/Footer.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-darkNavy text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">IK</span>
              </div>
              <div>
                <h3 className="font-display text-xl font-bold">Ikaze Concierge</h3>
                <p className="text-sm text-neutral-gray">Professional Planner. Warmly Rwandan.</p>
              </div>
            </div>
            <p className="text-neutral-gray max-w-md">
              Making your Rwanda visit seamless, meaningful, and unforgettable. 
              From planning to memories, we handle everything.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-neutral-gray hover:text-primary-tealLight transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-neutral-gray hover:text-primary-tealLight transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-neutral-gray hover:text-primary-tealLight transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-neutral-gray hover:text-primary-tealLight transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Get in Touch</h4>
            <ul className="space-y-2 text-neutral-gray">
              <li className="flex items-center space-x-2">
                <span>📧</span>
                <a href="mailto:ikazeconceirge@gmail.com" className="hover:text-primary-tealLight transition-colors">
                  ikazeconceirge@gmail.com
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>📱</span>
                <a href="https://wa.me/250789765744" className="hover:text-primary-tealLight transition-colors">
                  +250789765744
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <span>📍</span>
                <span>Kigali, Rwanda</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-navy mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-gray text-sm">
            © {currentYear} Ikaze Concierge & Logistics. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-neutral-gray hover:text-primary-tealLight transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-neutral-gray hover:text-primary-tealLight transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;