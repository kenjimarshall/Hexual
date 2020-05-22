from flask import Flask, request, Response, json
from flask_pymongo import PyMongo
from flask_bootstrap import Bootstrap
from color_manager import ColorRequestManager
from cluster_manager import ClusterManager
import itertools


app = Flask(__name__)
Bootstrap(app)
app.config["MONGO_URI"] = "mongodb+srv://kenji:alexachung#1@hexualdb-yhauo.mongodb.net/test?retryWrites=true&w=majority"
mongo = PyMongo(app)
db = mongo.cx.music  # get to db via MongoClient
clusterer = ClusterManager()
NEXT_ID = 0


def generate_album(doc, palette_size):
    album = dict()

    global NEXT_ID
    album["id"] = NEXT_ID
    NEXT_ID += 1

    album["name"] = doc["album"]
    album["artist"] = doc["artist"]
    album["year"] = doc["year"]
    album["genres"] = doc["genres"]
    album["spotifyUrl"] = doc["spotify_url"]
    album["palette"] = doc["palette"][0:palette_size]
    album["artworkUrl"] = doc["artwork"]
    album["popularity"] = doc["popularity"]

    return album


def cursor_to_album_components(palette_size, cursor, albums_already_seen=None):
    albums = []
    if albums_already_seen is None:
        album_representations = set()
    else:
        album_representations = albums_already_seen

    if type(cursor) == dict:
        albums.append(generate_album(cursor, palette_size))
    else:
        for doc in cursor:
            album_representation = (
                doc["album"],
                doc["artist"]
            )  # if this is a duplicate album ignore
            if not album_representation in album_representations:
                album_representations.add(album_representation)
                albums.append(generate_album(doc, palette_size))

    return albums


@app.route("/image", methods=["POST"])
def image():
    image_data = request.get_data()
    palette = clusterer.fit_from_bytes(image_data)
    return {
        "data": palette
    }


@app.route("/search", methods=["POST"])
def search():
    palette_size = request.json['paletteSize']
    cursor = db.albums.find(request.json["filter"], {
                            'score': {'$meta': 'textScore'}})
    cursor.sort([('score', {'$meta': 'textScore'})])
    response = cursor_to_album_components(palette_size, cursor)
    return Response(json.dumps(response), mimetype='application/json')


@app.route("/aggregate", methods=["POST"])
def aggregate():
    aggregate_filter = request.json["filter"]
    palette_size = request.json['paletteSize']
    if aggregate_filter == None:
        cursor = db.albums.aggregate([{"$sample": {"size": 1000}}])
    else:
        cursor = db.albums.aggregate(
            [{"$match": aggregate_filter}, {"$sample": {"size": 1000}}])
    response = cursor_to_album_components(palette_size, cursor)
    return Response(json.dumps(response), mimetype='application/json')


@app.route("/palette_search", methods=["POST"])
def palette_search():
    colors = request.json["colors"]
    palette_size = request.json["paletteSize"]

    albums_already_seen = set()
    response = {
        "data": [],
        "titles": []
    }

    perfect_match_api_request = ColorRequestManager.hex_list_to_query(colors)
    perfect_match_cursor = db.albums.find(perfect_match_api_request)
    perfect_match_response = cursor_to_album_components(
        palette_size, perfect_match_cursor, albums_already_seen=albums_already_seen)

    if len(perfect_match_response) == 0:
        response["data"].append([])
        response["titles"].append("No Perfect Matches :(")
    else:
        response["data"].append(perfect_match_response)
        response["titles"].append("Perfect Matches")

    if palette_size > 1:
        subsets = list(itertools.combinations(colors, palette_size-1))
        partial_match_response = []
        for subset in subsets:
            subset_list = list(subset)
            subset_list.append(subset[-1])  # duplicate last color
            partial_match_api_request = ColorRequestManager.hex_list_to_query(
                subset_list)
            partial_match_cursor = db.albums.find(partial_match_api_request)
            partial_match_response.extend(cursor_to_album_components(
                palette_size, partial_match_cursor, albums_already_seen=albums_already_seen))

        response["data"].append(partial_match_response)
        if len(partial_match_response) == 0:
            response["titles"].append("No Partial Matches :(")
        else:
            response["titles"].append("Partial Matches")

    return Response(json.dumps(response), mimetype='application/json')
