import React from 'react';

interface NPCDialogProps {
  speaker?: string;
  icon?: string;
  children: React.ReactNode;
}

export const NPCDialog = ({ speaker = "Unknown", icon, children }: NPCDialogProps) => (
  <div className="relative mb-8">
    {/* Arrow: a square div rotated 45deg */}
    <div className="absolute left-[-1rem] top-1/2 w-4 h-4 bg-[#f4e4bc] border-2 border-[#8B4513] transform rotate-45 -translate-y-1/2"></div>

    <div className="relative bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg p-4 text-[#2c1810] font-serif">

      {/* Speaker label */}
      {speaker && (
        <div className="absolute top-0 left-6 transform -translate-y-1/2 bg-[#f4e4bc] border-2 border-[#8B4513] px-2 py-0.5 text-sm font-bold text-[#2c1810] rounded-b-md">
          {speaker}
        </div>
      )}

      {/* Decorative corners as absolutely positioned images */}
      <img src="/corner-ornament.png" alt="" className="w-4 h-4 absolute top-[-8px] left-[-8px]" />
      <img src="/corner-ornament.png" alt="" className="w-4 h-4 absolute top-[-8px] right-[-8px] rotate-90" />
      <img src="/corner-ornament.png" alt="" className="w-4 h-4 absolute bottom-[-8px] right-[-8px] rotate-180" />
      <img src="/corner-ornament.png" alt="" className="w-4 h-4 absolute bottom-[-8px] left-[-8px] rotate-270" />

      <div className="flex items-start gap-3 mt-2">
        {icon && (
          <div className="w-12 h-12 bg-[#deb887] border-2 border-[#8B4513] rounded-full overflow-hidden flex items-center justify-center">
            <img src={icon} alt={`${speaker} face`} className="w-full h-full object-cover" />
          </div>
        )}
        <div className="leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </div>
);
