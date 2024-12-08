export interface User {
  id: string;
  isAdmin: boolean;
  username: string;
  email: string;
  password: string;
  following: User[];
}

//
// export interface Game {
//   id: string;
//   name: string;
//   dungeonMaster: string;
//   players: string[];
//   status: 'waiting' | 'active' | 'completed';
//   currentScene: string;
// }

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
}

export interface Comment {
  id: string;
  user: User;
  post: Post;
  content: string;
  createdAt: number;
}