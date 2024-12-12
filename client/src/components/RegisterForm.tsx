import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { UserPlus, Mail, KeyRound, User } from 'lucide-react';
import { ScrollButton } from './theme/ThemeComponents';

interface RegisterFormProps {
  onSuccess: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  adminPassphrase: string;
}

// Styled input component
const FormInput = ({ 
  label, 
  icon: Icon, 
  error, 
  ...props 
}: { 
  label: string; 
  icon: typeof User; 
  error?: string; 
} & React.InputHTMLAttributes<HTMLInputElement>) => (
  <div>
    <label 
      htmlFor={props.id} 
      className="block text-lg font-serif font-bold text-[#deb887]"
    >
      {label}
    </label>
    <div className="mt-1 relative">
      <Icon className="absolute left-3 top-2.5 h-5 w-5 text-[#8B4513]" />
      <input
        {...props}
        className={`
          pl-10 w-full 
          bg-[#f4e4bc] 
          border-2 ${error ? 'border-red-700' : 'border-[#8B4513]'}
          rounded-lg text-[#2c1810] 
          placeholder-[#8B4513]/60 
          focus:ring-2 focus:ring-[#8B4513] 
          p-2 text-lg transition-all duration-300
          hover:bg-[#f8f1e4] focus:bg-[#f8f1e4]
          ${error ? 'animate-shake' : ''}
        `}
      />
      {error && (
        <p className="mt-2 text-sm text-red-700 font-medium italic animate-pulse">
          {error}
        </p>
      )}
    </div>
  </div>
);

export const RegisterForm = ({ onSuccess }: RegisterFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminPassphrase: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: (data: Omit<FormData, 'confirmPassword'>) => 
      api.register(data.username, data.email, data.password, data.adminPassphrase),
    onSuccess: (data) => {
      login(data.user, data.token);
      onSuccess();
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username) {
      newErrors.username = '*A name! We need a name to recognize ye by!*';
    } else if (formData.username.length < 3) {
      newErrors.username = '*That\'s hardly a proper name, now is it?*';
    }
    
    if (!formData.email) {
      newErrors.email = '*How else will we send ye word of great quests?*';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '*That\'s not any magical address I\'ve ever heard of!*';
    }
    
    if (!formData.password) {
      newErrors.password = '*Whisper yer secret words, carefully now...*';
    } else if (formData.password.length < 6) {
      newErrors.password = '*A bit longer, make it harder for the riff-raff!*';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '*Say it again, make sure ye remember it!*';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '*Those words don\'t match! Try again...*';
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        id="username"
        name="username"
        type="text"
        label="Hero's Name"
        icon={User}
        value={formData.username}
        onChange={handleChange}
        placeholder="What shall we call ye?"
        error={errors.username}
        required
      />

      <FormInput
        id="email"
        name="email"
        type="email"
        label="Magical Contact Scroll"
        icon={Mail}
        value={formData.email}
        onChange={handleChange}
        placeholder="Where can we reach ye?"
        error={errors.email}
        required
      />

      <FormInput
        id="password"
        name="password"
        type="password"
        label="Secret Passphrase"
        icon={KeyRound}
        value={formData.password}
        onChange={handleChange}
        placeholder="Whisper it quietly..."
        error={errors.password}
        required
      />

      <FormInput
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        label="Confirm Passphrase"
        icon={KeyRound}
        value={formData.confirmPassword}
        onChange={handleChange}
        placeholder="Once more, with feeling..."
        error={errors.confirmPassword}
        required
      />

      <FormInput
        id="adminPassphrase"
        name="adminPassphrase"
        type="password"
        label="Key to the Secret Society"
        icon={KeyRound}
        value={formData.adminPassphrase}
        onChange={handleChange}
        placeholder="invited by admin?, whisper the key!"
      />

      <div className="pt-4">
        <ScrollButton
          type="submit"
          variant="primary"
          size="large"
          className="w-full group relative overflow-hidden"
          disabled={mutation.isPending}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-1000" />
          {mutation.isPending ? (
            <div className="flex items-center justify-center">
              <span className="animate-spin mr-2">🎲</span>
              Seeking entrance...
            </div>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <UserPlus className="h-5 w-5" />
              Join the Guild
            </span>
          )}
        </ScrollButton>
      </div>
    </form>
  );
};
