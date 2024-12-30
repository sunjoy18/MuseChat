const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const LastFM = require('../services/lastfm');

// Get chat history
router.get('/history', auth, async (req, res) => {
  try {
    // Implement chat history retrieval
    res.json({ messages: [] });
  } catch (error) {
    console.error('Chat history error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Send message
router.post('/message', auth, async (req, res) => {
  try {
    const { message } = req.body;
    console.log('Received message:', message);

    const command = message.toLowerCase();
    let response = '';

    try {
      if (command.includes('recommend')) {
        if (command.includes('genre:')) {
          const genre = command.split('genre:')[1].trim().split(' ')[0];
          const tracks = await LastFM.getTopTracks(genre);
          response = formatTrackList(`Here are some ${genre} recommendations:`, tracks);
        } else if (command.includes('similar to')) {
          const [artist, track] = command.split('similar to')[1].trim().split(' - ');
          const similarTracks = await LastFM.getSimilarTracks(track, artist);
          response = formatTrackList('Here are similar tracks:', similarTracks);
        }
      } 
      else if (command.includes('search')) {
        if (command.includes('artist:')) {
          const artist = command.split('artist:')[1].trim();
          const artists = await LastFM.searchArtists(artist);
          response = formatArtistList('Here are the artists I found:', artists);
        } else if (command.includes('album:')) {
          const album = command.split('album:')[1].trim();
          const albums = await LastFM.searchAlbums(album);
          response = formatAlbumList('Here are the albums I found:', albums);
        } else {
          const query = command.split('search')[1].trim();
          const tracks = await LastFM.searchTracks(query);
          response = formatTrackList('Here are the tracks I found:', tracks);
        }
      }
      else if (command.includes('top')) {
        if (command.includes('artists')) {
          const artists = await LastFM.getTopChartArtists();
          response = formatArtistList('Current top artists:', artists);
        } else if (command.includes('tracks')) {
          const tracks = await LastFM.getTopChartTracks();
          response = formatTrackList('Current top tracks:', tracks);
        }
      }
      else {
        response = `I can help you discover music! Try these commands:
- "recommend genre:rock"
- "recommend similar to Artist - Track"
- "search artist:Beatles"
- "search album:Abbey Road"
- "search Bohemian Rhapsody"
- "top artists"
- "top tracks"`;
      }
    } catch (error) {
      response = "Sorry, I couldn't process your request right now.";
      console.error('LastFM API error:', error);
    }

    res.json({ response });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ message: 'Failed to process message' });
  }
});

// Helper functions to format responses
function formatTrackList(title, tracks) {
  if (!tracks || tracks.length === 0) return 'No tracks found.';
  const trackList = tracks
    .slice(0, 5)
    .map(track => `• ${track.name} by ${track.artist.name || track.artist}`)
    .join('\n');
  return `${title}\n${trackList}`;
}

function formatArtistList(title, artists) {
  if (!artists || artists.length === 0) return 'No artists found.';
  const artistList = artists
    .slice(0, 5)
    .map(artist => `• ${artist.name}`)
    .join('\n');
  return `${title}\n${artistList}`;
}

function formatAlbumList(title, albums) {
  if (!albums || albums.length === 0) return 'No albums found.';
  const albumList = albums
    .slice(0, 5)
    .map(album => `• ${album.name} by ${album.artist}`)
    .join('\n');
  return `${title}\n${albumList}`;
}

module.exports = router;