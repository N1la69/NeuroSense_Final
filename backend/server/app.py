from flask import Flask
from server.routes import api 
from server.auth import auth_api
from server.dashboard import dash_api

app = Flask(__name__)

app.register_blueprint(api, url_prefix="/api")
app.register_blueprint(auth_api, url_prefix="/api")
app.register_blueprint(dash_api, url_prefix="/api")

@app.route("/")
def home():
    return {"status": "NeuroSense API running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
