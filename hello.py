from flask import Flask, jsonify, request, send_file
from bson.json_util import dumps
from mongo_connect import client, upload_images_from_folder
import gridfs
from io import BytesIO

app = Flask(__name__)
print("test")
@app.route('/', methods=['GET'])
def get_data():
    #Select the database (Sample data in our case)
    db = client['sample_mflix']

    # Use the 'movies' collection
    collection = db['movies']

    # Fetch only the plot of the first movie in the collection
    document = collection.find_one({'plot': {'$exists': True}}, {'plot': 1})

    # Convert the document to a JSON string and return it
    return dumps(document['plot'])

@app.route('/get_images', methods=['GET'])
def get_images():
    db = client['artworks']
    collection = db['images.files']
    documents = collection.find({})
    return dumps(documents)

@app.route('/get_image/<image_id>', methods=['GET'])
def get_image(image_id):
    db = client['artworks']
    fs_bucket = gridfs.GridFSBucket(db, bucket_name="images")

    grid_out = fs_bucket.open_download_stream(image_id)
    contents = grid_out.read()

    return send_file(BytesIO(contents), mimetype='image/jpeg')

@app.route('/upload_images', methods=['POST'])
def upload_images():
    db = client['artworks']
    fs = gridfs.GridFS(db, collection="images")  # billederne skal uploades til "images" collection

    folder_path = r"Indsæt path her"  # r laver det til en raw string, så du kan skrive backslashes
    upload_images_from_folder(fs, folder_path)
    return jsonify({'message': 'Images uploaded successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)