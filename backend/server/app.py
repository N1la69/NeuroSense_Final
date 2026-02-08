from flask import Flask
from server.routes import api 

app = Flask(__name__)

app.register_blueprint(api, url_prefix="/api")

@app.route("/")
def home():
    return {"status": "NeuroSense API running"}

if __name__ == "__main__":
    app.run(debug=True)
