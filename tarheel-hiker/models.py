from bson.objectid import ObjectId
from flask import send_from_directory
from flask_restful import reqparse, Resource
from pymongo import cursor, MongoClient

SCHEMA_VERSION = '0.1'

mongo = MongoClient()
hiker = mongo.hiker

NO_ID = {"_id": 0}

# monkey patch JSONEncoder
from json import JSONEncoder

def default_patch(self, o):
    try:
        assert isinstance(o, ObjectId)
        return str(o)
    except AssertionError:
        return self._default(o)

JSONEncoder._default = JSONEncoder.default
JSONEncoder.default = default_patch

class Hike(Resource):
    
    def get(self, hike_slug=None):
        if hike_slug:
            return self.hike_overview(hike_slug)
        return "search hikes!"
        
    def hike_overview(self, hike_slug):
        return hiker.hikes.find({"slug": hike_slug})[0]

class Node(Resource):
    
    def get(self, node_id=None):
        if node_id is not None:
            return self.get_node(node_id)
        return "search nodes!"
        
    def get_node(self, node_id):
        return hiker.nodes.find({"_id": ObjectId(node_id)})[0]