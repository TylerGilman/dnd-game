import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollText, Feather } from 'lucide-react';
import { api } from '../services/api';
import { CampaignGenerator } from "../components/CampaignGenerator";

interface CampaignForm {
  title: string;
  description: string;
  content: string;
  isHidden: boolean;
}

export const CreateCampaignPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<CampaignForm>({
    title: '',
    description: '',
    content: '',
    isHidden: false
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!user) {
    showNotification('You must be logged in to create a campaign', 'error');
    return;
  }

  try {
    setIsSubmitting(true);
    const token = localStorage.getItem('token');
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    await api.createCampaign(form, token);
    
    showNotification('🎲 Your tale has been inscribed in the archives!', 'success');
    // Navigate back to dashboard instead of a specific campaign page
    navigate('/dashboard');
  } catch (error) {
    console.error('Create campaign error:', error);
    showNotification(error instanceof Error ? error.message : 'Failed to create campaign', 'error');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="min-h-screen bg-[#2c1810] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation Bar */}
        <div className="mb-8 flex justify-between items-center bg-[#f4e4bc] p-4 rounded-lg border-4 border-[#8B4513] shadow-lg">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-semibold px-6 py-2 rounded shadow-inner border-2 border-[#f4e4bc]"
          >
            ← Back to Tavern
          </Button>
          <h2 className="text-[#8B4513] font-serif text-xl">Welcome, {user?.username || 'Adventurer'}!</h2>
        </div>

        <Card className="bg-[#f4e4bc] border-4 border-[#8B4513] shadow-[8px_8px_0_#000]">
          <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887] p-6">
            <CardTitle className="text-3xl font-serif font-bold text-[#8B4513] flex items-center gap-3 justify-center">
              <ScrollText className="h-8 w-8" />
              Inscribe Your Tale
              <Feather className="h-8 w-8" />
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8 bg-[#f4e4bc]">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                <label htmlFor="title" className="block text-lg font-serif font-bold text-[#8B4513] mb-2">
                  ⚔️ Title of Your Quest
                </label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="bg-[#f4e4bc] border-2 border-[#8B4513] text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] text-lg p-3"
                  placeholder="What shall your tale be known as?"
                />
              </div>

              <div className="space-y-8">
                <CampaignGenerator
                    onGenerated={(generatedFields) => {
                      setForm(prev => ({
                        ...prev,
                        ...generatedFields
                      }));
                    }}
                    currentFields={form}
                />
                <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                  <label htmlFor="description" className="block text-lg font-serif font-bold text-[#8B4513] mb-2">
                    📜 The Hook
                  </label>
                  <textarea
                      id="description"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full bg-[#f4e4bc] border-2 border-[#8B4513] rounded-lg text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] p-3 text-lg"
                      placeholder="Draw in fellow adventurers with a compelling introduction..."
                  />
                  <p className="mt-2 text-sm text-[#8B4513] italic">
                    A preview of your adventure that any wandering soul may glimpse
                  </p>
                </div>

                <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                  <label htmlFor="content" className="block text-lg font-serif font-bold text-[#8B4513] mb-2">
                    📖 The Chronicle
                  </label>
                  <textarea
                      id="content"
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      required
                      rows={10}
                      className="w-full bg-[#f4e4bc] border-2 border-[#8B4513] rounded-lg text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] p-3 text-lg"
                      placeholder="Unfold your epic tale in great detail..."
                  />
                  <p className="mt-2 text-sm text-[#8B4513] italic">
                    The full saga - for the eyes of fellow adventurers only
                  </p>
                </div>

                <div className="flex justify-left align-middle bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513] accent-[#8B4513]">
                  <Input
                      id="isHidden"
                      name="isHidden"
                      type="checkbox"
                      checked={form.isHidden}
                      onChange={handleChange}
                      required
                      className="w-8 h-8 bg-[#f4e4bc] border-2 border-[#8B4513] text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] text-lg p-3"
                  />
                  <label htmlFor="isHidden" className="pl-4 w-full block text-lg font-serif font-bold text-[#8B4513] mb-2">
                    🪄 Make my campaign disappear from unknown travellers
                  </label>
                </div>
                <div className="flex justify-between pt-6 border-t-4 border-[#8B4513] mt-8">
                  <Button
                      type="button"
                      onClick={() => navigate(-1)}
                      className="bg-[#a65d37] text-[#f4e4bc] hover:bg-[#8B4513] font-bold px-6 py-3 rounded shadow-[4px_4px_0_#000] border-2 border-[#f4e4bc]"
                  >
                    ← Abandon Quest
                  </Button>
                  <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="bg-[#2c1810] text-[#f4e4bc] hover:bg-[#1a0f09] font-bold px-8 py-3 rounded shadow-[4px_4px_0_#000] border-2 border-[#f4e4bc] disabled:opacity-50"
                  >
                    {isSubmitting ? '✒️ Inscribing...' : '✨ Inscribe Tale'}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateCampaignPage;
