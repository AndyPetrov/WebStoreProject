import json
from flask import Flask
from flask_mysqldb import MySQL
import logging

app = Flask(__name__, static_folder='static')

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'webstore'
app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
app.config['DEBUG'] = True
app.logger.setLevel(logging.DEBUG)

mysql = MySQL(app)

def get_db_connection():
    return mysql.connection

# Function to load JSON data
def load_json(file_path):
    with open(file_path, 'r', encoding="utf-8") as file:
        return json.load(file)

# Insert genres into the database
def insert_genres(genres):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for genre in genres.values():
            genre_name = genre["name"]
            cursor.execute("INSERT INTO genres (genre_name) VALUES (%s)", (genre_name,))
        conn.commit()
    except Exception as e:
        app.logger.error(f"Error inserting genres: {e}")
    finally:
        cursor.close()


# Insert artists into the database
def insert_artists(artists):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for artist_id, artist in artists.items():
            name = artist["name"]
            biography = artist.get("biography", "")
            profile_picture_url = artist.get("image_url", 'https://imgur.com/a/el5idNE')
            cursor.execute("""
                INSERT INTO artists (artist_id, name, biography, profile_picture_url)
                VALUES (%s, %s, %s, %s)
            """, (artist_id, name, biography, profile_picture_url))
        conn.commit()
    except Exception as e:
        app.logger.error(f"Error inserting artists: {e}")
    finally:
        cursor.close()

        
# Insert albums into the database
def insert_albums(albums, artists_dict):
    conn = get_db_connection()
    cursor = conn.cursor()
    try:
        for album in albums:
            album_id = album["album_id"]
            title = album["name"]
            artist_dict = album["artists"]
            artist_id = next(iter(artist_dict))  # Get the first artist ID
            artist = artists_dict.get(artist_id)
            
            if artist:
                artist_id = artist["artist_id"]
            else:
                artist_id = None  # If artist is not found, set artist_id as None
            
            cover_image_url = album.get("image_url", 'https://imgur.com/a/el5idNE')
            price = album["price"]
            billboard = album.get("billboard", "")
            popularity = album["popularity"]
            total_tracks = album["total_tracks"]
            youtube_url = album.get("youtube_url", "")
            genre_id = album["genre_id"]

            cursor.execute("""
                INSERT INTO albums (album_id, title, artist_id, cover_image_url, price, 
                                    billboard, popularity, total_tracks, youtube_url, genre_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            """, (album_id, title, artist_id, cover_image_url, price, 
                  billboard, popularity, total_tracks, youtube_url, genre_id))
        conn.commit()
    except Exception as e:
        app.logger.error(f"Error inserting albums: {e}")
    finally:
        cursor.close()


# Main function
if __name__ == "__main__":
    # Load JSON files
    albums_data = load_json('fma_data/filtered_albums.json')
    artists_data = load_json('fma_data/filtered_artists.json')
    genres_data = load_json('fma_data/genres.json')

    # Create a dictionary of artists for easy lookup by artist_id
    artists_dict = {artist["artist_id"]: artist for artist in artists_data.values()}

    # Using app.app_context() here to cover all insert operations
    with app.app_context():
        insert_genres(genres_data)
        insert_artists(artists_data)
        insert_albums(albums_data, artists_dict)

    print("Data inserted successfully!")
