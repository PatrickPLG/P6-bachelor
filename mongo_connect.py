
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import secrets
import os

uri = "mongodb+srv://dbUser:yFqnuqGdckyIKje0@p6-cluster.95jo4ys.mongodb.net/?retryWrites=true&w=majority&appName=P6-cluster"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))

# Send a ping to confirm a successful connection
try:
    client.admin.command('ping')
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(e)

def upload_images_from_folder(fs, folder_path):
    for filename in os.listdir(folder_path):
        if filename.endswith(('.png', '.jpg', '.jpeg')):
            image_path = os.path.join(folder_path, filename)
            # Here, you might want to derive image_id, image_name, and image_category from the filename or another source
            image_id = secrets.token_hex(10)  # This is just a placeholder, adjust accordingly
            image_name, _ = os.path.splitext(filename)  # Adjust this based on your requirements
            image_category = 'CategoryPlaceholder'  # Determine how to set this

            with open(image_path, 'rb') as file:
                file_id = fs.put(file, filename=image_name, content_type='image/jpeg', category=image_category,
                                 _id=image_id)
                print(f"Uploaded {filename} as {file_id}")