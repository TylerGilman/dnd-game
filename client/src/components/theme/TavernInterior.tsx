import React from 'react';

export const TavernInterior = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative bg-dark-wood">
      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
};
