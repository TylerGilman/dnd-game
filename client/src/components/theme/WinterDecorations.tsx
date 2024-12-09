import React from 'react';

export const FrostedCard = ({ children }: { children: React.ReactNode }) => (
  <div className="relative overflow-hidden">
    <div 
      className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none"
      style={{
        backdropFilter: 'blur(40px)',
        WebkitBackdropFilter: 'blur(40px)'
      }}
    />
    {children}
  </div>
);

export const IciclesBorder = () => (
  <div className="absolute top-0 left-0 right-0 h-4 overflow-hidden">
    {[...Array(20)].map((_, i) => (
      <div
        key={i}
        className="absolute top-0 bg-white/30"
        style={{
          left: `${i * 5}%`,
          width: '2px',
          height: `${Math.random() * 16 + 8}px`,
          filter: 'blur(1px)'
        }}
      />
    ))}
  </div>
);
