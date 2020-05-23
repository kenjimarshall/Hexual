from pymongo import MongoClient
from dotenv import load_dotenv
import os
load_dotenv()

mongo_uri = os.getenv("MONGO")


class Connect(object):
    @staticmethod
    def get_connection():
        return MongoClient(mongo_uri)
