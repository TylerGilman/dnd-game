export interface User {
  _id: string;
  username: string;
  email: string;
  friends: string[];
  gameInvites: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}
