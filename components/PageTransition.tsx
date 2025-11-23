import React, { ReactNode, useEffect, useState } from 'react';

interface PageTransitionProps {
  children: ReactNode;
  transitionKey: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, transitionKey }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Fade out
    setIsVisible(false);
    
    // Fade in after a brief delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, [transitionKey]);

  return (
    <div
      className={`
        transition-all duration-300 ease-out h-full
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}
      `}
    >
      {children}
    </div>
  );
};
