from flask import Flask
from flask_pymongo import PyMongo
from flask_bootstrap import Bootstrap


app = Flask(__name__)
Bootstrap(app)
app.config["MONGO_URI"] = "mongodb+srv://kenji:alexachung#1@hexualdb-yhauo.mongodb.net/test?retryWrites=true&w=majority"
mongo = PyMongo(app)
db = mongo.cx.data  # get to db via MongoClient


@app.route("/")
def home_page():
    cursor = db.albums.find_one({})
    # otherwise of type ObjectID which isn't JSON serializable
    cursor['_id'] = str(cursor["_id"])
    print(cursor)
    return cursor
