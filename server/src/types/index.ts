export interface User {
  id: string;
  isAdmin: boolean;
  username: string;
  email: string;
  password: string;
  following: User[];
}

export interface Game {
  id: string;
  name: string;
  dungeonMaster: string;
  players: string[];
  status: 'waiting' | 'active' | 'completed';
  currentScene: string;
}
