// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useAuth} from '../context/AuthContext';
import {useNotification} from '../context/NotificationContext';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {Button} from '@/components/ui/button';
import FollowersModal from './FollowersModal';
import {api} from '../services/api';
import {User, Mail, Scroll, Edit, Trash2} from 'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter} from '@/components/ui/dialog';

interface Profile {
    username: string;
    email?: string;
    isAdmin: boolean;
    tagline: string;
    numberOfFollowers: number;
    is_following: boolean;
    is_follower: boolean;
    campaigns: {
        cid: number;
        title: string;
        description: string;
        createdAt: string;
        upvoteCount: number;
        isUpvoted: boolean;
    }[];
}

interface Follower {
  username: string;
  _id: string;
  is_following: boolean;
  is_follower: boolean;
}


export const ProfilePage = () => {
    const {username} = useParams<{ username: string }>();
    const {user} = useAuth();
    const navigate = useNavigate();
    const {showNotification} = useNotification();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [campaignToDelete, setCampaignToDelete] = useState<Profile['campaigns'][0] | null>(null);
    const [showFollowersModal, setShowFollowersModal] = useState(false);
    const [followers, setFollowers] = useState<Follower[]>([]);

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

    const handleDelete = async (campaign: Profile['campaigns'][0]) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            await api.deleteCampaign(campaign.cid, token);
            showNotification('Campaign deleted successfully', 'success');
            // Reload the profile to update the campaigns list
            const response = await api.getProfile(username!, token);
            setProfile(response.profile);
        } catch (error) {
            console.error('Failed to delete campaign:', error);
            showNotification('Failed to delete campaign', 'error');
        } finally {
            setShowDeleteDialog(false);
            setCampaignToDelete(null);
        }
    };

    const handleShowFollowers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No authentication token found');

            const response = await api.get_followers(username!, token);
            setFollowers(response.followers);
            setShowFollowersModal(true);
        } catch (error) {
            console.error('Failed to fetch followers:', error);
            showNotification('Failed to fetch followers', 'error');
        }
    };


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
                    <p className="text-[#f4e4bc] text-lg font-serif">This adventurer's tale has yet to be written...
                        📖</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#2c1810] p-8">
            <div className="max-w-4xl mx-auto">
                {/* Navigation */}
                <div
                    className="mb-8 flex justify-between items-center bg-[#f4e4bc] p-4 rounded-lg border-4 border-[#8B4513] shadow-lg">
                    <Button
                        onClick={() => navigate('/dashboard')}
                        className="bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-semibold px-6 py-2 rounded shadow-inner border-2 border-[#f4e4bc]"
                    >
                        ← Back to Tavern
                    </Button>
                    <div className="text-[#8B4513] font-serif text-xl flex items-center justify-between">
                        {isLoading ? (
                            'Loading...'
                        ) : (
                            <>
                                <h2>
                                    {profile?.username === user?.username
                                        ? 'My Profile'
                                        : `${profile?.username}'s Profile`}
                                </h2>
                                {profile?.username === user?.username && (
                                    <button
                                        onClick={() => navigate(`/profile/update`)}
                                        className="ml-4 text-sm bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410] font-semibold px-6 py-2 rounded shadow-inner border-2 border-[#f4e4bc]"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </>
                        )}
                    </div>

                </div>
                <div className="max-w-4xl mx-auto">
                    {/* Profile Card */}
                    <Card className="bg-[#f4e4bc] border-4 border-[#8B4513] shadow-[8px_8px_0_#000] mb-8">
                        <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <User className="h-12 w-12 text-[#8B4513]"/>
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
                                <div
                                    className="text-center p-4 bg-[#deb887] rounded-lg border-2 border-[#8B4513] cursor-pointer hover:bg-[#8B4513] hover:text-[#deb887] text-[#8B4513] transition-colors"
                                    onClick={handleShowFollowers}
                                >
                                    <p className="text-2xl font-bold">{profile.numberOfFollowers}</p>
                                    <p className="font-serif">Followers</p>
                                </div>

                                <div className="text-center p-4 bg-[#deb887] rounded-lg border-2 border-[#8B4513]">
                                    <p className="text-2xl font-bold text-[#8B4513]">{profile.campaigns?.length || 0}</p>
                                    <p className="text-[#8B4513] font-serif">Campaigns</p>
                                </div>
                            </div>
                            {profile.email && (
                                <div className="flex items-center gap-2 text-[#8B4513]/80">
                                    <Mail className="h-4 w-4"/>
                                    <span>{profile.email}</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Campaigns List */}
                    <h2 className="text-2xl font-serif font-bold text-[#deb887] mb-4 flex items-center gap-2">
                        <Scroll className="h-6 w-6"/>
                        Written Tales
                    </h2>

                    <div className="grid grid-cols-1 gap-6">
                        {profile.campaigns && profile.campaigns.length > 0 ? (
                            profile.campaigns.map((campaign) => (
                                <Card
                                    key={campaign.cid}
                                    className="bg-[#f4e4bc] border-4 border-[#8B4513] shadow-[8px_8px_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_#000] transition-all"
                                >
                                    <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887]">
                                        <div className="flex justify-between items-start">
                                            <CardTitle className="text-xl font-serif text-[#8B4513]">
                                                {campaign.title}
                                            </CardTitle>
                                            {user?.username === profile.username && (
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            navigate(`/campaigns/edit/${campaign.cid}`);
                                                        }}
                                                        className="text-[#8B4513] hover:text-[#6b3410]"
                                                    >
                                                        <Edit className="h-4 w-4"/>
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setCampaignToDelete(campaign);
                                                            setShowDeleteDialog(true);
                                                        }}
                                                        className="text-[#8B4513] hover:text-red-600"
                                                    >
                                                        <Trash2 className="h-4 w-4"/>
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </CardHeader>
                                    <CardContent
                                        className="p-6 cursor-pointer"
                                        onClick={() => navigate(`/campaigns/${campaign.cid}`)}
                                    >
                                        <p className="text-[#2c1810] mb-4">{campaign.description}</p>
                                        <div className="flex justify-between items-center text-sm text-[#8B4513]">
                                            <span>⬆️ {campaign.upvoteCount} adventurers approve</span>
                                            <span
                                                className="font-serif">{new Date(campaign.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div
                                className="text-center py-12 bg-[#f4e4bc] border-4 border-[#8B4513] rounded-lg shadow-[8px_8px_0_#000]">
                                <p className="text-[#8B4513] text-lg font-serif">
                                    No tales have been shared yet... 📜
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                        <DialogContent className="bg-[#f4e4bc] border-4 border-[#8B4513]">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-serif text-[#8B4513]">Delete
                                    Campaign</DialogTitle>
                            </DialogHeader>
                            <div className="py-4">
                                <p className="text-[#2c1810] font-serif">
                                    Are you sure you want to delete "{campaignToDelete?.title}"? This action cannot be
                                    undone.
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
                                    onClick={() => campaignToDelete && handleDelete(campaignToDelete)}
                                    className="bg-red-600 text-white hover:bg-red-700"
                                >
                                    Delete Campaign
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <FollowersModal
                isOpen={showFollowersModal}
                onClose={() => setShowFollowersModal(false)}
                followers={followers}
                currentUser={user}
            />
        </div>
    );
};

export default ProfilePage;
