import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { Search, PlusCircle, Scroll, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User } from 'lucide-react';
import { api } from '../services/api';

interface Campaign {
  _id: string;
  cid: number;
  title: string;
  description: string;
  content?: string; // Optional because it's only visible to logged-in users
  user: {
    _id: string;
    username: string;
  };
  upvotes: string[];
  createdAt: string;
}

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState('');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]); // This will be populated from your API
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
  }, []);

  const handleLogout = () => {
    logout();
    showNotification('🚪 Farewell, brave adventurer!', 'success');
    navigate('/login');
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Implement campaign search logic here
  };

  const handleCreateCampaign = () => {
    navigate('/campaigns/new');
  };

  return (
    <div className="min-h-screen bg-[#2c1810] p-4 sm:p-6 lg:p-8">
      {/* Navigation */}
      <nav className="bg-[#deb887] border-4 border-[#8B4513] rounded-lg shadow-[8px_8px_0_#000] mb-8">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Scroll className="h-8 w-8 text-[#8B4513]" />
              <h1 className="text-2xl font-bold font-serif text-[#8B4513]">The Adventurer's Tavern</h1>
            </div>
              <div className="flex items-center space-x-4">
                {user && (
                  <>
                    <Link 
                      to={`/profile/${user.username}`}
                      className="flex items-center gap-2 text-[#8B4513] hover:text-[#6b3410] font-serif transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span>Welcome, {user.username}! 🍺</span>
                    </Link>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      className="bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-bold px-4 py-2 rounded shadow-[4px_4px_0_#000] border-2 border-[#f4e4bc] flex items-center gap-2"
                    >
                      Leave Tavern
                    </Button>
                  </>
                )}
              </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {/* Search and Create Section */}
        <Card className="bg-[#deb887] border-4 border-[#8B4513] shadow-[8px_8px_0_#000] mb-8">
          <CardContent className="p-6">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-[#8B4513]" />
                <Input
                  placeholder="Search for legendary tales..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10 bg-[#f4e4bc] border-2 border-[#8B4513] text-[#2c1810] placeholder-[#8B4513]/60 focus:ring-2 focus:ring-[#8B4513] h-12 text-lg rounded-lg"
                />
              </div>
              {user && (
                <Button
                  onClick={handleCreateCampaign}
                  className="bg-[#2c1810] text-[#f4e4bc] hover:bg-[#1a0f09] font-bold px-6 h-12 rounded-lg shadow-[4px_4px_0_#000] border-2 border-[#f4e4bc] flex items-center gap-2 whitespace-nowrap"
                >
                  <PlusCircle className="h-5 w-5" />
                  Inscribe New Tale
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Card 
              key={campaign._id} 
              className="bg-[#f4e4bc] border-4 border-[#8B4513] shadow-[8px_8px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#000] transition-all"
            >
              <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887]">
                <CardTitle className="text-xl font-serif text-[#8B4513]">
                  {campaign.title}
                </CardTitle>
                <p className="text-sm text-[#8B4513]/80 font-serif">by {campaign.author}</p>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-[#2c1810] mb-4 font-medium">{campaign.description}</p>
                <div className="flex justify-between items-center text-sm text-[#8B4513]">
                  <span className="flex items-center gap-1">
                    🎲 {campaign.upvotes} adventurers approve
                  </span>
                  <span className="font-serif">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {(isLoading ? (
          <div className="text-center py-12">
            <p className="text-[#8B4513] text-lg font-serif">Loading tales from the archives... 📚</p>
          </div>
        ) : campaigns.length === 0) && (
          <div className="text-center py-12">
            <p className="text-[#8B4513] text-lg font-serif">The tavern is quiet... No tales have been shared yet. 🍺</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default DashboardPage;
