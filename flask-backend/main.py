import flask
import os
from flask import request, url_for, redirect, jsonify

import audio_processor  # Manages converting audio into vocals, slowing and transcribing

app = flask.Flask("__main__")
app.config["UPLOAD_FOLDER"] = "uploads/"  # Default directory for all uploads


@app.route("/")  # Index Page
def my_index():
    return flask.render_template("index.html", token="index")


@app.route("/upload")  # Page to upload a file
def upload():
    return flask.render_template("upload.html", token="upload")


@app.route("/uploader", methods=["GET", "POST"])  # File upload handler
def upload_file():
    if request.method == "POST":  # If form was submitted with an audio file
        file = request.files["file"]
        filename = file.filename
        # Saves the file to the project
        file.save(os.path.join(app.config["UPLOAD_FOLDER"], file.filename))

    if (audio_processor.separate_audio(filename)):  # Checks if file was converted successfully
        # File conversion successful

        # Slows down vocals
        audio_processor.slow_down_audio(filename)

        # Breaks down vocals into 10 second chunks
        audio_processor.audio_to_chunks(filename)

        # Generates lyrics for all of the chunks
        result_text = audio_processor.chunks_to_text(
            filename)

        # Return a json object containing all of the lyrics for the all of the chunks
        return jsonify(result_text)
    else:
        # File conversion failed
        return flask.render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
