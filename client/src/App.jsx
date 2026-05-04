// client/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';

// Layout
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import FloatingWhatsApp from './components/layout/FloatingWhatsApp';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import Booking from './pages/Booking';
import ClientDashboard from './pages/ClientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Register from './pages/Register';
// Protected Route
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    // ✅ Router is outermost so ALL children can use navigation hooks
    <Router>
      <AuthProvider>
        <BookingProvider>
          <div className="flex flex-col min-h-screen bg-neutral-offWhite">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/services" element={<Services />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <ClientDashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin/*"
                  element={
                    <ProtectedRoute adminOnly>
                      <AdminDashboard />
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </main>
            <Footer />
            <FloatingWhatsApp />
          </div>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;