from pymongo import MongoClient


class Connect(object):
    @staticmethod
    def get_connection():
        return MongoClient("mongodb+srv://kenji:alexachung#1@hexualdb-yhauo.mongodb.net/test?retryWrites=true&w=majority")
