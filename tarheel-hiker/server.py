from flask import Flask
from flask_restful import Api
from os import getenv

from routes import register_api, register_routes

IP = getenv("IP", "127.0.0.1")
PORT = int(getenv("PORT", "8080"))

app = Flask(__name__)
api = Api(app)
    
register_routes(app)
register_api(api)

def run():
    app.run(host=IP, port=PORT)

if __name__ == "__main__":
    run()
