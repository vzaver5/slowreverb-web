from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import sys
from slowreverbed import slow_reverberate_work

app = Flask(__name__)
CORS(app)

# Make sure the uploads dir exists
if not os.path.exists('uploads'):
    os.makedirs('uploads')

@app.route('/process-file', methods=['POST'])
def process_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part in the request"}), 400
    
    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    print(file, file=sys.stderr)
    print(file.filename, file=sys.stderr)

    # Save the uploaded file temporarily
    upload_path = os.path.join('uploads', file.filename)
    file.save(upload_path)

    # Process the file
    processed_file_path = slow_reverberate(upload_path)
    print(processed_file_path, file=sys.stderr)

    # Return the processed file
    return send_file(processed_file_path, as_attachment=True, mimetype='audio/wav')

# Process
def slow_reverberate(upload_path):
    # Now that you have the upload path feed it to the slow and reverbed code.
    # Make another py file in this dir, and call that function.
    return slow_reverberate_work(upload_path)

@app.route('/')
def get_data():
    data = {"message": "Hello from Flask!"}
    return jsonify(data)

if __name__ == "__main__":
    app.run(debug=True)
