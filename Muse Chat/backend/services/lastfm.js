const axios = require('axios');

class LastFMService {
  constructor() {
    this.apiKey = process.env.LASTFM_API_KEY;
    this.baseURL = 'http://ws.audioscrobbler.com/2.0/';
  }

  async makeRequest(method, params = {}) {
    try {
      const response = await axios.get(this.baseURL, {
        params: {
          method,
          api_key: this.apiKey,
          format: 'json',
          ...params,
        }
      });
      return response.data;
    } catch (error) {
      console.error(`LastFM API error (${method}):`, error.response?.data || error.message);
      throw error;
    }
  }

  // Helper method to get the best quality image
  getBestImage(images) {
    if (!images || !Array.isArray(images)) return null;
    // Last.fm image sizes: small, medium, large, extralarge
    const preferredSize = images.find(img => img.size === 'extralarge');
    if (preferredSize && preferredSize['#text']) {
      return preferredSize['#text'];
    }
    // Fallback to any available image
    const anyImage = images.find(img => img['#text']);
    return anyImage ? anyImage['#text'] : null;
  }

  // Track Methods
  async searchTracks(query, limit = 10) {
    const data = await this.makeRequest('track.search', { track: query, limit });
    return data.results.trackmatches.track.map(track => ({
      ...track,
      imageUrl: this.getBestImage(track.image) || 'https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png'
    }));
  }

  async getTrackInfo(track, artist) {
    return this.makeRequest('track.getInfo', { track, artist });
  }

  async getSimilarTracks(track, artist, limit = 10) {
    const data = await this.makeRequest('track.getSimilar', { track, artist, limit });
    return data.similartracks.track;
  }

  // Artist Methods
  async searchArtists(query, limit = 10) {
    const data = await this.makeRequest('artist.search', { artist: query, limit });
    return data.results.artistmatches.artist;
  }

  async getArtistInfo(artist) {
    return this.makeRequest('artist.getInfo', { artist });
  }

  async getArtistTopTracks(artist, limit = 10) {
    const data = await this.makeRequest('artist.getTopTracks', { artist, limit });
    return data.toptracks.track;
  }

  async getSimilarArtists(artist, limit = 10) {
    const data = await this.makeRequest('artist.getSimilar', { artist, limit });
    return data.similarartists.artist;
  }

  // Album Methods
  async searchAlbums(query, limit = 10) {
    const data = await this.makeRequest('album.search', { album: query, limit });
    return data.results.albummatches.album;
  }

  async getAlbumInfo(album, artist) {
    return this.makeRequest('album.getInfo', { album, artist });
  }

  // Tag Methods
  async getTopTracks(tag, limit = 10) {
    const data = await this.makeRequest('tag.getTopTracks', { tag, limit });
    return data.tracks.track;
  }

  async getTopArtists(tag, limit = 10) {
    const data = await this.makeRequest('tag.getTopArtists', { tag, limit });
    return data.topartists.artist;
  }

  // Chart Methods
  async getTopChartTracks(limit = 10) {
    const data = await this.makeRequest('chart.getTopTracks', { limit });
    return data.tracks.track;
  }

  async getTopChartArtists(limit = 10) {
    const data = await this.makeRequest('chart.getTopArtists', { limit });
    return data.artists.artist;
  }

  // Geo Methods
  async getTopTracksByCountry(country, limit = 10) {
    const data = await this.makeRequest('geo.getTopTracks', { country, limit });
    return data.tracks.track;
  }

  // User Methods (requires authentication)
  async getUserTopArtists(username, limit = 10) {
    const data = await this.makeRequest('user.getTopArtists', { user: username, limit });
    return data.topartists.artist;
  }

  async getUserTopTracks(username, limit = 10) {
    const data = await this.makeRequest('user.getTopTracks', { user: username, limit });
    return data.toptracks.track;
  }

  async getUserRecentTracks(username, limit = 10) {
    const data = await this.makeRequest('user.getRecentTracks', { user: username, limit });
    return data.recenttracks.track;
  }
}

module.exports = new LastFMService();