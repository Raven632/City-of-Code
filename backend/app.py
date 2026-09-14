from flask import Flask

app = Flask(__name__)

LEVELS = [
    {"nummer": 1, "title": "Der erste Eintrag", "building": "bauamt"},
    {"nummer": 2, "title": "Der Name der Stadt", "building": "ortsschild"},
]

@app.route("/api/ping")
def ping():
    return {"status": "ok"}

@app.route("/api/levels")
def levels():
    return {"levels": LEVELS}


if __name__ == "__main__":
    app.run(debug=True)