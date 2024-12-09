import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ScrollButton, ThemeCard } from './ThemeComponents';
import { User, Scroll, LogOut } from 'lucide-react';

const Navbar = ({ user, onAddFriend, friendRequests }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="w-full mb-8">
      <ThemeCard variant="darker" className="p-0">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <Scroll className="h-8 w-8 text-[#8B4513]" />
              <h1 className="text-2xl font-bold font-serif text-[#8B4513] tracking-wide">
                The Adventurer's Tavern
              </h1>
            </div>

            {/* User Navigation */}
            <div className="flex items-center space-x-4">
              {user && (
                <>
                  {/* User Profile Link */}
                  <button 
                    onClick={() => navigate(`/profile/${user.username}`)}
                    className="flex items-center gap-2 text-[#8B4513] hover:text-[#654321] font-serif transition-all"
                  >
                    <User className="h-5 w-5" />
                    <span className="text-lg">Greetings, {user.username}! 🍺</span>
                  </button>

                  {/* Logout Button */}
                  <ScrollButton
                    onClick={handleLogout}
                    variant="secondary"
                    size="small"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Leave Tavern
                  </ScrollButton>
                </>
              )}
            </div>
          </div>
        </div>
      </ThemeCard>
    </nav>
  );
};

export default Navbar;
