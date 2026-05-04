// client/src/pages/Home.jsx

import React from 'react';
import Hero from '../components/home/Hero';
import ServiceCards from '../components/home/ServiceCards';
import HowItWorks from '../components/home/HowItWorks';
import Testimonials from '../components/home/Testimonials';
import CTASection from '../components/home/CTASection';

const Home = () => {
  return (
    <div>
      <Hero />
      <ServiceCards />
      <HowItWorks />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default Home;