import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Button } from '@/components/ui/button';
import { ThumbsUp, User, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { TavernInterior } from '../components/theme/TavernInterior';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Campaign {
  _id: string;
  cid: number;
  title: string;
  description: string;
  content: string;
  user: {
    _id: string;
    username: string;
  };
  createdAt: string;
  upvotes: string[];
  upvoteCount?: number;
  isUpvoted?: boolean;
}

export const CampaignDetailsPage = () => {
  const { cid } = useParams<{ cid: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    const loadCampaign = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.getCampaign(Number(cid), token);
        setCampaign(response.campaign);
      } catch (error) {
        console.error('Failed to load campaign:', error);
        showNotification('Failed to load campaign', 'error');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadCampaign();
  }, [cid, navigate, showNotification]);

  const handleUpvote = async () => {
    if (!campaign) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('You must be logged in to upvote', 'error');
        return;
      }

      const response = await api.toggleUpvote(campaign.cid, token);
      
      setCampaign(prev => {
        if (!prev) return null;
        return {
          ...prev,
          upvoteCount: prev.isUpvoted ? (prev.upvoteCount || 1) - 1 : (prev.upvoteCount || 0) + 1,
          isUpvoted: !prev.isUpvoted
        };
      });

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

  const handleDelete = async () => {
    if (!campaign) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await api.deleteCampaign(campaign.cid, token);
      showNotification('Campaign deleted successfully', 'success');
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      showNotification('Failed to delete campaign', 'error');
    } finally {
      setShowDeleteDialog(false);
    }
  };

  if (isLoading) {
    return (
      <TavernInterior>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-[#f4e4bc] text-lg">Unrolling the ancient scroll... 📜</p>
        </div>
      </TavernInterior>
    );
  }

  if (!campaign) {
    return (
      <TavernInterior>
        <div className="max-w-4xl mx-auto text-center py-12">
          <p className="text-[#f4e4bc] text-lg">This tale seems to have been lost to time...</p>
          <Button
            onClick={() => navigate('/dashboard')}
            className="mt-4 bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410]"
          >
            Return to the Tavern
          </Button>
        </div>
      </TavernInterior>
    );
  }

  return (
    <TavernInterior>
      <div className="max-w-4xl mx-auto p-6">
        {/* Navigation Bar */}
        <div className="mb-8 flex justify-between items-center bg-[#f4e4bc] p-4 rounded-lg border-4 border-[#8B4513] shadow-lg">
          <Button 
            onClick={() => navigate('/dashboard')}
            className="bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-semibold px-6 py-2 rounded shadow-inner border-2 border-[#f4e4bc] flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tavern
          </Button>
        </div>

        {/* Campaign Details Card */}
        <div className="bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg shadow-lg">
          <div className="border-b-4 border-[#8B4513] bg-[#deb887] p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-[#2c1810] font-serif mb-4">{campaign.title}</h1>
              
              {user && campaign.user._id === user._id && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/campaigns/edit/${campaign.cid}`)}
                    className="bg-[#8B4513] text-[#f4e4bc]"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    onClick={() => setShowDeleteDialog(true)}
                    variant="destructive"
                    className="bg-red-800"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-[#2c1810]">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5" />
                <span className="font-serif">By {campaign.user.username}</span>
              </div>
              <span className="text-sm">
                Posted on {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="bg-[#fff8dc] p-4 rounded-lg border-2 border-[#8B4513]">
              <h2 className="text-xl font-bold text-[#2c1810] mb-2 font-serif">The Hook</h2>
              <p className="text-[#2c1810] whitespace-pre-wrap">{campaign.description}</p>
            </div>

            <div className="bg-[#fff8dc] p-4 rounded-lg border-2 border-[#8B4513]">
              <h2 className="text-xl font-bold text-[#2c1810] mb-2 font-serif">The Tale</h2>
              <p className="text-[#2c1810] whitespace-pre-wrap">{campaign.content}</p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t-2 border-[#8B4513]">
              <button
                onClick={handleUpvote}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  campaign.isUpvoted 
                    ? 'text-[#2c1810] font-bold bg-[#deb887]' 
                    : 'text-[#8B4513] hover:bg-[#deb887]'
                }`}
              >
                <ThumbsUp className={`h-5 w-5 ${campaign.isUpvoted ? 'fill-current' : ''}`} />
                <span>{campaign.upvoteCount || 0} votes</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="bg-[#f4e4bc] border-4 border-[#8B4513]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-[#8B4513]">Delete Campaign</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-[#2c1810] font-serif">
                Are you sure you want to delete "{campaign.title}"? This action cannot be undone.
              </p>
            </div>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
                className="border-[#8B4513] text-[#8B4513] hover:bg-[#deb887]"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete Campaign
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </TavernInterior>
  );
};

export default CampaignDetailsPage;
