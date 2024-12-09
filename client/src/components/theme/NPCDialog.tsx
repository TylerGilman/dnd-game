import React from 'react';

interface NPCDialogProps {
  speaker?: string;
  icon?: string;
  children: React.ReactNode;
}

export const NPCDialog = ({ speaker = "Unknown", icon, children }: NPCDialogProps) => (
  <div className="relative mb-8 z-50"> 
    {/* Move the arrow inside the box and adjust spacing so it doesn't overlap */}
    <div className="relative bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg p-4 text-[#2c1810] font-serif">
      {speaker && (
        <div className="absolute top-0 left-6 transform -translate-y-1/2 bg-[#f4e4bc] border-2 border-[#8B4513] px-2 py-0.5 text-sm font-bold text-[#2c1810] rounded-b-md z-10">
          {speaker}
        </div>
      )}

      {/* Instead of having the arrow absolute outside the dialog, place it inside on the left */}
      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 bg-[#f4e4bc] border-2 border-[#8B4513] rotate-45"></div>
      
      <div className="flex items-start gap-3 mt-4">
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
