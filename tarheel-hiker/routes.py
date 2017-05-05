def register_routes(app):

    import os.path
    
    from os import getenv
        
    from flask import render_template, send_from_directory
        
    @app.route('/asset/<path:filename>')
    def static_files(filename):
        return send_from_directory(app.static_folder, filename)
        
    @app.route('/node_modules/<path:path>')
    def node_modules(path):
        return send_from_directory(os.path.join('..', 'node_modules'), path)
        
    @app.route('/')
    @app.route('/hike/')
    @app.route('/hike/<path:path>')
    def index(path=None):
        is_dev = getenv("THH_ENV") == "dev"
        return render_template('index.html', DEV_ENV=is_dev)
        
def register_api(api):
    
    from flask import abort, jsonify
    from flask_restful import reqparse, Resource
    from sqlalchemy.orm import sessionmaker
    from sqlalchemy import create_engine
    
    #from constants import api
    from models import Hike

    engine = create_engine("mysql://root:tarheels2009@localhost/hiker")
    
    Session = sessionmaker(bind=engine)
    
    def catch_errors(fn):
        def wrapper(self, hike_slug=None):
            res = fn(self, hike_slug)
            return res if res else abort(404)
        return wrapper
    
    class HikeREST(Resource):
        
        @catch_errors
        def get(self, hike_slug=None):
            if hike_slug == "top":
                return Session().query(Hike).join(Hike.location).limit(10).all()
            elif hike_slug:
                return self.hike_overview(hike_slug)
            else:
                # TODO: Implement search
                return abort(501)

        def hike_overview(self, hike_slug):
            session = Session()
            result = session.query(Hike).join(Hike.location).join(Hike.collections).filter(Hike.slug == hike_slug).first()
            json_result = jsonify(result)
            session.close()
            return json_result
    
    api.add_resource(HikeREST,
        '/h/',
        '/h/<string:hike_slug>')
        