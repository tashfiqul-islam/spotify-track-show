const SpotifyWebApi = require('spotify-web-api-node');
require('dotenv').config();

/**
 * A client for interacting with the Spotify Web API.
 * Handles authentication and provides methods to fetch popular tracks from a set of predefined playlists.
 */
class SpotifyClient {
  constructor() {
    this.spotifyApi = new SpotifyWebApi({
      clientId: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
    });

    // A set of known popular playlists to rotate through.
    // These playlists are maintained by Spotify and are known to feature trending and popular tracks.
    this.popularPlaylists = [
      '37i9dQZF1DXcBWIGoYBM5M', // Today's Top Hits
      '37i9dQZF1DX0XUsuxWHRQd', // RapCaviar
      '5ABHKGoOzxkaa28ttQV9sE', // Top 100 most streamed songs
      '0QN2m4k1Mwgv6XO2UoVuNn', // Most viewed
      '6IoAdfkxFwfTY4Ug7TVRMY', // Most played
      '4kv1Yh7OWXNLLpBKRFXfE7', //
      // Add more playlist IDs as needed to diversify the selection pool.
    ];
  }

  /**
   * Authenticates with the Spotify API using Client Credentials Flow.
   * This flow is suitable for server-to-server requests where user data is not accessed.
   */
  async authenticate() {
    try {
      const data = await this.spotifyApi.clientCredentialsGrant();
      this.spotifyApi.setAccessToken(data.body['access_token']);
    } catch (error) {
      console.error('Failed to authenticate with Spotify:', error);
      throw error; // Rethrow to allow caller to handle authentication errors
    }
  }

  /**
   * Fetches a random track from a selection of popular playlists.
   * @returns {Promise<string>} - A promise that resolves to the name and artist of the randomly selected track.
   */
  async getRandomTopTrack() {
    try {
      await this.authenticate();

      // Randomly select a playlist ID from the available set.
      const playlistId =
        this.popularPlaylists[
          Math.floor(Math.random() * this.popularPlaylists.length)
        ];
      const response = await this.spotifyApi.getPlaylistTracks(playlistId, {
        limit: 5,
      });

      const tracks = response.body.items;
      if (!tracks.length) {
        throw new Error('No tracks found in the selected playlist.');
      }

      // Randomly select one of the top tracks from the playlist.
      const randomTrack =
        tracks[Math.floor(Math.random() * tracks.length)].track;
      return `${randomTrack.name} by ${randomTrack.artists
        .map((artist) => artist.name)
        .join(', ')}`;
    } catch (error) {
      console.error('Error fetching tracks from playlist:', error);
      throw error; // Rethrow to allow caller to handle fetching errors
    }
  }
}

module.exports = SpotifyClient;
