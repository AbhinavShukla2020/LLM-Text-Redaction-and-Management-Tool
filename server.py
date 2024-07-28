from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import os
import time
import re

app = Flask(__name__)
CORS(app)

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def sanitize_filename(filename):
    # Remove or replace characters that are not allowed in file names
    return re.sub(r'[^\w\-_\. ]', '_', filename)

@app.route('/save_all', methods=['POST'])
def save_all():
    data = request.json
    timestamp = time.strftime("%Y%m%d-%H%M%S")
    saved_files = []

    for file_data in data:
        original_name = sanitize_filename(file_data['name'])
        filename = f"{original_name}_{timestamp}.txt"
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(file_data['content'])
        
        saved_files.append(filename)

    return jsonify({"message": "All files saved successfully", "files": saved_files})

@app.route('/download/<filename>')
def download_file(filename):
    return send_file(os.path.join(UPLOAD_FOLDER, filename), as_attachment=True)

if __name__ == '__main__':
    app.run(debug=True)