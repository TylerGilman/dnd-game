import React, { createContext, useContext, useState } from 'react';

type Season = 'default' | 'winter' | 'spring' | 'summer' | 'autumn';

interface ThemeContextType {
  currentSeason: Season;
  toggleSeason: (season: Season) => void;
  seasonalEmoji: Record<string, string>;
  seasonalColors: Record<string, string>;
}

const defaultEmoji = {
  primary: '📜',
  secondary: '⚔️',
  action: '🍺',
  success: '✨',
  error: '💀'
};

const winterEmoji = {
  primary: '❄️',
  secondary: '⭐',
  action: '🌟',
  success: '✨',
  error: '🌙'
};

const seasonalColors = {
  default: {
    primary: '#8B4513',
    secondary: '#DEB887',
    background: '#2c1810',
    card: '#f4e4bc',
    cardDark: '#deb887',
    accent: '#654321'
  },
  winter: {
    primary: '#2C3E50',    // Deep winter blue
    secondary: '#E8B999',  // Warm gold
    background: '#1B3244', // Night sky
    card: '#F5F5F5',      // Snow white
    cardDark: '#E5E5E5',  // Light gray
    accent: '#D4AF37'     // Metallic gold
  }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  // Default to winter during winter months (November through February)
  const currentMonth = new Date().getMonth();
  const isWinterMonth = currentMonth >= 10 || currentMonth <= 1;
  const [currentSeason, setCurrentSeason] = useState<Season>(isWinterMonth ? 'winter' : 'default');

  const toggleSeason = (season: Season) => {
    setCurrentSeason(season);
  };

  const seasonalEmoji = currentSeason === 'winter' ? winterEmoji : defaultEmoji;

  return (
    <ThemeContext.Provider 
      value={{ 
        currentSeason, 
        toggleSeason,
        seasonalEmoji,
        seasonalColors: seasonalColors[currentSeason] 
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
