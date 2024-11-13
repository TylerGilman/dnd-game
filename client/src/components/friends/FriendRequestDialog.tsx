import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface FriendRequest {
  _id: string;
  sender: {
    _id: string;
    username: string;
  };
  createdAt: string;
}

interface FriendRequestsDialogProps {
  requests: FriendRequest[];
  onAccept: (requestId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

const FriendRequestsDialog: React.FC<FriendRequestsDialogProps> = ({
  requests,
  onAccept,
  onReject,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const handleAccept = async (requestId: string) => {
    setLoadingStates(prev => ({ ...prev, [requestId]: true }));
    try {
      await onAccept(requestId);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleReject = async (requestId: string) => {
    setLoadingStates(prev => ({ ...prev, [requestId]: true }));
    try {
      await onReject(requestId);
    } finally {
      setLoadingStates(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
      }
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    }
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="relative text-slate-200 hover:text-white hover:bg-slate-800"
        >
          <Bell className="h-4 w-4" />
          {requests.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full text-xs flex items-center justify-center">
              {requests.length}
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-slate-200">
            Friend Requests
            {requests.length > 0 && (
              <span className="ml-2 text-sm text-slate-400">
                ({requests.length})
              </span>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-slate-400">No pending friend requests</p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div 
                  key={request._id}
                  className="flex flex-col bg-slate-800 rounded-lg p-3 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-200 font-medium">
                        {request.sender.username}
                      </p>
                      <p className="text-sm text-slate-400">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-green-600 hover:text-white"
                        onClick={() => handleAccept(request._id)}
                        disabled={loadingStates[request._id]}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="hover:bg-red-600 hover:text-white"
                        onClick={() => handleReject(request._id)}
                        disabled={loadingStates[request._id]}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                  {loadingStates[request._id] && (
                    <div className="text-center text-sm text-slate-400">
                      Processing...
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FriendRequestsDialog;
