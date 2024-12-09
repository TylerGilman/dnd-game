import React from 'react';

export const Snowfall = () => {
  const baseStyle = `
    @keyframes snowfall {
      0% {
        transform: translateY(-10vh) translateX(0);
        opacity: 0;
      }
      10% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) translateX(var(--drift));
        opacity: 0;
      }
    }
  `;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <style>
        {baseStyle}
      </style>
      {[...Array(30)].map((_, i) => {
        const duration = 7 + Math.random() * 7;
        const drift = -20 + Math.random() * 40;
        
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: '-20px',
              color: 'white',
              opacity: 0,
              fontSize: `${Math.random() * 14 + 10}px`,
              animation: `snowfall ${duration}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              '--drift': `${drift}px`,
            } as React.CSSProperties}
          >
            ❄
          </div>
        );
      })}
    </div>
  );
};

export const SnowHorizon = () => (
  <div className="fixed bottom-0 left-0 right-0 h-48 bg-white" />
);

// Snow bank at base of cabin
export const SnowBank = () => (
  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[120%]">
    {/* Main snow bank */}
    <div className="relative">
      <div 
        className="h-24 bg-white/90 rounded-full blur-sm"
        style={{
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
          transform: 'scaleY(0.7)',
        }}
      />
      
      {/* Snow detail layers */}
      <div className="absolute inset-0">
        <div className="h-full bg-gradient-to-b from-white/20 to-transparent" />
      </div>
      
      {/* Snow drifts */}
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="absolute top-0 h-16 w-32 bg-white/80 rounded-full blur-sm"
          style={{
            left: `${i * 25}%`,
            transform: `translateY(${Math.sin(i) * 10}px) scale(${0.8 + Math.random() * 0.4})`,
            opacity: 0.7 + Math.random() * 0.3
          }}
        />
      ))}
    </div>

    {/* Small snow piles against cabin */}
    <div className="absolute -top-8 inset-x-8 flex justify-between">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="w-24 h-16 bg-white/90 rounded-full blur-sm"
          style={{
            transform: `scale(${0.8 + Math.random() * 0.4}) translateY(${Math.random() * 8}px)`
          }}
        />
      ))}
    </div>
  </div>
);

// Snow gathered on windowsills and roof edges
export const SnowAccents = () => (
  <>
    {/* Roof snow */}
    <div className="absolute -top-2 inset-x-0 h-4 bg-white/90 rounded-full blur-[1px] transform -translate-y-1/2" />
    
    {/* Window ledge snow */}
    <div className="absolute top-24 left-4 w-16 h-2 bg-white/80 rounded-full blur-[1px]" />
    <div className="absolute top-24 right-4 w-16 h-2 bg-white/80 rounded-full blur-[1px]" />
    
    {/* Random snow accents */}
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute w-2 h-2 bg-white/60 rounded-full blur-[1px]"
        style={{
          top: `${20 + Math.random() * 60}%`,
          left: `${Math.random() * 100}%`,
          transform: `scale(${0.5 + Math.random() * 0.5})`
        }}
      />
    ))}
  </>
);
