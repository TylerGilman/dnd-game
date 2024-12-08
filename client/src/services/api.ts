const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  async getProfile(username: string, token?: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/profiles/${username}`, {
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch profile');
    }

    return response.json();
  },

  async login(email: string, password: string) {
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
  },

  async createCampaign(data: { title: string; description: string; content: string }, token: string) {
    console.log('Creating campaign with:', { ...data, token: 'REDACTED' }); // Safe debug log
    
    const response = await fetch(`${API_URL}/api/campaigns/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Campaign creation failed:', error);
      throw new Error(error.error || 'Failed to create campaign');
    }

    return response.json();
  },

  async getCampaigns(token?: string) {
    const headers: Record<string, string> = {
      'Accept': 'application/json'
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api/campaigns`, {
      headers
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to fetch campaigns');
    }

    return response.json();
  }
};
