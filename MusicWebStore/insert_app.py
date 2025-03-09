import json
import mysql.connector

# Function to load JSON data
def load_json(file_path):
    with open(file_path, 'r', encoding="utf-8") as file:
        return json.load(file)

# MySQL Connection Setup
def create_connection():
    return mysql.connector.connect(
        host='localhost',         # Your MySQL host
        user='root',              # Your MySQL user
        password='',              # Your MySQL password
        database='webstore'       # The database you're using
    )

# Insert genres into the database
def insert_genres(genres):
    connection = create_connection()
    cursor = connection.cursor()
    
    for genre in genres.values():
        genre_name = genre["name"]
        
        # Prepare the insert statement
        cursor.execute("INSERT INTO genres (genre_name) VALUES (%s)", (genre_name,))
    
    connection.commit()
    cursor.close()
    connection.close()

# Insert artists into the database
def insert_artists(artists):
    connection = create_connection()
    cursor = connection.cursor()
    
    for artist_id, artist in artists.items():
        name = artist["name"]
        biography = artist.get("biography", "")
        profile_picture_url = artist.get("image_url", 'https://imgur.com/a/el5idNE')
        
        # Prepare the insert statement
        cursor.execute("""
            INSERT INTO artists (artist_id, name, biography, profile_picture_url)
            VALUES (%s, %s, %s, %s)
        """, (artist_id, name, biography, profile_picture_url))
    
    connection.commit()
    cursor.close()
    connection.close()

# Insert albums into the database
def insert_albums(albums, artists_dict):
    connection = create_connection()
    cursor = connection.cursor()
    
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
    
    connection.commit()
    cursor.close()
    connection.close()

# Main function
if __name__ == "__main__":
    # Load JSON files
    albums_data = load_json('fma_data/filtered_albums.json')
    artists_data = load_json('fma_data/filtered_artists.json')
    genres_data = load_json('fma_data/genres.json')
    
    # Create a dictionary of artists for easy lookup by artist_id
    artists_dict = {artist["artist_id"]: artist for artist in artists_data.values()}
    
    # Insert genres, artists, and albums into the database
    insert_genres(genres_data)
    insert_artists(artists_data)
    insert_albums(albums_data, artists_dict)

    print("Data inserted successfully!")
