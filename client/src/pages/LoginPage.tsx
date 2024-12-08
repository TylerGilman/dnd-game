import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { KeyRound, Mail, Scroll } from 'lucide-react';

export const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login, user } = useAuth();
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
      showNotification('🍺 Welcome back to the tavern!', 'success');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      console.error('Login mutation error:', error);
      showNotification('🚫 ' + (error.message || 'The tavern keeper does not recognize you'), 'error');
    }
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) {
      newErrors.email = 'Your magical contact scroll is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'This magical scroll address seems invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Your secret passphrase is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-[#2c1810] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Scroll className="mx-auto h-12 w-12 text-[#deb887]" />
        <h2 className="mt-4 text-center text-3xl font-bold font-serif text-[#deb887]">
          Welcome to the Tavern
        </h2>
        <p className="mt-2 text-center text-[#f4e4bc] font-serif">
          New adventurer?{' '}
          <Link to="/register" className="font-medium text-[#deb887] hover:text-[#f4e4bc] underline">
            Join the guild
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg shadow-[8px_8px_0_#000] px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-lg font-serif font-bold text-[#8B4513]">
                Magical Contact Scroll
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-[#8B4513]" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 w-full bg-[#deb887] border-2 ${
                    errors.email ? 'border-red-700' : 'border-[#8B4513]'
                  } rounded-lg text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] p-2 text-lg`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-700 font-medium">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-lg font-serif font-bold text-[#8B4513]">
                Secret Passphrase
              </label>
              <div className="mt-1 relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-[#8B4513]" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 w-full bg-[#deb887] border-2 ${
                    errors.password ? 'border-red-700' : 'border-[#8B4513]'
                  } rounded-lg text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] p-2 text-lg`}
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-700 font-medium">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-bold px-4 py-3 rounded-lg shadow-[4px_4px_0_#000] border-2 border-[#f4e4bc] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#000] disabled:opacity-50"
              >
                {mutation.isPending ? '🎲 Rolling for entry...' : '🍺 Enter the Tavern'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
