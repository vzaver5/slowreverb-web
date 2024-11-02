from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import sys
import re
from slowreverbed import slow_reverberate_work
from pydub import AudioSegment

app = Flask(__name__)
CORS(app)

song_upload_dir = '/home/slowreverbsoundbot/mysite/song_uploads'

# Make sure the uploads dir exists
if not os.path.exists(song_upload_dir):
    os.makedirs(song_upload_dir)

#@app.before_request
#def log_request_info():
#    print("Received request from", request.remote_addr, file=sys.stderr)
#    print("Request headers: ", request.headers, file=sys.stderr)
#    print("Request method: ", request.method, file=sys.stderr)
#    print("Request URL: ", request.url, file=sys.stderr)
#    print("Request body: ", request.get_data(), file=sys.stderr)


@app.route('/process-file', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    print("---------------------------------------", file=sys.stderr)
    print(file, file=sys.stderr)
    print(file.filename, file=sys.stderr)

    #Original file no changes to format
    original_file_path = os.path.join(song_upload_dir, file.filename)
    print("Original File(no changes to format): ", original_file_path, file=sys.stderr)
    file.save(original_file_path)
    upload_path = ""
    
    if file.filename.endswith(".mp3"):
        upload_path = mp3_upload_path_work(original_file_path)
    else:
        upload_path = lossless_upload_path_work(original_file_path)
        file.seek(0)    #File saved once so it's pointer needs to start over
        file.save(upload_path)
        
    #Process the file
    print("Upload path is: ", upload_path, file=sys.stderr)
    processed_file_path = slow_reverberate_work(upload_path)
    print("Processed file:", processed_file_path, file=sys.stderr)

    # Return the processed file
    ret_file = send_file(processed_file_path, as_attachment=True)
    #File Cleanup
    try:
        os.remove(upload_path)          #WAV
        os.remove(processed_file_path)  #SRWav
        os.remove(original_file_path)   #Original
        print("Files have been deleted", file=sys.stderr)
        print("---------------------------------------", file=sys.stderr)
    except FileNotFoundError:
        print("Files do not exist", file=sys.stderr)
        
    return ret_file

@app.after_request
def log_response_info(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    #print("Response status: ", response.status, file=sys.stderr)
    #print("Response headers: ", response.headers, file=sys.stderr)
    return response

#MP3 Found
#Convert MP3 to WAV
def mp3_upload_path_work(original_file_path):
    print("MP3 found, changing to wav",file=sys.stderr)
    sound = AudioSegment.from_file(original_file_path)
    wav_upload_path = re.sub(".mp3", ".wav", original_file_path)
    print("New Location for mp3 file(wav): ", wav_upload_path,file=sys.stderr)
    sound.export(wav_upload_path, format="wav", parameters=["-acodec", "pcm_s16le"])
    return wav_upload_path
    
#Lossless Found
#Change ext to .wav
def lossless_upload_path_work(original_file_path):
    print("Not MP3, changing to wav anyways",file=sys.stderr)
    wav_upload_path = re.sub("[.].*", ".wav", original_file_path)
    return wav_upload_path

@app.route('/')
def get_data():
    data = {"message": "Hello from FlaskApp!"}
    return jsonify(data)

if __name__ == "__main__":
    app.run()
