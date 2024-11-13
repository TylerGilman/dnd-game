import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from '@/components/ui/button';
import AddFriendDialog from '../friends/AddFriendDialog';
import FriendRequestsDialog from '../friends/FriendRequestsDialog';

interface NavbarProps {
  user: {
    username: string;
  };
  onAddFriend: (userId: string) => Promise<void>;
  friendRequests: Array<{
    _id: string;
    sender: {
      _id: string;
      username: string;
    };
  }>;
}

const Navbar: React.FC<NavbarProps> = ({ user, onAddFriend, friendRequests }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/request/${requestId}/accept`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to accept friend request');
      }
      
      // You might want to trigger a refresh of friend requests here
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      const response = await fetch(`/api/friends/request/${requestId}/reject`, {
        method: 'POST'
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject friend request');
      }
      
      // You might want to trigger a refresh of friend requests here
    } catch (error) {
      console.error('Error rejecting friend request:', error);
    }
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-slate-200">D&D Text Adventure</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-slate-200">
              Welcome, {user?.username}!
            </span>
            
            <AddFriendDialog onAddFriend={onAddFriend} />
            
            <FriendRequestsDialog
              requests={friendRequests}
              onAccept={handleAcceptRequest}
              onReject={handleRejectRequest}
            />
            
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-slate-200 border-slate-700 hover:bg-slate-800"
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
