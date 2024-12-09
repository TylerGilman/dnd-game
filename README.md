# The Adventurer's Tavern 🍺

A medieval-themed web application for creating and sharing D&D campaigns. Built with React, TypeScript, Express, and MongoDB.

## 🗺️ Overview

The Adventurer's Tavern is a platform where Dungeon Masters and storytellers can share their campaign ideas, get feedback from the community, and find inspiration for their next adventure. With a cozy tavern aesthetic, users can:

- Create and share campaign ideas
- Browse other campaigns
- Upvote interesting campaigns
- Search through the archives
- Manage their profile
- Follow other storytellers

## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Shadcn/UI Components
- React Query
- React Router DOM
- Lucide React Icons

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

### Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/adventurers-tavern.git
cd adventurers-tavern
```

2. Create environment files:

For the client (client/.env):
```env
VITE_API_URL=http://localhost:3000
```

For the server (server/.env):
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/dnd-game
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Development Setup

1. Install dependencies:
```bash
# Install client dependencies
cd client
npm install

# Install server dependencies
cd ../server
npm install
```

2. Start MongoDB:
```bash
# Make sure MongoDB is running on your system
mongod
```

3. Run the development servers:
```bash
# Start the backend server (from the server directory)
npm run dev

# Start the frontend development server (from the client directory)
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

### Production Deployment

1. Build the frontend:
```bash
cd client
npm run build
```

2. Configure production environment variables for both frontend and backend

3. Start the production server:
```bash
cd ../server
npm run start
```

## 📚 Database Schema

### User Collection
```typescript
{
  _id: ObjectId,
  username: string,      // unique
  email: string,         // unique
  password: string,      // hashed
  tagline: string,
  isAdmin: boolean,
  following: ObjectId[], // References User
  createdAt: Date,
  updatedAt: Date
}
```

### Campaign Collection
```typescript
{
  _id: ObjectId,
  cid: number,          // auto-incrementing
  user: ObjectId,       // References User
  title: string,
  description: string,
  content: string,
  upvotes: ObjectId[],  // References User
  isHidden: boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Collection
```typescript
{
  _id: ObjectId,
  user: ObjectId,       // References User
  campaign: ObjectId,   // References Campaign
  content: string,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/add-follower` - Follow a user
- `POST /api/auth/remove-follower` - Unfollow a user

### Campaigns
- `GET /api/campaigns` - Get all campaigns
- `GET /api/campaigns/:cid` - Get specific campaign
- `POST /api/campaigns/create` - Create new campaign
- `PUT /api/campaigns/:cid` - Update campaign
- `DELETE /api/campaigns/:cid` - Delete campaign
- `POST /api/campaigns/:cid/upvote` - Toggle upvote
- `GET /api/campaigns/search` - Search campaigns

### Profiles
- `GET /api/profiles/:username` - Get user profile
- `GET /api/profiles/:username/followers` - Get user followers

### Comments
- `POST /api/comments/create` - Create comment
- `GET /api/comments/campaign/:cid` - Get campaign comments
- `PUT /api/comments/update` - Update comment
- `DELETE /api/comments/delete` - Delete comment

## 🎨 Styling

The application uses a medieval tavern theme with:
- Warm, wood-inspired colors
- Parchment-style backgrounds
- Scroll and wooden sign design elements
- Snow effects for winter theme
- Responsive design for all screen sizes

Color Palette:
```
Primary Brown: #8B4513
Secondary Brown: #654321
Background Dark: #2c1810
Parchment: #f4e4bc
Accent Gold: #DEB887
```

## 🔐 Security

- Passwords are hashed using bcrypt
- JWT for authentication
- Protected routes on both frontend and backend
- XSS protection through React's built-in escaping
- CORS configured for security
- Rate limiting on API endpoints
- Input validation and sanitization

## 🧪 Testing

To run tests:
```bash
# Run frontend tests
cd client
npm run test

# Run backend tests
cd server
npm run test
```

## 📝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Shadcn/UI for the beautiful component library
- The D&D community for inspiration
- All contributors who helped bring this project to life
## 🛠️ Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Query
- React Router DOM
- Lucide React Icons

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Socket.IO
