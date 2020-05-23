import spotipy
from dotenv import load_dotenv
import os
from spotipy.oauth2 import SpotifyClientCredentials

load_dotenv()
client_id = os.getenv("SPOT_ID")
client_secret = os.getenv("SPOT_SECRET")


class SpotifyConnection(object):

    def __init__(self):
        client_id = client_id
        client_secret = client_secret
        client_credentials_manager = SpotifyClientCredentials(client_id=client_id,
                                                              client_secret=client_secret)

        self.sp = spotipy.Spotify(
            client_credentials_manager=client_credentials_manager)

    def search_artist(self, artist):
        result = self.sp.search(q=artist, limit=1, type="artist", market="CA")
        return result

    def get_artist_albums(self, artist_id):
        result = self.sp.artist_albums(
            artist_id, limit=50, album_type="album", country="CA")
        return result
