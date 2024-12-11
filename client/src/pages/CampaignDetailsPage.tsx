// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { Button } from '@/components/ui/button';
import { ThumbsUp, User, ArrowLeft, Edit, Trash2, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import { TavernInterior } from '../components/theme/TavernInterior';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';

interface Comment {
  _id: string;
  user: {
    _id: string;
    username: string;
  };
  content: string;
  createdAt: string;
}

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
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

  useEffect(() => {
    const loadComments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.getComments(Number(cid), token);
        setComments(response.comments);
      } catch (error) {
        console.error('Failed to load comments:', error);
        showNotification('Failed to load comments', 'error');
      } finally {
        setIsLoadingComments(false);
      }
    };

    if (campaign) {
      loadComments();
    }
  }, [cid, campaign, showNotification]);

  const handleUpvote = async () => {
    if (!campaign) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        showNotification('You must be logged in to upvote', 'error');
        return;
      }

      //const response = await api.toggleUpvote(campaign.cid, token);

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

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showNotification('You must be logged in to comment', 'error');
      return;
    }
    if (!newComment.trim()) return;

    setIsSubmittingComment(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      const response = await api.createComment(Number(cid), newComment, token);
      setComments(prev => [...prev, response.comment]);
      setNewComment('');
      showNotification('Comment added successfully', 'success');
    } catch (error) {
      console.error('Failed to add comment:', error);
      showNotification('Failed to add comment', 'error');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No authentication token found');

      await api.deleteComment(commentId, token);
      setComments(prev => prev.filter(comment => comment._id !== commentId));
      showNotification('Comment deleted successfully', 'success');
    } catch (error) {
      console.error('Failed to delete comment:', error);
      showNotification('Failed to delete comment', 'error');
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

        {/* Campaign Card */}
        <div className="bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg shadow-lg">
          {/* Card Header */}
          <div className="border-b-4 border-[#8B4513] bg-[#deb887] p-6">
            <div className="flex justify-between items-start">
              <h1 className="text-3xl font-bold text-[#2c1810] font-serif mb-4">{campaign.title}</h1>

              {user && (
  <div className="flex gap-2">
        {campaign.user._id === user._id && (
          <Button
            onClick={() => navigate(`/campaigns/edit/${campaign.cid}`)}
            className="bg-[#8B4513] text-[#f4e4bc]"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}

        {(campaign.user._id === user._id || user.isAdmin) && (
          <Button
            onClick={() => setShowDeleteDialog(true)}
            variant="destructive"
            className="bg-red-800"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>
    )}

            </div>

            <div className="flex items-center justify-between text-[#2c1810]">
              <div
                  className="flex items-center gap-2 p-2 cursor-pointer hover:bg-[#f4e4bc] hover:text-[#8B4513] hover:shadow-md hover:rounded-lg transition-colors duration-200"
                  onClick={() => {
                    navigate(`/profile/${campaign.user.username}`);
                  }}
              >
                <User className="h-5 w-5"/>
                <span className="font-serif">By {campaign.user.username}</span>
              </div>
              <span className="text-sm">
                Posted on {new Date(campaign.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Campaign Content */}
          <div className="p-6 space-y-6">
            <div className="bg-[#fff8dc] p-4 rounded-lg border-2 border-[#8B4513]">
              <h2 className="text-xl font-bold text-[#2c1810] mb-2 font-serif">The Hook</h2>
              <p className="text-[#2c1810] whitespace-pre-wrap">{campaign.description}</p>
            </div>

            <div className="bg-[#fff8dc] p-4 rounded-lg border-2 border-[#8B4513]">
              <h2 className="text-xl font-bold text-[#2c1810] mb-2 font-serif">The Tale</h2>
              <p className="text-[#2c1810] whitespace-pre-wrap">{campaign.content}</p>
            </div>

            {/* Voting Section */}
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
            {/* Comments Section */}
            <div className="mt-8 border-t-2 border-[#8B4513] pt-6">
              <div className="flex items-center gap-2 mb-4">
                <MessageSquare className="h-6 w-6 text-[#2c1810]" />
                <h2 className="text-xl font-bold text-[#2c1810] font-serif">Tavern Chat</h2>
              </div>

              {/* Comment Form */}
              {user && (
                <form onSubmit={handleSubmitComment} className="mb-6">
                  <div className="flex gap-4">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Share your thoughts on this tale..."
                      className="flex-grow p-3 rounded-lg border-2 border-[#8B4513] bg-[#fff8dc]
                               text-[#2c1810] placeholder-[#8B4513]/60 
                               focus:ring-2 focus:ring-[#8B4513] min-h-[100px]"
                    />
                    <Button
                      type="submit"
                      disabled={isSubmittingComment || !newComment.trim()}
                      className="self-end bg-[#8B4513] text-[#f4e4bc] hover:bg-[#654321]
                               disabled:opacity-50"
                    >
                      {isSubmittingComment ? 'Posting...' : 'Post Comment'}
                    </Button>
                  </div>
                </form>
              )}

              {/* Comments List */}
              <div className="space-y-4">
                {isLoadingComments ? (
                  <p className="text-center text-[#8B4513] italic">Loading comments...</p>
                ) : comments.length === 0 ? (
                  <p className="text-center text-[#8B4513] italic">
                    No comments yet. Be the first to share your thoughts!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div
                      key={comment._id}
                      className="bg-[#fff8dc] p-4 rounded-lg border-2 border-[#8B4513] relative"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-[#8B4513]" />
                          <span className="font-serif text-[#2c1810] font-bold">
                            {comment.user.username}
                          </span>
                          <span className="text-sm text-[#8B4513]">
                            • {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        {(user?._id === comment.user._id ||
                          (campaign && user?._id === campaign.user._id)) && (
                          <Button
                            onClick={() => handleDeleteComment(comment._id)}
                            variant="ghost"
                            className="text-red-600 hover:text-red-700 p-1 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <p className="text-[#2c1810] whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Delete Campaign Dialog */}
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
