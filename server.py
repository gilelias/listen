import os
import uuid
import json
from flask import Flask, flash, request, redirect, url_for, send_from_directory, abort

from config import *

app = Flask(__name__)

@app.route('/')
def send_index():
    return send_from_directory('ui', 'index.html')

@app.route('/js/<path:path>')
def send_js(path):
    return send_from_directory('ui/js', path)

@app.route('/wav/')
def send_folders():
    return {
                "folders": os.listdir(WAV_FOLDER)
        }


@app.route('/wav/<path:path>')
def send_wav(path):
    loc = os.path.join(WAV_FOLDER, path)
    if os.path.isfile(loc):
        return send_from_directory(WAV_FOLDER, path)
    elif os.path.isdir(loc):
        return {
            "files": os.listdir(loc)
        }
    else:
        return abort(404)

if __name__ == '__main__':
    app.run()