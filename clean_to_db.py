import os
import argparse
import base64
import requests
import pickle as pkl
from mongo_client import Connect
from spotify_client import SpotifyConnection
from palette_generator import PaletteGenerator

SPOT = SpotifyConnection()
MONGO_CLIENT = Connect.get_connection()
MONGO_DB = MONGO_CLIENT.data
PALETTE_ONE_CLUSTER = PaletteGenerator(n_clusters=1)
PALETTE_TWO_CLUSTERS = PaletteGenerator(n_clusters=2)
PALETTE_THREE_CLUSTERS = PaletteGenerator(n_clusters=3)
PALETTE_FOUR_CLUSTERS = PaletteGenerator(n_clusters=4)


def get_as_base64(url):
    return base64.b64encode(requests.get(url).content)


def generate_scheme(artist, popularity, album, artwork, num_clusters, palette, genres, year):
    return {
        'artist': artist,
        'popularity': popularity,
        'album': album,
        'artwork': artwork,
        'num_clusters': num_clusters,
        'palette': palette,
        'genres': genres,
        'year': year
    }


def walk_over_images(directory_to_walk, artists_visited):
    for _, _, files in os.walk(directory_to_walk, topdown=False):
        for num, name in enumerate(files):
            print(num, name)
            artist_name = name.split("_")[2]
            artist_name = " ".join(artist_name.split("-"))
            if artist_name:
                artist_search = SPOT.search_artist(artist_name)
                if "error" in artist_search:
                    continue
                for artist in artist_search['artists']['items']:
                    artist_id = artist['id']
                    if artist_id in artists_visited:
                        print(artist['name'], " already in set")
                        continue
                    else:

                        artists_visited.add(artist_id)

                        artist_name_clean = artist['name']
                        print("ARTIST: ", artist_name_clean)
                        popularity = artist['popularity']
                        genres = artist['genres']
                        artist_album_search = SPOT.get_artist_albums(artist_id)

                        for album in artist_album_search['items']:
                            album_name = album['name']
                            if album['images']:  # see if artwork is stored
                                artwork = album['images'][1]['url']
                            else:
                                print(album_name, " has no artwork available")
                                continue
                            year = album['release_date'].split("-")[0]
                            spotify_url = album['external_urls']['spotify']

                            palettes = []

                            # generate clusters
                            for clusterer in [PALETTE_ONE_CLUSTER, PALETTE_TWO_CLUSTERS,
                                              PALETTE_THREE_CLUSTERS, PALETTE_FOUR_CLUSTERS]:

                                palettes.append(
                                    clusterer.fit_from_url(artwork))

                            print("ALBUM: ", album_name, year, palettes[3])

                            # insert entry
                            MONGO_DB.albums.insert_one(
                                {"artist": artist_name_clean,
                                 "popularity": popularity,
                                 "album": album_name,
                                 "artwork": artwork,
                                 "spotify_url": spotify_url,
                                 "genres": genres,
                                 "year": year,
                                 "palettes": {
                                     "one": palettes[0],
                                     "two": palettes[1],
                                     "three": palettes[2],
                                     "four": palettes[3]
                                 }
                                 }
                            )

            # every 50 files
            if num % 5 == 0:
                print("updating artist ID set...")
                with open("artists.pkl", "wb") as f_write:
                    pkl.dump(artists_visited, f_write)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument(
        '-d', "--dir", help="directory to walk over", required=True)
    ap.add_argument(
        '-a', "--artists", help="pkl object containing set of artist IDs already visited", required=True)
    args = vars(ap.parse_args())
    directory = args['dir']
    with open(args['artists'], 'rb') as f:
        artists = pkl.load(f)

    walk_over_images(directory, artists)
