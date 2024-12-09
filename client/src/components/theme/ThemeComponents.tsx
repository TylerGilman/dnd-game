import React from 'react';
import { useTheme } from './ThemeContext';

// Heading Component
const Heading = ({ 
  children,
  level = 1,
  className = "" 
}: { 
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}) => {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const baseStyles = "font-serif font-bold text-[#8B4513] relative inline-flex items-center gap-3";
  const sizeStyles = {
    1: "text-4xl mb-6",
    2: "text-3xl mb-4",
    3: "text-2xl mb-3",
    4: "text-xl mb-2",
    5: "text-lg mb-2",
    6: "text-base mb-2"
  };

  return (
    <Tag className={`${baseStyles} ${sizeStyles[level]} ${className}`}>
      {level <= 2 && <span className="text-2xl">📜</span>}
      {children}
      {level <= 2 && <span className="text-2xl">📜</span>}
    </Tag>
  );
};

// Corner Component
const Corner = () => {
  return (
    <svg viewBox="0 0 32 32" className="w-8 h-8 absolute">
      <path
        d="M2 2 L30 2 L30 6 L6 6 L6 30 L2 30 Z"
        fill="#8B4513"
        stroke="#5C2C0C"
        strokeWidth="1"
      />
      <circle cx="16" cy="16" r="4" fill="#DEB887" />
    </svg>
  );
};

// ThemeCard Component
const ThemeCard = ({ 
  children, 
  className = "", 
  variant = "default" 
}: { 
  children: React.ReactNode; 
  className?: string;
  variant?: "default" | "darker" | "lighter";
}) => {
  const baseStyles = "relative border-4 shadow-[8px_8px_0_#000] transition-all";
  const variantStyles = {
    default: "bg-[#f4e4bc] border-[#8B4513]",
    darker: "bg-[#deb887] border-[#654321]",
    lighter: "bg-[#fff8dc] border-[#8B4513]"
  };

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      <Corner />
      <div className="rotate-90 absolute top-0 right-0">
        <Corner />
      </div>
      <div className="rotate-180 absolute bottom-0 right-0">
        <Corner />
      </div>
      <div className="-rotate-90 absolute bottom-0 left-0">
        <Corner />
      </div>
      
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

// ScrollButton Component
const ScrollButton = ({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  size = "default",
  className = "",
  type = "button"
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "default" | "large";
  className?: string;
  type?: "button" | "submit" | "reset";
}) => {
  const baseStyles = "relative font-serif font-bold transition-all transform hover:-translate-y-1 disabled:opacity-50 disabled:hover:transform-none";
  
  const variantStyles = {
    primary: "bg-[#8B4513] text-[#f4e4bc] hover:bg-[#654321] border-2 border-[#f4e4bc]",
    secondary: "bg-[#deb887] text-[#8B4513] hover:bg-[#c8a276] border-2 border-[#8B4513]",
    danger: "bg-red-700 text-[#f4e4bc] hover:bg-red-800 border-2 border-[#f4e4bc]"
  };
  
  const sizeStyles = {
    small: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    large: "px-8 py-4 text-lg"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type={type}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
        rounded-lg shadow-[4px_4px_0_#000]
        hover:shadow-[2px_2px_0_#000]
      `}
    >
      {children}
    </button>
  );
};

// Divider Component
const Divider = () => (
  <div className="relative h-4 my-6">
    <div className="absolute inset-0 flex items-center">
      <div className="w-full border-t-2 border-[#8B4513]" />
    </div>
    <div className="absolute inset-0 flex justify-center items-center">
      <div className="bg-[#f4e4bc] px-4 text-[#8B4513]">⚔️</div>
    </div>
  </div>
);

// PageBackground Component
const PageBackground = ({ children }: { children: React.ReactNode }) => (
  <div 
    className="min-h-screen bg-[#2c1810] bg-opacity-90 p-8"
    style={{
      backgroundImage: `
        radial-gradient(circle at 25px 25px, rgba(255,255,255,0.2) 2%, transparent 0%),
        radial-gradient(circle at 75px 75px, rgba(255,255,255,0.2) 2%, transparent 0%)
      `,
      backgroundSize: '100px 100px'
    }}
  >
    {children}
  </div>
);

export { ThemeCard, ScrollButton, Divider, PageBackground, Heading };
