// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import { useState, useEffect } from 'react';
import { useNavigate, useParams} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollText} from 'lucide-react';
import { api } from '../services/api';

export const EditCampaignPage = () => {
  const navigate = useNavigate();
  const { cid } = useParams();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    content: ''
  });

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await api.getCampaign(Number(cid), token);
        const { title, description, content } = response.campaign;
        setForm({ title, description, content });
      } catch (error) {
        console.error('Failed to load campaign:', error);
        showNotification('Failed to load campaign', 'error');
        navigate('/dashboard');
      }
    };

    loadCampaign();
  }, [cid, navigate, showNotification]);

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        showNotification('You must be logged in to edit a campaign', 'error');
        return;
    }

    try {
        setIsSubmitting(true);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        // Add console.log to see what we're sending
        console.log('Submitting update:', form);

        await api.updateCampaign(Number(cid), {
            title: form.title,
            description: form.description,
            content: form.content
        }, token);

        showNotification('🎉 Your tale has been updated!', 'success');
        navigate('/dashboard');
    } catch (error) {
        console.error('Update campaign error:', error);
        showNotification(error instanceof Error ? error.message : 'Failed to update campaign', 'error');
    } finally {
        setIsSubmitting(false);
    }
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Add console.log to track changes
    console.log('Form change:', { name, value });
    setForm(prev => ({
        ...prev,
        [name]: value
    }));
};

  return (
    <div className="min-h-screen bg-[#2c1810] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-[#f4e4bc] border-4 border-[#8B4513] shadow-[8px_8px_0_#000]">
          <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887]">
            <CardTitle className="text-3xl font-serif font-bold text-[#8B4513] flex items-center gap-3 justify-center">
              <ScrollText className="h-8 w-8" />
              Edit Your Tale
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                <label htmlFor="title" className="block text-lg font-serif font-bold text-[#8B4513] mb-2">
                  Title of Your Quest
                </label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="bg-[#f4e4bc] border-2 border-[#8B4513] text-[#2c1810] placeholder-[#8B4513]/60"
                />
              </div>

              <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                <label htmlFor="description" className="block text-lg font-serif font-bold text-[#8B4513] mb-2">
                  The Hook
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={3}
                  className="w-full bg-[#f4e4bc] border-2 border-[#8B4513] rounded-lg text-[#2c1810] placeholder-[#8B4513]/60"
                />
              </div>

              <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                <label htmlFor="content" className="block text-lg font-serif font-bold text-[#8B4513] mb-2">
                  The Chronicle
                </label>
                <textarea
                  id="content"
                  name="content"
                  value={form.content}
                  onChange={handleChange}
                  required
                  rows={10}
                  className="w-full bg-[#f4e4bc] border-2 border-[#8B4513] rounded-lg text-[#2c1810] placeholder-[#8B4513]/60"
                />
              </div>

              <div className="flex justify-between pt-6">
                <Button 
                  type="button" 
                  onClick={() => navigate(-1)}
                  className="bg-[#a65d37] text-[#f4e4bc] hover:bg-[#8B4513] font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#2c1810] text-[#f4e4bc] hover:bg-[#1a0f09] font-bold"
                >
                  {isSubmitting ? 'Updating...' : 'Update Tale'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditCampaignPage;
