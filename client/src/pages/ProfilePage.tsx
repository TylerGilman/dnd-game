import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '../services/api';
import { User, Mail, Scroll } from 'lucide-react';

interface Profile {
  username: string;
  email?: string;
  isAdmin: boolean;
  tagline: string;
  numberOfFollowers: number;
  is_following: boolean;
  is_follower: boolean;
  posts: { // These are our campaigns
    pid: number;
    title: string;
    description: string;
    createdAt: string;
    upvoteCount: number;
    isUpvoted: boolean;
  }[];
}

export const ProfilePage = () => {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.getProfile(username!, token);
        setProfile(response.profile);
      } catch (error) {
        console.error('Failed to load profile:', error);
        showNotification('Failed to load profile', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [username, showNotification]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#2c1810] p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#f4e4bc] text-lg font-serif">Reading the ancient scrolls... 📜</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#2c1810] p-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#f4e4bc] text-lg font-serif">This adventurer's tale has yet to be written... 📖</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#2c1810] p-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Card */}
        <Card className="bg-[#f4e4bc] border-4 border-[#8B4513] shadow-[8px_8px_0_#000] mb-8">
          <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <User className="h-12 w-12 text-[#8B4513]" />
                <div>
                  <CardTitle className="text-2xl font-serif text-[#8B4513]">
                    {profile.username}
                    {profile.isAdmin && ' 👑'}
                  </CardTitle>
                  <p className="text-[#8B4513]/80 font-serif">{profile.tagline || 'A mysterious adventurer...'}</p>
                </div>
              </div>
              {user?.username !== profile.username && (
                <Button
                  className="bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-bold px-4 py-2 rounded shadow-[4px_4px_0_#000] border-2 border-[#f4e4bc]"
                >
                  {profile.is_following ? 'Unfollow' : 'Follow'} Adventurer
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-[#deb887] rounded-lg border-2 border-[#8B4513]">
                <p className="text-2xl font-bold text-[#8B4513]">{profile.numberOfFollowers}</p>
                <p className="text-[#8B4513]/80 font-serif">Followers</p>
              </div>
              <div className="text-center p-4 bg-[#deb887] rounded-lg border-2 border-[#8B4513]">
                <p className="text-2xl font-bold text-[#8B4513]">{profile.posts?.length || 0}</p>
                <p className="text-[#8B4513]/80 font-serif">Campaigns</p>
              </div>
            </div>
            {profile.email && (
              <div className="flex items-center gap-2 text-[#8B4513]/80">
                <Mail className="h-4 w-4" />
                <span>{profile.email}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Campaigns List */}
        <h2 className="text-2xl font-serif font-bold text-[#deb887] mb-4 flex items-center gap-2">
          <Scroll className="h-6 w-6" />
          Written Tales
        </h2>
        
        <div className="grid grid-cols-1 gap-6">
          {profile.posts && profile.posts.map((campaign) => (
            <Card 
              key={campaign.pid}
              className="bg-[#f4e4bc] border-4 border-[#8B4513] shadow-[8px_8px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#000] transition-all"
              onClick={() => navigate(`/campaigns/${campaign.pid}`)}
            >
              <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887]">
                <CardTitle className="text-xl font-serif text-[#8B4513]">
                  {campaign.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-[#2c1810] mb-4">{campaign.description}</p>
                <div className="flex justify-between items-center text-sm text-[#8B4513]">
                  <span>⬆️ {campaign.upvoteCount} adventurers approve</span>
                  <span className="font-serif">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}

{(!profile.posts || profile.posts.length === 0) && (
  <div className="text-center py-12 bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg shadow-[8px_8px_0_#000]">
    <p className="text-[#8B4513] text-lg font-serif">
      No tales have been shared yet... 📜
    </p>
  </div>
)}
        </div>

        {profile.posts.length === 0 && (
          <div className="text-center py-12 bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg shadow-[8px_8px_0_#000]">
            <p className="text-[#8B4513] text-lg font-serif">
              No tales have been shared yet... 📜
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
