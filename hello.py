from flask import Flask, jsonify, request
from bson.json_util import dumps
from mongo_connect import client, upload_images_from_folder
import gridfs

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

@app.route('/upload_images', methods=['POST'])
def upload_images():
    db = client['artworks']
    fs = gridfs.GridFS(db, collection="images")  # Specify the "images" collection

    folder_path = r"C:\Users\pelle\Downloads\Artworks Highres\Artworks Highres"  # Use a raw string for the folder path
    upload_images_from_folder(fs, folder_path)
    return jsonify({'message': 'Images uploaded successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)