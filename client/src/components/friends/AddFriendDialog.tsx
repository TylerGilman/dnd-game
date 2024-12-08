import React, { useState } from 'react';
import { UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface User {
  _id: string;
  username: string;
}

interface AddFriendDialogProps {
  onAddFriend: (userId: string) => Promise<void>;
}

const AddFriendDialog: React.FC<AddFriendDialogProps> = ({ onAddFriend }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = async (value: string) => {
    setSearchTerm(value);
    if (value.length < 3) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/friends/search?query=${encodeURIComponent(value)}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendRequest = async (userId: string) => {
    try {
      await onAddFriend(userId);
      // Remove the user from search results after sending request
      setSearchResults(prev => prev.filter(user => user._id !== userId));
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      // Reset state when dialog closes
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="bg-white text-slate-200 hover:text-white hover:bg-slate-800">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Friend
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-200 bg-white">Add Friend</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Search input */}
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search by username..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8 bg-slate-800 border-slate-700 text-slate-200 placeholder:text-slate-400"
            />
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="text-center py-4">
              <p className="text-slate-400">Searching...</p>
            </div>
          )}

          {/* Search results */}
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {searchResults.length === 0 && searchTerm.length >= 3 && !isLoading ? (
              <p className="text-slate-400 text-center py-4">No users found</p>
            ) : (
              searchResults.map((user) => (
                <div 
                  key={user._id}
                  className="flex items-center justify-between p-2 bg-slate-800 rounded-lg"
                >
                  <span className="text-slate-200">{user.username}</span>
                  <Button
                    size="sm"
                    onClick={() => handleSendRequest(user._id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Send Request
                  </Button>
                </div>
              ))
            )}
          </div>

          {/* Search hint */}
          {searchTerm.length < 3 && (
            <p className="text-sm text-slate-400 text-center">
              Type at least 3 characters to search
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddFriendDialog;
