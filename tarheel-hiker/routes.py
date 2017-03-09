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
    
    from models import Hike, Media, Node
    
    api.add_resource(Hike,
        '/h/',
        '/h/<string:hike_slug>')
        
        
    api.add_resource(Media,
        '/m/',
        '/m/<string:media_id>')
        
    api.add_resource(Node,
        '/n/',
        '/n/<string:node_id>')
