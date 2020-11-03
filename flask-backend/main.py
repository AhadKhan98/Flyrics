import flask
import os
from flask import request, url_for, redirect

import audio_processor

app = flask.Flask("__main__")
app.config["UPLOAD_FOLDER"] = "uploads/"


@app.route("/")  # Index Page
def my_index():
    return flask.render_template("index.html", token="index")


@app.route("/upload")  # Page to upload a file
def upload():
    return flask.render_template("upload.html", token="upload")


@app.route("/uploader", methods=["GET", "POST"])  # File upload handler
def upload_file():
    if request.method == "POST":
        file = request.files["file"]
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], file.filename))
        return redirect(url_for('start_process', filename=file.filename))
    return flask.render_template("upload_fail.html", token="fail")


@app.route("/start-process/<filename>")
def start_process(filename):
    print("FILENAME WAS", filename)
    audio_processor.separate_audio(filename)
    return flask.render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
