// /client/src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Scroll, User } from 'lucide-react';
import { api } from '../services/api';

import { TavernInterior } from '../components/theme/TavernInterior';
import { NPCDialog } from '../components/theme/NPCDialog';
import placeholderFace from '@/assets/placeholder-face.webp';

interface Campaign {
  _id: string;
  cid: number;
  title: string;
  description: string;
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
  upvotes: string[];
  upvoteCount?: number;
  isUpvoted?: boolean;
}

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.getCampaigns(token);
        setCampaigns(response.campaigns);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
        showNotification('Failed to load campaigns', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaigns();
  }, [showNotification]);

  const handleLogout = () => {
    logout();
    showNotification('🚪 Farewell, adventurer!', 'success');
    navigate('/login');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCreateCampaign = () => {
    navigate('/campaigns/new');
  };

  return (
    <TavernInterior>
      <div className="max-w-3xl mx-auto mt-8 mb-12">
        <NPCDialog speaker="Jorje the Tavernkeeper" icon={placeholderFace}>
          "Welcome, {user?.username || 'stranger'}! The bounty board awaits. Post your quests or claim those posted by others. The candlelight flickers, secrets whisper in the dark wood. Choose wisely!"
        </NPCDialog>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-[#8B4513]" />
              <Input
                placeholder="Search the bounty board..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 bg-[#fff8dc] border-2 border-[#8B4513] 
                           text-[#2c1810] placeholder-[#8B4513]/60 
                           focus:ring-2 focus:ring-[#8B4513] h-12 text-lg rounded-lg"
              />
            </div>
            {user && (
              <Button
                onClick={handleCreateCampaign}
                className="bg-[#2c1810] text-[#f4e4bc] hover:bg-[#1a0f09] font-bold
                           px-6 h-12 rounded-lg border-2 border-[#f4e4bc] flex items-center gap-2"
              >
                <PlusCircle className="h-5 w-5" />
                Post a New Bounty
              </Button>
            )}
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#f4e4bc] text-lg">Consulting ancient scrolls... 📚</p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#f4e4bc] text-lg">
              The board is empty... Post the first quest!
            </p>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                onClick={() => navigate(`/campaigns/${campaign.cid}`)}
                className="relative bg-parchment border-2 border-[#8B4513] p-4 cursor-pointer 
                           transform rotate-[-2deg] hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform rounded-lg"
              >
                {/* Pin image */}
                <img src="/pin.png" alt="pin" className="w-5 h-5 absolute top-[-10px] left-1/2 transform -translate-x-1/2" />

                <h2 className="text-[#2c1810] text-xl font-bold mb-2 flex items-center gap-2">
                  <Scroll className="h-5 w-5 text-[#2c1810]" />
                  {campaign.title}
                </h2>
                <p className="text-[#2c1810] mb-4">{campaign.description}</p>
                <div className="flex justify-between text-sm text-[#2c1810]">
                  <span>🎲 {campaign.upvoteCount ?? campaign.upvotes.length} nod</span>
                  <span>{new Date(campaign.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {user && (
          <div className="flex justify-end gap-4 mt-8">
            <Button
              onClick={() => navigate(`/profile/${user.username}`)}
              className="bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-bold px-4 py-2 rounded 
                         border-2 border-[#f4e4bc] flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Your Profile
            </Button>
            <Button
              onClick={handleLogout}
              className="bg-[#a65d37] text-[#f4e4bc] hover:bg-[#8B4513] font-bold px-4 py-2 
                         rounded border-2 border-[#f4e4bc]"
            >
              Leave Tavern
            </Button>
          </div>
        )}
      </div>
    </TavernInterior>
  );
};

export default DashboardPage;
