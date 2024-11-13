import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import { GamepadIcon, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Navbar from '../components/layout/Navbar';
import CreateGameDialog from '../components/games/CreateGameDialog';
import FriendListItem from '../components/friends/FriendListItem';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { showNotification } = useNotification();
  const [friends, setFriends] = useState([]);
  const [friendRequests, setFriendRequests] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetchFriends();
    fetchFriendRequests();
  }, []);

  const fetchFriends = async () => {
    try {
      const response = await fetch('/api/friends');
      if (response.ok) {
        const data = await response.json();
        setFriends(data);
      }
    } catch (error) {
      showNotification('Error fetching friends', 'error');
    }
  };

  const fetchFriendRequests = async () => {
    try {
      const response = await fetch('/api/friends/requests');
      if (response.ok) {
        const data = await response.json();
        setFriendRequests(data);
      }
    } catch (error) {
      showNotification('Error fetching friend requests', 'error');
    }
  };

  const handleAddFriend = async (userId) => {
    try {
      const response = await fetch('/api/friends/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientId: userId })
      });
      
      if (response.ok) {
        showNotification('Friend request sent!', 'success');
      } else {
        const data = await response.json();
        showNotification(data.message, 'error');
      }
    } catch (error) {
      showNotification('Error sending friend request', 'error');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const response = await fetch(`/api/friends/remove/${friendId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        showNotification('Friend removed', 'success');
        fetchFriends();
      }
    } catch (error) {
      showNotification('Error removing friend', 'error');
    }
  };

  const handleCreateGame = async (gameData) => {
    // Implement game creation logic here
    showNotification('Game created successfully!', 'success');
  };

  const handleInviteToGame = async (friendId) => {
    // Implement game invitation logic here
    showNotification('Game invitation sent!', 'success');
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <Navbar 
        user={user}
        onAddFriend={handleAddFriend}
        friendRequests={friendRequests}
      />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <GamepadIcon className="mr-2 h-5 w-5" />
                  Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CreateGameDialog onCreateGame={handleCreateGame} />
                <div className="mt-4">
                  {games.length === 0 ? (
                    <p className="text-slate-400 text-center">No active games</p>
                  ) : (
                    <div className="space-y-2">
                      {games.map((game) => (
                        <div key={game._id}>
                          {/* Game component here */}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="flex items-center text-slate-200">
                  <Users className="mr-2 h-5 w-5" />
                  Friends ({friends.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {friends.length === 0 ? (
                  <p className="text-slate-400 text-center">No friends added yet</p>
                ) : (
                  <div className="space-y-2">
                    {friends.map((friend) => (
                      <FriendListItem
                        key={friend._id}
                        friend={friend}
                        onRemove={handleRemoveFriend}
                        onInvite={handleInviteToGame}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
