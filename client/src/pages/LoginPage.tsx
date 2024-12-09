import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { Mail, KeyRound } from 'lucide-react';
import { ScrollButton } from '../components/theme/ThemeComponents';
import { 
  TavernSign, 
  NPCDialog, 
  CabinDoor,
  CabinStructure, 
  ForestBackground 
} from '../components/theme/CabinExterior';

// Snowflake component with different shapes and sizes
const Snowfall = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden">
    {[...Array(50)].map((_, i) => {
      const size = Math.random() * 4 + 2;
      const startX = Math.random() * 100;
      const startDelay = Math.random() * 5;
      const duration = Math.random() * 5 + 10;
      const shape = ['❄', '❅', '❆', '✧'][Math.floor(Math.random() * 4)];

      return (
        <div
          key={i}
          className={`
            absolute -top-4 text-white text-opacity-80
            animate-float-${i % 3 ? i % 2 ? 'slow' : 'slower' : ''}
          `}
          style={{
            left: `${startX}%`,
            fontSize: `${size}px`,
            animationDelay: `${startDelay}s`,
            animationDuration: `${duration}s`,
            textShadow: '0 0 3px rgba(255,255,255,0.3)'
          }}
        >
          {shape}
        </div>
      );
    })}
  </div>
);

// Login form with glowing effects
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login } = useAuth();
  const { showNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      try {
        const response = await api.login(data.email, data.password);
        return response;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      login(data.user, data.token);
      showNotification('🔥 The hearth welcomes you back, traveler!', 'success');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      showNotification('❄️ ' + (error.message || 'The door remains frozen shut...'), 'error');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const inputClasses = `
    pl-10 w-full 
    bg-[#deb887]/90 
    border-2 border-[#8B4513] 
    rounded-lg text-[#2c1810] 
    placeholder-[#8B4513]/60 
    focus:ring-2 focus:ring-[#8B4513] 
    p-3 text-lg
    transition-all duration-300
    backdrop-blur-sm
    hover:bg-[#e5c9a2]/90
    focus:bg-[#e5c9a2]
  `;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 relative">
      {/* Warm glow effect behind the form */}
      <div className="absolute inset-0 bg-yellow-900/20 blur-xl rounded-lg" />
      
      <div className="relative">
        <label className="block text-lg font-serif font-bold text-[#f4e4bc] mb-2 text-shadow-fire">
          Magical Contact Scroll
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-[#8B4513]" />
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className={inputClasses}
            placeholder="Whisper your magical address..."
          />
        </div>
      </div>

      <div className="relative">
        <label className="block text-lg font-serif font-bold text-[#f4e4bc] mb-2 text-shadow-fire">
          Secret Passphrase
        </label>
        <div className="relative group">
          <KeyRound className="absolute left-3 top-3.5 h-5 w-5 text-[#8B4513]" />
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
            className={inputClasses}
            placeholder="Speak friend and enter..."
          />
        </div>
      </div>

      <div className="pt-4">
        <ScrollButton
          type="submit"
          variant="primary"
          size="large"
          className="w-full relative overflow-hidden group"
          disabled={mutation.isPending}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-900/0 via-yellow-900/20 to-yellow-900/0 group-hover:translate-x-full transition-transform duration-1000" />
          {mutation.isPending ? (
            <div className="flex items-center justify-center">
              <span className="animate-spin mr-2">🔥</span>
              Stoking the fire...
            </div>
          ) : (
            <span className="flex items-center justify-center">
              Enter the Warm Tavern ✨
            </span>
          )}
        </ScrollButton>
      </div>
    </form>
  );
};

export const LoginPage = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <ForestBackground>
      <Snowfall />
      <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-3xl space-y-8">
          <TavernSign title="The Adventurer's Tavern" />

          <NPCDialog>
            *A warm, friendly voice calls through the door*
            <br /><br />
            "Ah, is that a familiar face I see through this winter storm? 
            Come now, remind an old friend of your credentials, and we'll have you 
            by the fire with a warm mead in no time!"
          </NPCDialog>

          <CabinStructure>
            <CabinDoor>
              <LoginForm />
            </CabinDoor>
          </CabinStructure>

          <p className="text-center text-[#DEB887] font-serif mt-4">
            New to these parts?{' '}
            <Link 
              to="/register" 
              className="font-medium hover:text-[#E8B999] underline transition-colors duration-300"
            >
              *Join our merry band of adventurers*
            </Link>
          </p>

          {/* Light beams from windows */}
          <div className="absolute left-1/4 top-1/2 w-32 h-64 bg-yellow-900/10 blur-3xl -rotate-45 animate-pulse" />
          <div className="absolute right-1/4 top-1/2 w-32 h-64 bg-yellow-900/10 blur-3xl rotate-45 animate-pulse" />
        </div>
      </div>
    </ForestBackground>
  );
};

export default LoginPage;
