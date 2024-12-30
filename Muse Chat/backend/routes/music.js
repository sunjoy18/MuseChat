const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const LastFM = require('../services/lastfm');
const Spotify = require('../services/spotify');

// Get music recommendations
router.get('/recommendations', auth, async (req, res) => {
  try {
    const { query, genre, artist, track } = req.query;
    console.log('Query params:', { query, genre, artist, track });

    let recommendations = [];

    if (query) {
      // Search for tracks if query parameter exists
      recommendations = await LastFM.searchTracks(query);
    } else if (genre) {
      // Get recommendations by genre
      recommendations = await LastFM.getTopTracks(genre);
    } else if (artist && track) {
      // Get similar tracks
      recommendations = await LastFM.getSimilarTracks(track, artist);
    } else {
      // Default to top chart tracks
      recommendations = await LastFM.getTopChartTracks();
    }

    // Add Spotify preview URLs and format response
    const formattedRecommendations = await Promise.all(
      recommendations.map(async track => {
        const spotifyData = await Spotify.searchTrack(track.name, track.artist.name || track.artist);
        return {
          id: track.mbid || String(Math.random()),
          name: track.name,
          artist: track.artist.name || track.artist,
          imageUrl: spotifyData?.albumArt || 
            track.image?.[3]?.['#text'] ||
            track.image?.[2]?.['#text'] ||
            'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
          previewUrl: spotifyData?.previewUrl || null,
          spotifyUrl: spotifyData?.spotifyUrl || null
        };
      })
    );

    res.json(formattedRecommendations);
  } catch (error) {
    console.error('Recommendations error:', error);
    res.status(500).json({ 
      message: 'Failed to fetch recommendations',
      details: error.message 
    });
  }
});

// Search tracks
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    console.log('Searching for:', query);
    const tracks = await LastFM.searchTracks(query);

    // Add Spotify preview URLs and format response
    const formattedTracks = await Promise.all(
      tracks.map(async track => {
        const spotifyData = await Spotify.searchTrack(track.name, track.artist);
        return {
          id: track.mbid || String(Math.random()),
          name: track.name,
          artist: track.artist,
          imageUrl: spotifyData?.albumArt || 
            track.image?.[3]?.['#text'] ||
            track.image?.[2]?.['#text'] ||
            'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png',
          previewUrl: spotifyData?.previewUrl || null,
          spotifyUrl: spotifyData?.spotifyUrl || null
        };
      })
    );

    res.json(formattedTracks);
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      message: 'Failed to search tracks',
      details: error.message 
    });
  }
});

// Test endpoint to verify Last.fm API connection
router.get('/test', auth, async (req, res) => {
  try {
    if (!process.env.LASTFM_API_KEY) {
      throw new Error('Last.fm API key not configured');
    }

    // Try to get top tracks as a test
    const tracks = await LastFM.getTopChartTracks(1);
    res.json({ 
      status: 'success', 
      message: 'Last.fm API connection successful',
      sample: tracks[0]
    });
  } catch (error) {
    console.error('API test error:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Last.fm API test failed',
      details: error.message
    });
  }
});

module.exports = router; 