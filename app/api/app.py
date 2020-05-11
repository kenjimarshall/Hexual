from flask import Flask, request, Response, json
from flask_pymongo import PyMongo
from flask_bootstrap import Bootstrap

app = Flask(__name__)
Bootstrap(app)
app.config["MONGO_URI"] = "mongodb+srv://kenji:alexachung#1@hexualdb-yhauo.mongodb.net/test?retryWrites=true&w=majority"
mongo = PyMongo(app)
db = mongo.cx.data  # get to db via MongoClient
NEXT_ID = 0


def generate_album(doc, palette_size):
    album = dict()

    global NEXT_ID
    album["id"] = NEXT_ID
    NEXT_ID += 1
    print(doc)

    album["name"] = doc["album"]
    album["artist"] = doc["artist"]
    album["year"] = doc["year"]
    album["genres"] = doc["genres"]
    album["spotifyUrl"] = doc["spotify_url"]
    album["palette"] = doc["palettes"][palette_size]
    album["artworkUrl"] = doc["artwork"]
    album["popularity"] = doc["popularity"]

    return album


def cursor_to_album_components(palette_size, cursor, albums_already_seen=None):
    albums = []
    if albums_already_seen == None:
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


@app.route("/search", methods=["POST"])
def search():
    palette_size = request.json['paletteSize']
    cursor = db.albums.find(request.json["filter"])
    response = cursor_to_album_components(palette_size, cursor)
    return Response(json.dumps(response), mimetype='application/json')


@app.route("/aggregate", methods=["POST"])
def aggregate():
    aggregate_filter = request.json["filter"]
    palette_size = request.json['paletteSize']
    if aggregate_filter == None:
        cursor = db.albums.aggregate([{"$sample": {"size": 50}}])
    else:
        cursor = db.albums.aggregate(
            [{"$match": aggregate_filter}, {"$sample": {"size": 50}}])
    response = cursor_to_album_components(palette_size, cursor)
    print(response)
    return Response(json.dumps(response), mimetype='application/json')


@app.route("/palette_search", methods=["POST"])
def palette_search():
    complete_filter = request.json["filter"]
    partial_filter = request.json["partialFilter"]
    palette_size = request.json["paletteSize"]
    print(complete_filter, partial_filter, palette_size)
    albums_already_seen = set()
    response = {
        "data": [],
        "titles": []
    }
    perfect_match_response = cursor_to_album_components(palette_size,
                                                        db.albums.find(
                                                            complete_filter),
                                                        albums_already_seen=albums_already_seen)
    print(perfect_match_response)
    if len(perfect_match_response) == 0:
        response["data"].append([])
        response["titles"].append("No perfect matches :(")
    else:
        response["data"].append(perfect_match_response)
        response["titles"].append("Perfect Matches")

    if partial_filter != None:
        print("finding partial matches...")
        partial_match_response = cursor_to_album_components(palette_size,
                                                            db.albums.find(
                                                                partial_filter),
                                                            albums_already_seen=albums_already_seen)
        print(partial_match_response)

        if len(partial_match_response) == 0:
            response["data"].append([])
            response["titles"].append("No partial matches :(")
        else:
            response["data"].append(partial_match_response)
            response["titles"].append("Partial Matches")

    print(response)
    return response
