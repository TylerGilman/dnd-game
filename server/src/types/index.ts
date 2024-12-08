export interface User {
  id: string;
  isAdmin: boolean;
  username: string;
  email: string;
  tagline: string;
  password: string;
  following: User[];
}

// TODO: image of each post
export interface Post {
  pid: number;
  id: string;
  user: User;
  title: string;
  description: string;
  setup: string;
  upvoteBy: User[];
  isHidden: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Comment {
  id: string;
  user: User;
  post: Post;
  content: string;
  createdAt: number;
  updatedAt: number;
}