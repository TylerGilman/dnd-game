import React from 'react';
import { SnowBank, SnowAccents} from './SnowEffects';
interface TavernSignProps {
  title: string;
}

export const TavernSign = ({ title }: TavernSignProps) => (
  <div className="text-center relative">
    <div className="relative inline-block max-w-md">
      {/* Wooden sign background */}
      <div className="absolute inset-0 bg-[#654321] rounded-lg transform rotate-3" />
      <div className="absolute inset-0 bg-[#8B4513] rounded-lg transform -rotate-2" />
      
      {/* Sign text */}
      <div className="relative bg-[#8B4513] p-6 rounded-lg transform -rotate-1 border-4 border-[#654321] shadow-xl">
        <h1 className="text-[#DEB887] font-serif text-4xl font-bold tracking-wider">
          {title}
        </h1>
        {/* Sign nails */}
        <div className="absolute top-2 left-4 w-2 h-2 rounded-full bg-[#DEB887]" />
        <div className="absolute top-2 right-4 w-2 h-2 rounded-full bg-[#DEB887]" />
        <div className="absolute bottom-2 left-4 w-2 h-2 rounded-full bg-[#DEB887]" />
        <div className="absolute bottom-2 right-4 w-2 h-2 rounded-full bg-[#DEB887]" />
      </div>

      {/* Chains holding the sign */}
      <div className="absolute -top-8 left-1/4 w-1 h-8 bg-gradient-to-b from-[#DEB887] to-[#8B4513]" />
      <div className="absolute -top-12 right-1/4 w-1 h-12 bg-gradient-to-b from-[#DEB887] to-[#8B4513]" />
    </div>
  </div>
);

interface NPCDialogProps {
  speaker?: string;
  children: React.ReactNode;
}

export const NPCDialog = ({ speaker = "UNKNOWN SLURRED VOICE", children }: NPCDialogProps) => (
  <div className="relative mb-8 z-10">
    {/* Speech arrow */}
    <div className="absolute -left-4 top-1/2 w-4 h-4 bg-[#2c1810] transform rotate-45 -translate-y-1/2" />
    
    {/* Dialog container */}
    <div className="bg-[#2c1810]/90 backdrop-blur-sm text-[#f4e4bc] p-6 rounded-lg font-serif relative border border-[#deb887]/30">
      {/* Speaker label */}
      <div className="absolute left-6 top-0 transform -translate-y-full">
        <div className="bg-[#2c1810] text-[#deb887] px-4 py-1 rounded-t-lg text-sm border-t border-x border-[#deb887]/30">
          {speaker}
        </div>
      </div>
      
      {/* Content with avatar */}
      <div className="flex gap-4 items-start">
        <div className="w-16 h-16 rounded-full bg-[#654321] flex-shrink-0 border-2 border-[#deb887]/50 overflow-hidden">
          <div className="w-full h-full bg-[#2c1810] opacity-50" />
        </div>
        <div className="flex-grow italic leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </div>
);

interface CabinDoorProps {
  children: React.ReactNode;
}

export const CabinDoor = ({ children }: CabinDoorProps) => (
  <div className="relative max-w-md mx-auto">
    {/* Door frame outer glow */}
    <div className="absolute -inset-4 bg-[#DEB887]/10 blur-lg rounded-lg" />
    
    {/* Door and frame */}
    <div className="relative bg-gradient-to-b from-[#8B4513] to-[#654321] p-8 rounded-lg">
      {/* Wood grain texture */}
      <div 
        className="absolute inset-0 opacity-10 mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='%23000000' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          backgroundSize: '100px 20px'
        }}
      />

      {/* Door frame details */}
      <div className="relative border-8 border-[#654321] rounded-lg shadow-[inset_0_0_100px_rgba(0,0,0,0.7)] bg-[#8B4513]">
        {/* Door hardware */}
        <div className="absolute -right-3 top-1/2 transform -translate-y-1/2 flex flex-col items-center gap-2">
          <div className="w-6 h-20 bg-[#654321] rounded-full shadow-inner" />
          <div className="w-4 h-4 bg-[#DEB887] rounded-full" />
        </div>

        {/* Door content */}
        <div className="relative p-6">
          {children}
        </div>

        {/* Wood planks */}
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

    {/* Snow accumulation */}
    <div className="absolute -top-2 left-0 right-0 h-4 bg-white/30 blur-sm rounded-full" />
  </div>
);

interface ForestBackgroundProps {
  children: React.ReactNode;
}

export const CabinStructure = ({ children }: { children: React.ReactNode }) => (
  <div className="relative mx-auto max-w-3xl">
    {/* Main cabin structure with solid walls */}
    <div className="relative p-8 bg-[#2c1810] rounded-lg shadow-2xl">
      {/* Wood texture background for walls */}
      <div 
        className="absolute inset-0 rounded-lg"
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

      {/* Roof */}
      <div className="absolute -top-20 -left-8 -right-8 h-32">
        <div className="absolute inset-0 bg-[#1a1209] transform skew-y-6">
          {/* Roof texture */}
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

      {/* Interior walls with solid background */}
      <div className="relative z-10 bg-[#241309] p-8 rounded-lg">
        {/* Wood grain texture for interior */}
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

        {/* Windows */}
        <div className="absolute left-4 top-4 w-16 h-24 bg-[#120d06] rounded-lg overflow-hidden">
          {/* Window frame */}
          <div className="absolute inset-2 grid grid-cols-2 gap-2 bg-[#0a0f18]/80 p-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-yellow-900/20 rounded-sm">
                <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" 
                     style={{ animationDelay: `${i * 0.5}s` }} />
              </div>
            ))}
          </div>
          {/* Window glow */}
          <div className="absolute inset-0 bg-yellow-900/10" />
        </div>

        <div className="absolute right-4 top-4 w-16 h-24 bg-[#120d06] rounded-lg overflow-hidden">
          <div className="absolute inset-2 grid grid-cols-2 gap-2 bg-[#0a0f18]/80 p-1">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-yellow-900/20 rounded-sm">
                <div className="absolute inset-0 bg-yellow-500/5 animate-pulse" 
                     style={{ animationDelay: `${i * 0.5}s` }} />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-yellow-900/10" />
        </div>

        {/* Door area */}
        <div className="relative z-20">
          {children}
        </div>
      </div>

      {/* Lanterns with glow effect */}
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
            {/* Lantern light glow */}
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
          style={{
            transform: `translateY(${i * 4}px)`
          }}
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
    {/* Forest background */}
    <div className="fixed inset-0 bg-gradient-to-b from-[#0a0f18] to-[#1a2633]" />
    
    {/* Stars */}
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

    {/* Simple white horizon */}
    <div className="fixed bottom-0 left-0 right-0 h-48 bg-white" />

    {/* Actual falling snow */}
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

    {/* Content */}
    <div className="relative z-10">
      {children}
    </div>
  </div>
);
