from flask import Flask, jsonify
from bson.json_util import dumps
from mongo_connect import client

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

if __name__ == '__main__':
    app.run(debug=True)