import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, PlusCircle, Scroll, User, ThumbsUp } from 'lucide-react';
import { api } from '../services/api';
import debounce from 'lodash/debounce';
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
  const [isSearching, setIsSearching] = useState(false);

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

  const debouncedSearch = debounce(async (query: string) => {
    if (!query.trim()) {
      try {
        const token = localStorage.getItem('token');
        const response = await api.getCampaigns(token);
        setCampaigns(response.campaigns);
      } catch (error) {
        console.error('Failed to load campaigns:', error);
        showNotification('Failed to load campaigns', 'error');
      }
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem('token');
      const response = await api.searchCampaigns(query, token);
      setCampaigns(response.results);
    } catch (error) {
      console.error('Search failed:', error);
      showNotification('Search failed', 'error');
    } finally {
      setIsSearching(false);
    }
  }, 500);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  };

  const handleCreateCampaign = () => {
    navigate('/campaigns/new');
  };

  const handleUpvote = async (campaign: Campaign) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('You must be logged in to upvote', 'error');
        return;
      }

      const response = await api.toggleUpvote(campaign.cid, token);
      
      setCampaigns(prevCampaigns => 
        prevCampaigns.map(c => {
          if (c.cid === campaign.cid) {
            return {
              ...c,
              upvoteCount: c.isUpvoted ? (c.upvoteCount || 1) - 1 : (c.upvoteCount || 0) + 1,
              isUpvoted: !c.isUpvoted
            };
          }
          return c;
        })
      );

      showNotification(
        campaign.isUpvoted 
          ? 'Removed your vote from the tale' 
          : 'Added your vote to the tale', 
        'success'
      );
    } catch (error) {
      console.error('Failed to toggle upvote:', error);
      showNotification('Failed to update vote', 'error');
    }
  };

  return (
    <TavernInterior>
      <div className="max-w-3xl mx-auto mt-8 mb-12">
        <NPCDialog speaker="Jorje the Tavernkeeper" icon={placeholderFace}>
          "Welcome, {user?.username || 'stranger'}! This adventure board awaits your mark. Post new quests or vote for quests that suit your fancy!"
        </NPCDialog>
      </div>

      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className={`absolute left-3 top-3.5 h-5 w-5 text-[#8B4513] ${
                isSearching ? 'animate-spin' : ''
              }`} />
              <Input
                placeholder="Search the adventure board..."
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
                Post a New Adventure
              </Button>
            )}
          </div>
        </div>

        {isLoading || isSearching ? (
          <div className="text-center py-12">
            <p className="text-[#f4e4bc] text-lg">
              {isSearching ? 'Searching the archives... 🔍' : 'Consulting ancient scrolls... 📚'}
            </p>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-[#f4e4bc] text-lg">
              {searchQuery ? 'No tales match your search...' : 'The board is empty... Post the first quest!'}
            </p>
          </div>
        ) : (
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaigns.map((campaign) => (
              <div
                key={campaign._id}
                className="relative bg-parchment border-2 border-[#8B4513] p-4 cursor-pointer 
                         transform rotate-[-2deg] hover:rotate-0 hover:translate-x-[2px] hover:translate-y-[2px] 
                         transition-transform rounded-lg"
              >
                <div className="absolute top-[-10px] left-1/2 transform -translate-x-1/2 text-xl">
                  📍
                </div>

                <div className="mb-2">
                  <h2 className="text-[#2c1810] text-xl font-bold flex items-center gap-2">
                    <Scroll className="h-5 w-5 text-[#2c1810]" />
                    {campaign.title}
                  </h2>
                  <div className="flex items-center text-sm text-[#8B4513] mt-1">
                    <User className="h-4 w-4 mr-1" />
                    <span>Posted by {campaign.user.username}</span>
                  </div>
                </div>

                <div 
                  className="text-[#2c1810] mb-4 cursor-pointer"
                  onClick={() => navigate(`/campaigns/${campaign.cid}`)}
                >
                  {campaign.description}
                </div>

                <div className="flex justify-between items-center text-sm text-[#8B4513]">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpvote(campaign);
                    }}
                    className={`flex items-center gap-1 transition-colors ${
                      campaign.isUpvoted 
                        ? 'text-[#2c1810] font-bold' 
                        : 'text-[#8B4513] hover:text-[#2c1810]'
                    }`}
                  >
                    <ThumbsUp 
                      className={`h-4 w-4 ${
                        campaign.isUpvoted ? 'fill-current' : ''
                      }`} 
                    />
                    <span>{campaign.upvoteCount || 0} votes</span>
                  </button>
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
