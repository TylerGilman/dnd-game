import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { PlusCircle, Users, GamepadIcon, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const FriendsList = ({ friends, onRemoveFriend }) => (
  <div className="space-y-2">
    {friends.map((friend) => (
      <div key={friend.id} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
        <span>{friend.username}</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Invite to Game
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => onRemoveFriend(friend.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    ))}
  </div>
);

const CreateGameDialog = () => {
  const [gameName, setGameName] = useState('');
  const [playerLimit, setPlayerLimit] = useState(4);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Game
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Game</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Game Name</label>
            <Input
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              placeholder="Enter game name"
            />
          </div>
          <div>
            <label className="text-sm font-medium">Player Limit</label>
            <Input
              type="number"
              value={playerLimit}
              onChange={(e) => setPlayerLimit(parseInt(e.target.value))}
              min={2}
              max={6}
            />
          </div>
          <Button className="w-full">Create Game</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [friends] = useState([
    { id: 1, username: 'Player1' },
    { id: 2, username: 'Player2' },
  ]);
  
  const handleLogout = () => {
    logout();
    showNotification('Successfully logged out', 'success');
    navigate('/login');
  };

  const handleRemoveFriend = (friendId) => {
    // Implementation would go here
    showNotification('Friend removed', 'success');
  };

  const handleAddFriend = (username) => {
    // Implementation would go here
    showNotification('Friend request sent', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">D&D Text Adventure</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user?.username}!</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Friends
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onSelect={() => handleAddFriend('newFriend')}>
                    Add Friend
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={handleLogout}
                variant="default"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <GamepadIcon className="mr-2 h-5 w-5" />
                  Games
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CreateGameDialog />
                <div className="mt-4">
                  <p className="text-gray-500 text-center">No active games</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5" />
                  Friends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FriendsList 
                  friends={friends}
                  onRemoveFriend={handleRemoveFriend}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
