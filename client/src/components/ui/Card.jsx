// client/src/components/ui/Card.jsx

import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  hover = true,
  padding = true,
  ...props 
}) => {
  return (
    <div 
      className={`
        bg-white rounded-xl shadow-md 
        ${hover ? 'hover:shadow-xl transition-shadow duration-300' : ''}
        ${padding ? 'p-6' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;