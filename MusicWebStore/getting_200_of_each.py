import json
import yt_dlp
import random
import wikipediaapi
import time

# Function to load the JSON data
def load_json(file_path):
    with open(file_path, 'r', encoding="utf-8") as f:
        return json.load(f)

# Function to save JSON data to a file
def save_json(data, file_path):
    with open(file_path, 'w', encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=4)

# Function to clean and sanitize artist data
def sanitize_artist_data(artist_info):
    artist_data = artist_info.split('\t')
    if len(artist_data) != 8:
        return None
    artist_id, name, followers, popularity, artist_type, main_genre, genres, image_url = artist_data
    name = name.strip().replace("'", "")
    genres = genres.strip("[]").replace("'", "").split(',')
    main_genre = main_genre.strip()
    followers = int(followers.strip()) if followers not in ('None', '') else 0
    popularity = int(popularity.strip()) if popularity not in ('None', '') else 0
    
    return {
        "artist_id": artist_id.strip(),
        "name": name,
        "followers": followers,
        "popularity": popularity,
        "artist_type": artist_type.strip(),
        "main_genre": main_genre,
        "genres": genres,
        "image_url": image_url.strip()
    }

# Function to clean and sanitize album data
def sanitize_album_data(album_info):
    album_data = album_info.split('\t')
    if len(album_data) != 8:
        return None
    album_id, name, billboard, artists, popularity, total_tracks, album_type, image_url = album_data
    name = name.strip().replace("'", "")
    artists = artists.strip("[]").replace("'", "").split(',')
    album_type = album_type.strip()
    popularity = int(popularity.strip()) if popularity not in ('None', '') else 0
    total_tracks = int(total_tracks.strip()) if total_tracks not in ('None', '') else 0
    
    return {
        "album_id": album_id.strip(),
        "name": name,
        "billboard": billboard.strip() if billboard not in ('None', '') else None,
        "artists": artists,
        "popularity": popularity,
        "total_tracks": total_tracks,
        "album_type": album_type,
        "image_url": image_url.strip() if image_url not in ('None', '') else None
    }

# Function to get only the YouTube webpage URL of an album using yt-dlp
def get_youtube_url(album_name):
    ydl_opts = {
        'quiet': True, 
        'format': 'bestaudio/best', 
        'noplaylist': True,
    }
    
    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        try:
            result = ydl.extract_info(f"ytsearch:{album_name}", download=False)
            
            if 'entries' in result and result['entries']:
                return result['entries'][0]['url']  # Only returning the webpage URL
            else:
                return None
        except Exception as e:
            print(f"Error while searching for album '{album_name}': {e}")
            return None

# Function to create random genres with genre_ids
def generate_genres():
    genres = [
        "Pop", "Rock", "Hip-Hop", "Jazz", "Classical", "Blues", "Electronic", 
        "Country", "Reggae", "Folk", "Indie", "R&B", "Metal", "Punk", 
        "Soul", "Disco", "Techno", "House", "Trance", "Alternative"
    ]
    random.shuffle(genres)
    
    genre_data = {}
    for i, genre in enumerate(genres[:20]):
        genre_data[i + 1] = {"genre_id": i + 1, "name": genre}
        
    return genre_data


# Function to fetch the biography of an artist using Wikipedia API
def get_artist_biography(artist_name):
    # Specify a custom user agent
    wiki_wiki = wikipediaapi.Wikipedia(
        language='en',
        user_agent='MusicProject/1.0 (webstore.project2025@gmail.com)'  # Replace with your app's name and contact email
    )
    
    page = wiki_wiki.page(artist_name)

    # Check if the page exists and has content
    if page.exists():
        # Get the summary of the page (first 1-2 sentences)
        summary = page.summary
        return summary
    else:
        return "Biography not available."

# Function to process albums and artists based on the requirements
def process_albums_and_artists(albums_file, artists_file, output_albums_file, output_artists_file, genres_file):
    albums_data = load_json(albums_file)
    artists_data = load_json(artists_file)
    
    artists_dict = {}
    for artist in artists_data:
        artist_info = artist.get("artist_id\tname\tfollowers\tpopularity\tartist_type\tmain_genre\tgenres\timage_url")
        if artist_info:
            artist_data = sanitize_artist_data(artist_info)
            if artist_data:
                artists_dict[artist_data["artist_id"]] = artist_data
    
    # Generate genres with genre_id
    genres_dict = generate_genres()

    filtered_albums = []
    filtered_artists = {}
    
    album_count = 0
    for album_info in albums_data:
        album_data = sanitize_album_data(album_info.get('album_id\tname\tbillboard\tartists\tpopularity\ttotal_tracks\talbum_type\timage_url'))
        
        if album_data is None:
            print(f"Skipping album with incorrect data format: {album_info}")
            continue
        
        album_id = album_data["album_id"]
        album_name = album_data["name"]
        billboard = album_data["billboard"]
        artists = album_data["artists"]
        popularity = album_data["popularity"]
        total_tracks = album_data["total_tracks"]
        album_type = album_data["album_type"]
        image_url = album_data["image_url"]
        
        valid_artists = {}
        
        for artist_info in artists:
            if ':' in artist_info:
                artist_id, artist_name = artist_info.split(':', 1)
                artist_id = artist_id.strip()
                artist_name = artist_name.strip()
                artist_id = artist_id.strip("{}")
                artist_name = artist_name.strip("{}")
                
                if artist_id in artists_dict:
                    artist_data = artists_dict[artist_id]
                    
                    # Add biography for valid artists
                    biography = get_artist_biography(artist_name)  # Fetch biography here
                    time.sleep(1)
                    valid_artists[artist_id] = {
                        "artist_id": artist_data.get("artist_id"),
                        "name": artist_data.get("name"),
                        "followers": artist_data.get("followers"),
                        "popularity": artist_data.get("popularity"),
                        "artist_type": artist_data.get("artist_type"),
                        "main_genre": artist_data.get("main_genre"),
                        "genres": artist_data.get("genres"),
                        "image_url": artist_data.get("image_url"),
                        "biography": biography  # Add biography to artist data
                    }
        
        # Assign a random genre_id (1-20) for each album
        genre_id = random.randint(1, 20)
        # Assign a random price between 10 and 50 for each album
        price = round(random.uniform(10, 50), 2)

        if valid_artists:
            video_url = get_youtube_url(album_name)
            
            filtered_albums.append({
                "album_id": album_id,
                "name": album_name,
                "billboard": billboard,
                "artists": valid_artists,
                "popularity": popularity,
                "total_tracks": total_tracks,
                "album_type": album_type,
                "image_url": image_url,
                "youtube_url": video_url,
                "genre_id": genre_id,  # Link the album to a genre by genre_id
                "price": price  # Added price field
            })
            
            filtered_artists.update(valid_artists)
            album_count += 1
        
        if album_count >= 200:
            break
    
    # Save filtered albums and artists to new JSON files
    save_json(filtered_albums, output_albums_file)
    save_json(filtered_artists, output_artists_file)

    # Save genres to a new JSON file
    save_json(genres_dict, genres_file)

# Main execution
if __name__ == "__main__":
    albums_file = 'fma_data/albums.json'
    artists_file = 'fma_data/artists.json'
    output_albums_file = 'fma_data/filtered_albums.json'
    output_artists_file = 'fma_data/filtered_artists.json'
    genres_file = 'fma_data/genres.json'

    process_albums_and_artists(albums_file, artists_file, output_albums_file, output_artists_file, genres_file)

    print("Filtering completed and files saved.")

