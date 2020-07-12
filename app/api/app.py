from flask import Flask, request, Response, json
from flask_pymongo import PyMongo
from flask_cors import CORS
from color_manager import ColorRequestManager
from cluster_manager import ClusterManager
from dotenv import load_dotenv
import itertools
import os

load_dotenv()
mongo_uri = os.getenv("MONGO")

app = Flask(__name__)
CORS(app)
app.config["MONGO_URI"] = mongo_uri
mongo = PyMongo(app)

db = mongo.cx.music  # get to db via MongoClient
clusterer = ClusterManager()
NEXT_ID = 0


def generate_album(doc):
    album = dict()

    global NEXT_ID
    album["id"] = NEXT_ID
    NEXT_ID += 1

    album["name"] = doc["album"]
    album["artist"] = doc["artist"]
    album["year"] = doc["year"]
    album["genres"] = doc["genres"]
    album["spotifyUrl"] = doc["spotify_url"]
    album["palette"] = doc["palette"]
    album["artworkUrl"] = doc["artwork"]
    album["popularity"] = doc["popularity"]

    return album


def cursor_to_album_components(cursor, albums_already_seen=None):
    albums = []
    if albums_already_seen is None:
        album_representations = set()
    else:
        album_representations = albums_already_seen

    if type(cursor) == dict:
        albums.append(generate_album(cursor))
    else:
        for doc in cursor:
            album_representation = (
                doc["album"],
                doc["artist"]
            )  # if this is a duplicate album ignore
            if not album_representation in album_representations:
                album_representations.add(album_representation)
                albums.append(generate_album(doc))

    return albums


@app.route("/api/image", methods=["POST"])
def image():
    image_data = request.get_data()
    palette = clusterer.fit_from_bytes(image_data)
    return {
        "data": palette
    }


@app.route("/api/search", methods=["POST"])
def search():
    cursor = db.albums.find(request.json["filter"], {
                            'score': {'$meta': 'textScore'}})
    cursor.sort([('score', {'$meta': 'textScore'})])
    response = cursor_to_album_components(cursor)
    return Response(json.dumps(response), mimetype='application/json')


@app.route("/api/aggregate", methods=["POST"])
def aggregate():
    genre = request.json["genre"].lower()
    if genre == "All Genres":
        cursor = db.albums.aggregate([{"$sample": {"size": 1000}}])
    else:
        cursor = db.albums.aggregate(
            [{"$match": {"genres": genre}}, {"$sample": {"size": 1000}}])
    response = cursor_to_album_components(cursor)
    return Response(json.dumps(response), mimetype='application/json')


@app.route("/api/palette_search", methods=["POST"])
def palette_search():
    colors = request.json["colors"]
    genre = request.json["genre"]
    num_colors = len(colors)
    albums_already_seen = set()
    response = {
        "data": [],
        "titles": []
    }

    perfect_match_api_request = ColorRequestManager.hex_list_to_query(colors)
    if genre != "All Genres":
        perfect_match_api_request = {
            "$and": [{"genres": genre}, perfect_match_api_request]}
    perfect_match_cursor = db.albums.find(
        perfect_match_api_request).limit(2000)
    perfect_match_response = cursor_to_album_components(
        perfect_match_cursor, albums_already_seen=albums_already_seen)

    if len(perfect_match_response) == 0:
        response["data"].append([])
        response["titles"].append("No Perfect Matches")
        if num_colors > 1:  # also query subsets to find partial matches
            subsets = list(itertools.combinations(colors, num_colors-1))
            partial_match_response = []
            for subset in subsets:
                subset_list = list(subset)
                partial_match_api_request = ColorRequestManager.hex_list_to_query(
                    subset_list)
                if genre != "All Genres":
                    partial_match_api_request = {
                        "$and": [{"genres": genre}, partial_match_api_request]}
                partial_match_cursor = db.albums.find(
                    partial_match_api_request).limit(2000)
                partial_match_response.extend(cursor_to_album_components(
                    partial_match_cursor, albums_already_seen=albums_already_seen))

        response["data"].append(partial_match_response)
        if len(partial_match_response) == 0:
            response["titles"].append("No Partial Matches")
        else:
            response["titles"].append("Partial Matches")
    else:
        response["data"].append(perfect_match_response)
        response["titles"].append("Perfect Matches")

    return Response(json.dumps(response), mimetype='application/json')
