import React from 'react';
import { SnowBank, SnowAccents } from './SnowEffects';

interface TavernSignProps {
  title: string;
}

export const TavernSign = ({ title }: TavernSignProps) => (
  <div className="relative inline-block">
    {/* The sign background layers for a subtle rustic effect */}
    <div className="absolute inset-0 bg-[#654321] rounded-lg rotate-1" />
    <div className="absolute inset-0 bg-[#8B4513] rounded-lg -rotate-1" />
    <div className="relative bg-[#8B4513] p-6 rounded-lg border-4 border-[#654321] shadow-xl">
      <h1 className="text-[#DEB887] font-serif text-4xl font-bold tracking-wide">
        {title}
      </h1>
      {/* Nails on the sign */}
      <div className="absolute top-2 left-4 w-2 h-2 bg-[#DEB887] rounded-full" />
      <div className="absolute top-2 right-4 w-2 h-2 bg-[#DEB887] rounded-full" />
      <div className="absolute bottom-2 left-4 w-2 h-2 bg-[#DEB887] rounded-full" />
      <div className="absolute bottom-2 right-4 w-2 h-2 bg-[#DEB887] rounded-full" />
    </div>
    {/* Chains: left shorter, right longer to simulate a slant */}
    <div className="absolute -top-6 left-1/4 w-1 h-6 bg-gradient-to-b from-[#DEB887] to-[#8B4513]" />
    <div className="absolute -top-10 right-1/4 w-1 h-10 bg-gradient-to-b from-[#DEB887] to-[#8B4513]" />
  </div>
);

interface CabinDoorProps {
  children: React.ReactNode;
}

export const CabinDoor = ({ children }: CabinDoorProps) => (
  <div className="relative max-w-md mx-auto">
    {/* Outer glow for the door frame */}
    <div className="absolute -inset-4 bg-[#DEB887]/10 blur-lg rounded-lg" />

    <div className="relative bg-gradient-to-b from-[#8B4513] to-[#654321] p-8 rounded-lg">
      {/* Subtle wood grain overlay */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg ... %3E%3C/svg%3E")`,
          backgroundSize: '100px 20px'
        }}
      />
      <div className="relative border-8 border-[#654321] rounded-lg shadow-[inset_0_0_100px_rgba(0,0,0,0.7)] bg-[#8B4513]">
        {/* Door handle/hardware */}
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2">
          <div className="w-6 h-20 bg-[#654321] rounded-full shadow-inner" />
          <div className="w-4 h-4 bg-[#DEB887] rounded-full" />
        </div>

        <div className="relative p-6">
          {children}
        </div>

        {/* Horizontal planks */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-full h-px bg-black/10"
              style={{ top: `${(i + 1) * 25}%` }}
            />
          ))}
        </div>
      </div>
    </div>

    {/* Snow accumulation on top of door */}
    <div className="absolute -top-2 left-0 right-0 h-4 bg-white/30 blur-sm rounded-full" />
  </div>
);

export const CabinStructure = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto max-w-3xl">
    <div className="relative p-8 bg-[#2c1810] rounded-lg shadow-2xl overflow-visible">
      <div className="absolute -top-20 -left-8 -right-8 h-32 z-20">
        <div className="absolute inset-0 bg-[#1a1209] transform skew-y-6">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `
                repeating-linear-gradient(
                  45deg,
                  #120d06 0px,
                  #120d06 10px,
                  #1a1209 10px,
                  #1a1209 20px
                )
              `,
              opacity: 0.8
            }}
          />
          {/* Snow on roof */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-white/20 blur-sm" />
        </div>
      </div>
      <div 
        className="absolute inset-0 rounded-lg z-10"
        style={{
          backgroundColor: '#2c1810',
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              #241309 0px,
              #241309 20px,
              #2c1810 20px,
              #2c1810 40px
            )
          `,
          opacity: 0.9
        }}
      />

      <div className="relative z-10 bg-[#241309] p-8 rounded-lg overflow-visible min-h-[600px]">
        <div 
          className="absolute inset-0 rounded-lg mix-blend-overlay"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                90deg,
                #1a0d06 0px,
                #1a0d06 2px,
                transparent 2px,
                transparent 30px
              )
            `
          }}
        />

        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 z-40">
          <TavernSign title="The Adventurer's Tavern" />
        </div>

        <div className="relative z-20 mt-40">
          {children}
        </div>

        {/* Windows */}
        <div className="absolute left-4 top-4 w-16 h-24 bg-[#120d06] rounded-lg overflow-hidden">
          <div className="absolute inset-2 grid grid-cols-2 gap-2 bg-[#0a0f18]/80 p-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-yellow-900/20 rounded-sm relative">
                <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" 
                     style={{ animationDelay: `${i * 0.5}s` }} />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-yellow-900/10" />
        </div>

        <div className="absolute right-4 top-4 w-16 h-24 bg-[#120d06] rounded-lg overflow-hidden">
          <div className="absolute inset-2 grid grid-cols-2 gap-2 bg-[#0a0f18]/80 p-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-yellow-900/20 rounded-sm relative">
                <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" 
                     style={{ animationDelay: `${i * 0.5}s` }} />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-yellow-900/10" />
        </div>
      </div>

      {/* Lanterns */}
      {[-1, 1].map((x) => (
        <div 
          key={x} 
          className="absolute top-0 transform -translate-y-1/2"
          style={{ left: x === -1 ? '2rem' : 'auto', right: x === 1 ? '2rem' : 'auto' }}
        >
          <div className="relative w-6 h-8 bg-[#462b1a]">
            <div className="absolute inset-1 bg-yellow-500/20 animate-pulse">
              <div className="absolute inset-0 bg-gradient-to-t from-yellow-500/20 to-transparent" />
            </div>
            <div className="absolute -inset-4 bg-yellow-500/10 blur-xl rounded-full" />
          </div>
        </div>
      ))}
    </div>

    {/* Porch steps */}
    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-xs">
      {[0, 1, 2].map((i) => (
        <div 
          key={i}
          className="w-full h-4 bg-[#1a1209] rounded mb-1"
          style={{ transform: `translateY(${i * 4}px)` }}
        >
          <div className="absolute inset-0 bg-white/5" />
        </div>
      ))}
      <SnowAccents />
    </div>
    <SnowBank />
  </div>
);

export const ForestBackground = ({ children }: { children: React.ReactNode }) => (
  <div className="relative min-h-screen bg-[#0a0f18]">
    <div className="fixed inset-0 bg-gradient-to-b from-[#0a0f18] to-[#1a2633]" />
    <div className="fixed inset-0">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            top: `${Math.random() * 70}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.5 + 0.3
          }}
        />
      ))}
    </div>
    <div className="fixed bottom-0 left-0 right-0 h-48 bg-white" />
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className={`
            absolute -top-4
            text-white text-opacity-80
            will-change-transform
            animate-fall-${i % 3 ? 'slow' : i % 2 ? 'slower' : 'normal'}
          `}
          style={{
            left: `${Math.random() * 100}%`,
            fontSize: `${Math.random() * 14 + 10}px`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        >
          ❄
        </div>
      ))}
    </div>
    <div className="relative z-10">
      {children}
    </div>
  </div>
);
