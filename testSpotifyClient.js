const SpotifyClient = require('../src/spotifyClient'); // Adjust the path as necessary

async function testSpotifyClient() {
  const spotifyClient = new SpotifyClient();
  try {
    const track = await spotifyClient.getRandomTopTrack();
    console.log('Random Top Track:', track);
  } catch (error) {
    console.error('Error fetching top track:', error);
  }
}

testSpotifyClient();
