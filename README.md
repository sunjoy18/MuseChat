# Music Chat App

A mobile application that combines music discovery with social interaction. Users can discover music, chat about their favorite tracks, and get personalized recommendations.

## Features

- **Music Discovery**
  - Search and browse music tracks
  - Get personalized recommendations based on preferences
  - Preview songs using Spotify integration
  - View track details and album artwork

- **Chat System**
  - Interactive chat interface for music discussions
  - Music-focused commands and recommendations
  - Real-time responses for music queries

- **User System**
  - User authentication (login/register)
  - Personalized music preferences
  - Genre selection
  - Profile customization

## Tech Stack

- **Frontend**
  - React Native
  - Expo
  - TypeScript
  - Expo Router
  - Expo AV (for audio playback)

- **Backend**
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

- **APIs**
  - Spotify API (music previews and metadata)

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB
- Spotify Developer Account

### Installation

1. Clone the repository

2. Install dependencies
   Install backend dependencies
    cd backend
    npm install
  Install frontend dependencies
    cd ../music-chat-app
    npm install
3. Set up environment variables
  Backend (.env):
    PORT=5000
    MONGODB_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    SPOTIFY_CLIENT_ID=your_spotify_client_id
    SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
  Frontend (.env): 
    EXPO_PUBLIC_API_URL=http://your_backend_url:5000

**Start backend server**
cd backend
npm start

**Start Expo development server**
cd ../music-chat-app
npm start



## Usage

1. Register a new account or login
2. Set your music preferences in the profile section
3. Browse music recommendations
4. Use the chat interface with commands like:
   - "recommend genre:rock"
   - "search Bohemian Rhapsody"
   - "recommend similar to Artist - Track"
