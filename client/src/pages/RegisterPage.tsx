import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { api } from '../services/api';
import { UserPlus, Mail, KeyRound, Scroll, User } from 'lucide-react';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const { showNotification } = useNotification();

  const mutation = useMutation({
    mutationFn: (data: Omit<RegisterFormData, 'confirmPassword'>) => 
      api.register(data.username, data.email, data.password),
    onSuccess: (data) => {
      login(data.user, data.token);
      showNotification('🎉 Your name has been added to the guild roster!', 'success');
      navigate('/dashboard');
    },
    onError: (error: Error) => {
      showNotification('⚔️ ' + error.message, 'error');
    }
  });

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) {
      newErrors.username = 'Every hero needs a name!';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Your name must be at least 3 characters long';
    }
    
    if (!formData.email) {
      newErrors.email = 'We need a magical scroll to contact you';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'This magical scroll address seems invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Choose your secret passphrase';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Your passphrase must be at least 6 characters long';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm your secret passphrase';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Your passphrases do not match!';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const { confirmPassword, ...registrationData } = formData;
      mutation.mutate(registrationData);
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
        <UserPlus className="mx-auto h-12 w-12 text-[#deb887]" />
        <h2 className="mt-4 text-center text-3xl font-bold font-serif text-[#deb887]">
          Join the Adventurer's Guild
        </h2>
        <p className="mt-2 text-center text-[#f4e4bc] font-serif">
          Already a member?{' '}
          <Link to="/login" className="font-medium text-[#deb887] hover:text-[#f4e4bc] underline">
            Return to the tavern
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg shadow-[8px_8px_0_#000] px-6 py-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-lg font-serif font-bold text-[#8B4513]">
                Hero's Name
              </label>
              <div className="mt-1 relative">
                <User className="absolute left-3 top-2.5 h-5 w-5 text-[#8B4513]" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleChange}
                  className={`pl-10 w-full bg-[#deb887] border-2 ${
                    errors.username ? 'border-red-700' : 'border-[#8B4513]'
                  } rounded-lg text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] p-2 text-lg`}
                  placeholder="What shall we call you?"
                />
                {errors.username && (
                  <p className="mt-2 text-sm text-red-700 font-medium">{errors.username}</p>
                )}
              </div>
            </div>

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
                  placeholder="For guild communications"
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
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 w-full bg-[#deb887] border-2 ${
                    errors.password ? 'border-red-700' : 'border-[#8B4513]'
                  } rounded-lg text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] p-2 text-lg`}
                  placeholder="Choose wisely"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-700 font-medium">{errors.password}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-lg font-serif font-bold text-[#8B4513]">
                Confirm Passphrase
              </label>
              <div className="mt-1 relative">
                <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-[#8B4513]" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 w-full bg-[#deb887] border-2 ${
                    errors.confirmPassword ? 'border-red-700' : 'border-[#8B4513]'
                  } rounded-lg text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] p-2 text-lg`}
                  placeholder="Speak it once more"
                />
                {errors.confirmPassword && (
                  <p className="mt-2 text-sm text-red-700 font-medium">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={mutation.isPending}
                className="w-full bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-bold px-4 py-3 rounded-lg shadow-[4px_4px_0_#000] border-2 border-[#f4e4bc] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0_#000] disabled:opacity-50"
              >
                {mutation.isPending ? '🎲 Enrolling...' : '⚔️ Join the Guild'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
