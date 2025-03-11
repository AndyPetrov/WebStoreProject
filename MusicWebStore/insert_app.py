import json
from flask_mysqldb import MySQL
import os
from flask import Flask, request, jsonify, render_template, session, redirect, url_for

app = Flask(__name__, static_folder='static')
app.secret_key = 'your secret key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '' 
app.config['MYSQL_DB'] = 'webstore'


mysql = MySQL(app)

# Insert genres into the database
def insert_genres(genres):
    cursor = mysql.connection.cursor()
    
    for genre in genres.values():
        genre_name = genre["name"]
        
        # Prepare the insert statement
        cursor.execute("INSERT INTO genres (genre_name) VALUES (%s)", (genre_name,))
    
    cursor.close()

# Insert artists into the database
def insert_artists(artists):
    cursor = mysql.connection.cursor()
    
    for artist_id, artist in artists.items():
        name = artist["name"]
        biography = artist.get("biography", "")
        profile_picture_url = artist.get("image_url", 'https://imgur.com/a/el5idNE')
        
        # Prepare the insert statement
        cursor.execute("""
            INSERT INTO artists (artist_id, name, biography, profile_picture_url)
            VALUES (%s, %s, %s, %s)
        """, (artist_id, name, biography, profile_picture_url))
    cursor.close()

# Insert albums into the database
def insert_albums(albums, artists_dict):
    cursor = mysql.connection.cursor()
    
    for album in albums:
        album_id = album["album_id"]
        title = album["name"]
        
        # Extract artist_id from the artists dictionary within the album data
        artist_dict = album["artists"]  # This is now a dictionary of artists
        artist_id = next(iter(artist_dict))  # Get the first artist ID (as per your example)
        
        # Use the artist ID to fetch the corresponding artist data from artists_dict
        artist = artists_dict.get(artist_id)
        
        if artist:
            artist_id = artist["artist_id"]
        else:
            artist_id = None  # If artist is not found, set artist_id as None (or handle error)
        
        cover_image_url = album.get("image_url", 'https://imgur.com/a/el5idNE')
        price = album["price"]
        billboard = album.get("billboard", "")
        popularity = album["popularity"]
        total_tracks = album["total_tracks"]
        youtube_url = album.get("youtube_url", "")
        genre_id = album["genre_id"]
        
        # Prepare the insert statement for the album
        cursor.execute("""
            INSERT INTO albums (album_id, title, artist_id, cover_image_url, price, 
                                billboard, popularity, total_trakcs, youtube_url, genre_id)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """, (album_id, title, artist_id, cover_image_url, price, 
              billboard, popularity, total_tracks, youtube_url, genre_id))
    
    cursor.close()

# Main function
if __name__ == "__main__":
    # Load JSON files
    SITE_ROOT = os.path.realpath(os.path.dirname(__file__))
    albums_path = os.path.join(SITE_ROOT, "fma_data", "filtered_albums.json")
    artists_path = os.path.join(SITE_ROOT, "fma_data", "filtered_artists.json")
    genres_path = os.path.join(SITE_ROOT, "fma_data", "genres.json")

    # Open and parse JSON files
    with open(albums_path, "r", encoding="utf-8") as f:
        albums_data = json.load(f)
    with open(artists_path, "r", encoding="utf-8") as f:
        artists_data = json.load(f)
    with open(genres_path, "r", encoding="utf-8") as f:
        genres_data = json.load(f)
    
    # Create a dictionary of artists for easy lookup by artist_id
    artists_dict = {artist["artist_id"]: artist for artist in artists_data.values()}
    
    # Insert genres, artists, and albums into the database
    insert_genres(genres_data)
    insert_artists(artists_data)
    insert_albums(albums_data, artists_dict)

    print("Data inserted successfully!")
