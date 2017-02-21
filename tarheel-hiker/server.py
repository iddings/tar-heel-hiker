from flask import Flask
from flask_restful import Api
from os import getenv

from routes import register_api, register_routes

IP = getenv("IP")
PORT = int(getenv("PORT"))

app = Flask(__name__)
api = Api(app)
    
register_routes(app)
register_api(api)

if __name__ == "__main__":
    app.run(debug=True, host=IP, port=PORT)