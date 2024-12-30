const axios = require('axios');

class SpotifyService {
  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID;
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  async getAccessToken() {
    if (this.accessToken && this.tokenExpiry > Date.now()) {
      return this.accessToken;
    }

    try {
      const response = await axios.post('https://accounts.spotify.com/api/token', 
        'grant_type=client_credentials', {
        headers: {
          'Authorization': `Basic ${Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      this.accessToken = response.data.access_token;
      this.tokenExpiry = Date.now() + (response.data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      console.error('Spotify token error:', error);
      throw error;
    }
  }

  async searchTrack(name, artist) {
    try {
      const token = await this.getAccessToken();
      const response = await axios.get('https://api.spotify.com/v1/search', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: {
          q: `track:${name} artist:${artist}`,
          type: 'track',
          limit: 1
        }
      });

      const track = response.data.tracks.items[0];
      return track ? {
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls.spotify,
        albumArt: track.album.images[0]?.url
      } : null;
    } catch (error) {
      console.error('Spotify search error:', error);
      return null;
    }
  }
}

module.exports = new SpotifyService(); 