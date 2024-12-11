// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {useNotification} from '../context/NotificationContext';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {api} from '../services/api';

export const EditProfilePage = () => {
    const navigate = useNavigate();
    const {user} = useAuth();
    const {showNotification} = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [form, setForm] = useState({
        email: '',
        tagline: ''
    });

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) throw new Error('No authentication token found');
                const response = await api.getProfile(user.username, token);
                const {email, tagline} = response.profile;
                setForm({email, tagline});
            } catch (error) {
                console.error('Failed to load profile:', error);
                showNotification('Failed to load profile', 'error');
                navigate('/dashboard');
            }
        };

        loadProfile();
    }, [navigate, showNotification]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showNotification('You must be logged in to edit your profile', 'error');
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            await api.updateProfile(
                user.username,
                {
                    email: form.email,
                    tagline: form.tagline
                },
                token
            );

            showNotification('Profile updated successfully!', 'success');
            navigate(`/profile/${user.username}`);
        } catch (error) {
            console.error('Update profile error:', error);
            showNotification(
                error instanceof Error ? error.message : 'Failed to update profile',
                'error'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-[#2c1810] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Card className="bg-[#f4e4bc] border-4 border-[#8B4513] shadow-[8px_8px_0_#000]">
                    <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887]">
                        <CardTitle
                            className="text-3xl font-serif font-bold text-[#8B4513] flex items-center gap-3 justify-center">
                            Edit Your Profile
                        </CardTitle>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                                <label
                                    htmlFor="username"
                                    className="block text-lg font-serif font-bold text-[#8B4513] mb-2"
                                >
                                    Username
                                </label>
                                <Input
                                    id="username"
                                    name="username"
                                    value={user.username}
                                    onChange={handleChange}
                                    required
                                    maxLength={50}
                                    className="bg-[#f4e4bc] border-2 border-[#8B4513] text-[#2c1810] placeholder-[#8B4513]/60"
                                />
                            </div>

                            <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                                <label
                                    htmlFor="email"
                                    className="block text-lg font-serif font-bold text-[#8B4513] mb-2"
                                >
                                    Email
                                </label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    required
                                    className="bg-[#f4e4bc] border-2 border-[#8B4513] text-[#2c1810] placeholder-[#8B4513]/60"
                                />
                            </div>

                            <div className="bg-[#deb887] p-6 rounded-lg border-2 border-[#8B4513]">
                                <label
                                    htmlFor="tagline"
                                    className="block text-lg font-serif font-bold text-[#8B4513] mb-2"
                                >
                                    Tagline
                                </label>
                                <Input
                                    id="tagline"
                                    name="tagline"
                                    value={form.tagline}
                                    placeholder={"A mysterious adventurer..."}
                                    onChange={handleChange}
                                    maxLength={150}
                                    className="bg-[#f4e4bc] border-2 border-[#8B4513] text-[#2c1810] placeholder-[#8B4513]/60"
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
                                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default EditProfilePage;
