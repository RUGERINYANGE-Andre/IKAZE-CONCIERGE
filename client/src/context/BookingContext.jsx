// client/src/context/BookingContext.jsx

import React, { createContext, useState, useContext } from 'react';

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    service: null,
    clientData: {},
    visitDetails: {},
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateBookingData = (data) => {
    setBookingData(prev => ({ ...prev, ...data }));
  };

  const resetBooking = () => {
    setBookingData({
      service: null,
      clientData: {},
      visitDetails: {},
    });
    setCurrentStep(1);
  };

  const value = {
    bookingData,
    currentStep,
    updateBookingData,
    setCurrentStep,
    resetBooking,
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// ✅ ADD THIS (no logic change, just helper hook)
export const useBooking = () => {
  return useContext(BookingContext);
};