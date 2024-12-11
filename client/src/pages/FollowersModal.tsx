import React from 'react';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {User} from "@/types/auth.ts";
import {User as UserIcon} from 'lucide-react';
import {useNavigate} from "react-router-dom";

interface Follower {
    username: string;
    _id: string;
    is_following: boolean;
    is_follower: boolean;
}

interface FollowersModalProps {
    isOpen: boolean;
    onClose: () => void;
    followers: Follower[];
    currentUser: User;
}

const FollowersModal: React.FC<FollowersModalProps> = ({isOpen, onClose, followers, currentUser}) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-full max-w-md bg-[#f4e4bc] rounded-lg shadow-lg border-4 border-[#8B4513]">
                <Card>
                    <CardHeader className="border-b-4 border-[#8B4513] bg-[#deb887] p-4">
                        <CardTitle className="text-xl font-serif font-bold text-[#8B4513]">
                            Followers
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                        {followers.length > 0 ? (
                            <ul className="space-y-4">
                                {followers.map((follower) => (
                                    <li
                                        key={follower._id}
                                        className="flex items-center justify-between bg-[#f4e4bc] p-3 rounded-lg border-2 border-[#8B4513]"
                                    >
                                        <div className="flex items-center gap-2" onClick={() => {
                                            navigate(`/profile/${follower.username}`)
                                            onClose()
                                        }}>
                                            <UserIcon className="h-6 w-6 text-[#8B4513]"/>
                                            <span className="text-[#8B4513] font-bold">{follower.username}</span>
                                        </div>

                                        <div className="flex items-center gap-4 text-[#8B4513] text-sm">
                                            {follower.username === currentUser?.username ? (
                                                <span className="font-semibold">You</span>
                                            ) : (
                                                <>
                                                    <span>{follower.is_following ? 'following' : 'not following'}</span>
                                                </>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-[#8B4513]">No followers to display.</p>
                        )}
                    </CardContent>
                    <div className="flex justify-end p-4 border-t-4 border-[#8B4513] bg-[#deb887]">
                        <Button onClick={onClose} className="bg-[#8B4513] text-[#f4e4bc] hover:bg-[#6b3410]">
                            Close
                        </Button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FollowersModal;
