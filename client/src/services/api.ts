const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const api = {
  async login(email: string, password: string) {
    console.log('Login request to:', `${API_URL}/api/auth/login`); // Debug log
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to login');
    }
    
    return response.json();
  },

  async register(username: string, email: string, password: string) {
    console.log('Register request to:', `${API_URL}/api/auth/register`); // Debug log
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, email, password })
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to register');
    }
    
    return response.json();
  }
};
