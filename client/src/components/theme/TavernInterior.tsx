import React from 'react';

export const TavernInterior = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen relative bg-dark-wood">
      {/* Candle with flicker animation */}
      <div
        className="absolute top-4 right-4 text-3xl select-none animate-candleFlicker"
        style={{ filter: 'drop-shadow(0 0 5px #ffd700)' }}
      >
        🕯
      </div>

      <div className="relative z-10 p-8">
        {children}
      </div>
    </div>
  );
};
