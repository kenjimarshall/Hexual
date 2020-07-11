import os
import argparse
import base64
import requests
import pickle as pkl
import numpy as np
from mongo_client import Connect
from spotify_client import SpotifyConnection
from palette_generator import PaletteGenerator

SPOT = SpotifyConnection()
MONGO_CLIENT = Connect.get_connection()
MONGO_DB = MONGO_CLIENT.music
CLUSTERER = PaletteGenerator()


def get_as_base64(url):
    return base64.b64encode(requests.get(url).content)


def generate_scheme(artist, popularity, album, artwork, num_clusters, palette, genres, year, lab_palette):
    return {
        'artist': artist,
        'popularity': popularity,
        'album': album,
        'artwork': artwork,
        'num_clusters': num_clusters,
        'palette': palette,
        'lab_palette': lab_palette,
        'genres': genres,
        'year': year
    }


def add_by_artist_name(artist_name, artists_visited):
    artist_search = SPOT.search_artist(artist_name)
    if "error" in artist_search:
        return
    for artist in artist_search['artists']['items']:
        artist_name = artist['name']
        artist_id = artist['id']
        if artist_name in artists_visited:
            print(artist_name, " already in set")
            continue
        else:

            artists_visited.add(artist_name)
            print("ARTIST: ", artist_name)
            popularity = artist['popularity']
            genres = artist['genres']
            artist_album_search = SPOT.get_artist_albums(artist_id)

            for album in artist_album_search['items']:
                album_name = album['name']
                if album['images']:
                    if len(album['images']) >= 2:  # see if artwork is stored
                        artwork = album['images'][1]['url']
                    else:
                        artwork = album['images'][0]['url']
                else:
                    print(album_name, " has no artwork available")
                    continue
                year = album['release_date'].split("-")[0]
                spotify_url = album['external_urls']['spotify']

                palettes = CLUSTERER.fit_from_url(artwork)
                hex_palette = palettes[0]
                lab_palette = palettes[1]
                while lab_palette.shape[0] < 4:
                    # duplicate first cluster
                    print("Missing clusters.")
                    print(lab_palette.shape)
                    lab_palette = np.vstack((lab_palette[0:], lab_palette))
                    print(lab_palette.shape)

                lab_for_mongo = [
                    {
                        "l": lab_palette[0, 0],
                        "a": lab_palette[0, 1],
                        "b": lab_palette[0, 2]
                    },
                    {
                        "l": lab_palette[1, 0],
                        "a": lab_palette[1, 1],
                        "b": lab_palette[1, 2]
                    },
                    {
                        "l": lab_palette[2, 0],
                        "a": lab_palette[2, 1],
                        "b": lab_palette[2, 2]
                    },
                    {
                        "l": lab_palette[3, 0],
                        "a": lab_palette[3, 1],
                        "b": lab_palette[3, 2]
                    }
                ]

                print("ALBUM: ", album_name, year, hex_palette)

                # insert entry
                MONGO_DB.albums.insert_one(
                    {"artist": artist_name,
                        "popularity": popularity,
                        "album": album_name,
                        "artwork": artwork,
                        "spotify_url": spotify_url,
                        "genres": genres,
                        "year": year,
                        "lab": lab_for_mongo,
                        "palette": hex_palette
                     }
                )
                with open("artists.pkl", "wb") as f_write:
                    pkl.dump(artists_visited, f_write)


def walk_over_images(directory_to_walk, artists_visited):
    for _, _, files in os.walk(directory_to_walk, topdown=False):
        for num, name in enumerate(files):
            print(num, name)
            artist_name_arr = name.split("_")
            if len(artist_name_arr) >= 3:
                artist_name = artist_name_arr[2]
            else:
                print("Unfamiliar title format. Skipping...")
                continue
            artist_name = " ".join(artist_name.split("-"))
            if artist_name:
                add_by_artist_name(artist_name, artists_visited)

    with open("artists.pkl", "wb") as f_write:
        pkl.dump(artists_visited, f_write)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()

    ap.add_argument(
        '-d', "--dir", help="directory to walk over", required=False)
    ap.add_argument(
        '-a', "--artists", help="pkl object containing set of artist IDs already visited", required=True)
    ap.add_argument(
        '-n', '--name', help="Artist name to add manually.")

    args = vars(ap.parse_args())

    if not ((args["dir"] and not args['name']) or (not args["dir"] and args["name"])):
        ap.error("Must
         pass either directory (-d) or artist name (-n)")

    with open(args['artists'], 'rb') as f:
        artists = pkl.load(f)

    if args["dir"]:
        directory = args['dir']
        walk_over_images(directory, artists)
    elif args["name"]:
        artist_name = args["name"]
        add_by_artist_name(artist_name, artists)
