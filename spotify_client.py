import spotipy
from spotipy.oauth2 import SpotifyClientCredentials


class SpotifyConnection(object):

    def __init__(self):
        client_id = "7f84a16e5e3040648c4b56566dda6fab"
        client_secret = "13f843ff01e049089717d250eb555e45"
        client_credentials_manager = SpotifyClientCredentials(client_id=client_id,
                                                              client_secret=client_secret)

        self.sp = spotipy.Spotify(
            client_credentials_manager=client_credentials_manager)

    def search_artist(self, artist):
        result = self.sp.search(q=artist, limit=5, type="artist", market="CA")
        return result

    def get_artist_albums(self, artist_id):
        result = self.sp.artist_albums(
            artist_id, limit=50, album_type="album", country="CA")
        return result
