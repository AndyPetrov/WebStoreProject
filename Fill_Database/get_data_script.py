from flask import Flask, jsonify, request, send_file
import requests
import time
import datetime
import logging
import json
import os
from flask_mysqldb import MySQL
import wikipedia
import re
from urllib.parse import unquote

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(),
        logging.FileHandler('apple_music_import.log')
    ]
)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# MySQL Configuration
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'webstore'
mysql = MySQL(app)

# API Configuration
API_BASE_URL = "https://itunes.apple.com/lookup"
API_SEARCH_URL = "https://itunes.apple.com/search"
API_CALL_DELAY = 0.5  # Delay between API calls in seconds to respect rate limits
RSS_FEED_URL = "https://rss.marketingtools.apple.com/api/v2/us/music/most-played/100/albums.json"
WIKIPEDIA_RATE_LIMIT = 1

# File storage settings
DATA_FOLDER = 'data'
if not os.path.exists(DATA_FOLDER):
    os.makedirs(DATA_FOLDER)

# Limits
MAX_SINGLES_PER_ARTIST = 10
MAX_ALBUM_INSERTS = 4000
MAX_ALBUMS_PER_ARTIST = 20

def fetch_api_data(params):
    """
    Unified function to fetch data from iTunes API with error handling and rate limiting
    """
    try:
        response = requests.get(API_BASE_URL, params=params)
        time.sleep(API_CALL_DELAY)  # Respect API rate limits
        
        if response.status_code == 200:
            data = response.json()
            if data.get('resultCount', 0) > 0:
                return data['results']
            else:
                logger.warning(f"No results found for params: {params}")
                return []
        else:
            logger.error(f"API error: {response.status_code} for params: {params}")
            return []
    except Exception as e:
        logger.error(f"Exception during API fetch: {str(e)} for params: {params}")
        return []

def search_api_data(params):
    """
    Unified function to search data from iTunes API
    """
    try:
        response = requests.get(API_SEARCH_URL, params=params)
        time.sleep(API_CALL_DELAY)  # Respect API rate limits
        
        if response.status_code == 200:
            data = response.json()
            if data.get('resultCount', 0) > 0:
                return data['results']
            else:
                logger.warning(f"No search results found for params: {params}")
                return []
        else:
            logger.error(f"API search error: {response.status_code} for params: {params}")
            return []
    except Exception as e:
        logger.error(f"Exception during API search: {str(e)} for params: {params}")
        return []

def fetch_top_albums():
    """
    Fetch top 100 albums from Apple Music RSS Feed
    """
    try:
        logger.info("Fetching top 100 albums from RSS feed")
        response = requests.get(RSS_FEED_URL)
        
        if response.status_code == 200:
            data = response.json()
            feed = data.get('feed', {})
            results = feed.get('results', [])
            
            # Extract artist IDs from the results
            artist_ids = set()
            albums = []
            
            for album in results:
                artist_id = album.get('artistId')
                if artist_id:
                    artist_ids.add(artist_id)
                    albums.append({
                        'artistId': artist_id,
                        'artistName': album.get('artistName'),
                        'albumId': album.get('id'),
                        'albumName': album.get('name'),
                        'releaseDate': album.get('releaseDate'),
                        'artworkUrl': album.get('artworkUrl100', '').replace('100x100', '600x600')
                    })
            
            logger.info(f"Found {len(artist_ids)} unique artists in top 100 albums")
            return list(artist_ids), albums
        else:
            logger.error(f"RSS feed error: {response.status_code}")
            return [], []
    except Exception as e:
        logger.error(f"Exception during RSS feed fetch: {str(e)}")
        return [], []

def fetch_artist_details(artist_id):
    """
    Fetch detailed information about an artist
    """
    logger.info(f"Fetching details for artist ID: {artist_id}")
    params = {'id': artist_id, 'entity': 'musicArtist'}
    artist_data = fetch_api_data(params)
    
    if artist_data:
        return artist_data[0]
    return None

def fetch_artist_albums(artist_id):
    """
    Fetch all albums for a given artist
    """
    logger.info(f"Fetching albums for artist ID: {artist_id}")
    params = {'id': artist_id, 'entity': 'album', 'limit': MAX_ALBUMS_PER_ARTIST}
    return fetch_api_data(params)

def fetch_artist_singles(artist_id):
    """
    Fetch singles for a given artist, limited by MAX_SINGLES_PER_ARTIST
    """
    logger.info(f"Fetching singles for artist ID: {artist_id}")
    params = {'id': artist_id, 'entity': 'song', 'attribute': 'singlesOnly', 'limit': MAX_SINGLES_PER_ARTIST}
    return fetch_api_data(params)

def fetch_album_tracks(album_id):
    """
    Fetch all tracks for a given album
    """
    logger.info(f"Fetching tracks for album ID: {album_id}")
    params = {'id': album_id, 'entity': 'song'}
    return fetch_api_data(params)

def fetch_artist_music_videos(artist_id):
    """
    Fetch music videos for a given artist
    """
    logger.info(f"Fetching music videos for artist ID: {artist_id}")
    params = {'id': artist_id, 'entity': 'musicVideo'}
    return fetch_api_data(params)

def fetch_featured_artists(track_name, artist_name):
    """
    Parse track name to identify featured artists and fetch their details
    """
    if " feat. " in track_name or " ft. " in track_name or " with " in track_name:
        # Extract featured artist names from track title
        featured_parts = track_name.replace(" feat. ", " feat.").replace(" ft. ", " feat.").replace(" with ", " feat.")
        if " feat." in featured_parts:
            parts = featured_parts.split(" feat.")
            if len(parts) > 1:
                featured_string = parts[1]
                # Remove parentheses if exists
                if "(" in featured_string and ")" in featured_string:
                    featured_string = featured_string.split("(")[1].split(")")[0]
                
                featured_artists = []
                # Split by commas or '&' to get individual artist names
                for name in featured_string.split(","):
                    for subname in name.split("&"):
                        feat_name = subname.strip()
                        if feat_name and feat_name.lower() != artist_name.lower():
                            # Search for the artist
                            search_params = {'term': feat_name, 'entity': 'musicArtist', 'limit': 1}
                            results = search_api_data(search_params)
                            if results:
                                featured_artists.append(results[0])
                
                return featured_artists
    
    return []

def format_date(date_str):
    """
    Format date string to MySQL date format
    """
    if not date_str:
        return None
    
    try:
        date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%d")
        return date_obj.strftime("%Y-%m-%d")
    except ValueError:
        try:
            date_obj = datetime.datetime.strptime(date_str, "%Y-%m-%dT%H:%M:%SZ")
            return date_obj.strftime("%Y-%m-%d")
        except ValueError:
            logger.warning(f"Could not parse date: {date_str}")
            return None

def get_genre_id(genre_name, cursor):
    """
    Get genre ID from the database or create if not exists
    """
    if not genre_name:
        return None
    
    try:
        cursor.execute("SELECT genre_id FROM genres WHERE genre_name = %s", (genre_name,))
        result = cursor.fetchone()
        
        if result:
            return result[0]
        else:
            cursor.execute("INSERT INTO genres (genre_name) VALUES (%s)", (genre_name,))
            return cursor.lastrowid
    except Exception as e:
        logger.error(f"Error handling genre: {str(e)}")
        return None

def record_exists(table, id_column, id_value, cursor):
    """
    Check if a record already exists in the database
    """
    try:
        cursor.execute(f"SELECT 1 FROM {table} WHERE {id_column} = %s LIMIT 1", (id_value,))
        return cursor.fetchone() is not None
    except Exception as e:
        logger.error(f"Error checking record existence: {str(e)}")
        return False

def fetch_all_data():
    """
    Fetch all data from iTunes API
    """
    all_data = {
        'artists': [],
        'albums': [],
        'tracks': [],
        'music_videos': [],
        'featured_artists': []
    }
    
    # Fetch top albums and get unique artist IDs
    artist_ids, top_albums = fetch_top_albums()
    album_count = 0
    
    # Process each artist
    for artist_id in artist_ids:
        artist_details = fetch_artist_details(artist_id)
        
        if not artist_details:
            continue
        
        # Extract artist information
        artist_info = {
            'artist_id': artist_details.get('artistId'),
            'name': artist_details.get('artistName'),
            'genre_name': artist_details.get('primaryGenreName'),
            'artist_image_url': artist_details.get('artworkUrl100', '').replace('100x100', '600x600') if 'artworkUrl100' in artist_details else None
        }
        
        all_data['artists'].append(artist_info)
        
        # Fetch albums
        artist_albums = fetch_artist_albums(artist_id)
        filtered_albums = []
        
        # Filter unique albums and respect limits
        seen_album_ids = set()
        for album in artist_albums:
            if album.get('collectionId') not in seen_album_ids and album.get('collectionType') == 'Album':
                seen_album_ids.add(album.get('collectionId'))
                filtered_albums.append(album)
                
                if len(filtered_albums) >= MAX_ALBUMS_PER_ARTIST:
                    break
        
        # Fetch singles
        artist_singles = fetch_artist_singles(artist_id)
        
        # Process albums
        for album in filtered_albums:
            album_id = album.get('collectionId')
            album_info = {
                'album_id': album_id,
                'title': album.get('collectionName'),
                'artist_id': album.get('artistId'),
                'genre_name': album.get('primaryGenreName'),
                'release_date': format_date(album.get('releaseDate')),
                'cover_image_url': album.get('artworkUrl100', '').replace('100x100', '600x600'),
                'price': album.get('collectionPrice', 9.99),
                'explicit': album.get('collectionExplicitness') == 'explicit'
            }
            
            all_data['albums'].append(album_info)
            album_count += 1
            
            # Fetch tracks for this album
            album_tracks = fetch_album_tracks(album_id)
            
            # Process tracks
            for track in album_tracks:
                if track.get('wrapperType') == 'track' and track.get('kind') == 'song':
                    track_info = {
                        'track_id': track.get('trackId'),
                        'title': track.get('trackName'),
                        'album_id': track.get('collectionId'),
                        'artist_id': track.get('artistId'),
                        'duration_milliseconds': track.get('trackTimeMillis', 0),
                        'track_number': track.get('trackNumber', 0),
                        'preview_url': track.get('previewUrl'),
                        'price': track.get('trackPrice', 0.99),
                        'explicit': track.get('trackExplicitness') == 'explicit'
                    }
                    
                    all_data['tracks'].append(track_info)
                    
                    # Check for featured artists
                    featured_artists = fetch_featured_artists(track.get('trackName', ''), track.get('artistName', ''))
                    
                    for featured_artist in featured_artists:
                        featured_info = {
                            'track_id': track.get('trackId'),
                            'artist_id': featured_artist.get('artistId'),
                            'artist_name': featured_artist.get('artistName')  # Additional info for reference
                        }
                        all_data['featured_artists'].append(featured_info)
        
        # Process singles (limited number)
        for single in artist_singles:
            if single.get('wrapperType') == 'track' and single.get('kind') == 'song':
                single_info = {
                    'track_id': single.get('trackId'),
                    'title': single.get('trackName'),
                    'album_id': single.get('collectionId') if 'collectionId' in single else None,
                    'artist_id': single.get('artistId'),
                    'duration_milliseconds': single.get('trackTimeMillis', 0),
                    'track_number': single.get('trackNumber', 1),
                    'preview_url': single.get('previewUrl'),
                    'price': single.get('trackPrice', 0.99),
                    'explicit': single.get('trackExplicitness') == 'explicit'
                }
                
                all_data['tracks'].append(single_info)
                
                # Check for featured artists in singles too
                featured_artists = fetch_featured_artists(single.get('trackName', ''), single.get('artistName', ''))
                
                for featured_artist in featured_artists:
                    featured_info = {
                        'track_id': single.get('trackId'),
                        'artist_id': featured_artist.get('artistId'),
                        'artist_name': featured_artist.get('artistName')  # Additional info for reference
                    }
                    all_data['featured_artists'].append(featured_info)
        
        # Fetch music videos
        music_videos = fetch_artist_music_videos(artist_id)
        
        # Process music videos
        for video in music_videos:
            if video.get('wrapperType') == 'track' and video.get('kind') == 'music-video':
                video_info = {
                    'video_id': video.get('trackId'),
                    'title': video.get('trackName'),
                    'artist_id': video.get('artistId'),
                    'album_id': video.get('collectionId') if 'collectionId' in video else None,
                    'preview_url': video.get('previewUrl', ''),
                    'release_date': format_date(video.get('releaseDate')),
                    'duration_milliseconds': video.get('trackTimeMillis', 0),
                    'price': video.get('trackPrice', 1.99)
                }
                
                all_data['music_videos'].append(video_info)
        
        # Check if we've reached the maximum number of albums
        if album_count >= MAX_ALBUM_INSERTS:
            logger.info(f"Reached maximum album limit of {MAX_ALBUM_INSERTS}")
            break
    
    logger.info(f"Data fetching complete. "
                f"Artists: {len(all_data['artists'])}, "
                f"Albums: {len(all_data['albums'])}, "
                f"Tracks: {len(all_data['tracks'])}, "
                f"Music Videos: {len(all_data['music_videos'])}, "
                f"Featured Artists: {len(all_data['featured_artists'])}")
    
    return all_data

def save_data_to_file(data, filename=None):
    """
    Save data to a JSON file
    """
    if filename is None:
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"apple_music_data_{timestamp}.json"
    
    filepath = os.path.join(DATA_FOLDER, filename)
    
    try:
        with open(filepath, 'w') as json_file:
            json.dump(data, json_file, indent=2)
        logger.info(f"Data saved to {filepath}")
        return filepath
    except Exception as e:
        logger.error(f"Error saving data to file: {str(e)}")
        return None

def load_data_from_file(filename):
    """
    Load data from a JSON file
    """
    filepath = os.path.join(DATA_FOLDER, filename)
    
    try:
        with open(filepath, 'r') as json_file:
            data = json.load(json_file)
        logger.info(f"Data loaded from {filepath}")
        return data
    except Exception as e:
        logger.error(f"Error loading data from file: {str(e)}")
        return None

def insert_data(data):
    """
    Insert data into MySQL database with improved foreign key handling
    """
    conn = mysql.connection
    cur = conn.cursor()
    inserted_counts = {
        'artists': 0,
        'albums': 0,
        'tracks': 0,
        'music_videos': 0,
        'featured_artists': 0,
        'genres': 0
    }
    
    try:
        # FIRST PASS: Insert all artists and genres
        logger.info("First pass: Inserting artists and genres")
        artist_ids = set()  # Keep track of successfully inserted artist IDs
        
        # Insert artists
        for artist in data.get('artists', []):
            try:
                if not record_exists('artists', 'artist_id', artist['artist_id'], cur):
                    # Get or insert genre
                    genre_id = None
                    if 'genre_name' in artist and artist['genre_name']:
                        genre_id = get_genre_id(artist['genre_name'], cur)
                        if genre_id:
                            inserted_counts['genres'] += 1
                    
                    cur.execute(
                        "INSERT INTO artists (artist_id, name, genre_id, artist_image_url) VALUES (%s, %s, %s, %s)",
                        (
                            artist['artist_id'],
                            artist['name'],
                            genre_id,
                            artist.get('artist_image_url')
                        )
                    )
                    inserted_counts['artists'] += 1
                    artist_ids.add(artist['artist_id'])
                else:
                    # Artist already exists, add to our set
                    artist_ids.add(artist['artist_id'])
            except Exception as e:
                logger.error(f"Error inserting artist {artist.get('artist_id')}: {str(e)}")
                continue
        
        # Commit after first pass to ensure artists are saved
        conn.commit()
        logger.info(f"First pass complete. Inserted {inserted_counts['artists']} artists and {inserted_counts['genres']} genres")
        
        # SECOND PASS: Insert all entities dependent on artists
        logger.info("Second pass: Inserting albums, tracks, videos, and featured artists")
        
        # Insert albums (only if artist exists)
        for album in data.get('albums', []):
            try:
                if album['artist_id'] not in artist_ids:
                    logger.warning(f"Skipping album {album['album_id']} - artist {album['artist_id']} not found")
                    continue
                    
                if not record_exists('albums', 'album_id', album['album_id'], cur):
                    # Get or insert genre
                    genre_id = None
                    if 'genre_name' in album and album['genre_name']:
                        genre_id = get_genre_id(album['genre_name'], cur)
                    
                    cur.execute(
                        "INSERT INTO albums (album_id, title, artist_id, genre_id, release_date, cover_image_url, price, explicit) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                        (
                            album['album_id'],
                            album['title'],
                            album['artist_id'],
                            genre_id,
                            album.get('release_date'),
                            album.get('cover_image_url'),
                            album.get('price', 9.99),
                            album.get('explicit', False)
                        )
                    )
                    inserted_counts['albums'] += 1
            except Exception as e:
                logger.error(f"Error inserting album {album.get('album_id')}: {str(e)}")
                continue
        
        # Insert tracks (only if artist exists)
        for track in data.get('tracks', []):
            try:
                if track['artist_id'] not in artist_ids:
                    logger.warning(f"Skipping track {track['track_id']} - artist {track['artist_id']} not found")
                    continue
                    
                if not record_exists('tracks', 'track_id', track['track_id'], cur):
                    cur.execute(
                        "INSERT INTO tracks (track_id, title, album_id, artist_id, duration_milliseconds, track_number, preview_url, price, explicit) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)",
                        (
                            track['track_id'],
                            track['title'],
                            track.get('album_id'),
                            track['artist_id'],
                            track.get('duration_milliseconds', 0),
                            track.get('track_number', 1),
                            track.get('preview_url'),
                            track.get('price', 0.99),
                            track.get('explicit', False)
                        )
                    )
                    inserted_counts['tracks'] += 1
            except Exception as e:
                logger.error(f"Error inserting track {track.get('track_id')}: {str(e)}")
                continue
        
        # Insert music videos (only if artist exists)
        for video in data.get('music_videos', []):
            try:
                if video['artist_id'] not in artist_ids:
                    logger.warning(f"Skipping video {video['video_id']} - artist {video['artist_id']} not found")
                    continue
                    
                if not record_exists('music_videos', 'video_id', video['video_id'], cur):
                    cur.execute(
                        "INSERT INTO music_videos (video_id, title, artist_id, album_id, preview_url, release_date, duration_milliseconds, price) "
                        "VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                        (
                            video['video_id'],
                            video['title'],
                            video['artist_id'],
                            video.get('album_id'),
                            video.get('preview_url', ''),
                            video.get('release_date'),
                            video.get('duration_milliseconds', 0),
                            video.get('price', 1.99)
                        )
                    )
                    inserted_counts['music_videos'] += 1
            except Exception as e:
                logger.error(f"Error inserting music video {video.get('video_id')}: {str(e)}")
                continue
        
        # Insert featured artists
        for feature in data.get('featured_artists', []):
            try:
                # Check if both track and artist exist before creating relation
                if (record_exists('tracks', 'track_id', feature['track_id'], cur) and 
                    record_exists('artists', 'artist_id', feature['artist_id'], cur)):
                    # Check if relation already exists
                    cur.execute(
                        "SELECT 1 FROM featured_artists WHERE track_id = %s AND artist_id = %s",
                        (feature['track_id'], feature['artist_id'])
                    )
                    if not cur.fetchone():
                        cur.execute(
                            "INSERT INTO featured_artists (track_id, artist_id) VALUES (%s, %s)",
                            (feature['track_id'], feature['artist_id'])
                        )
                        inserted_counts['featured_artists'] += 1
            except Exception as e:
                logger.error(f"Error inserting featured artist relation: {str(e)}")
                continue
        
        # Commit the transaction
        conn.commit()
        logger.info(f"Data insertion complete. "
                    f"Artists: {inserted_counts['artists']}, "
                    f"Albums: {inserted_counts['albums']}, "
                    f"Tracks: {inserted_counts['tracks']}, "
                    f"Music Videos: {inserted_counts['music_videos']}, "
                    f"Featured Artists: {inserted_counts['featured_artists']}, "
                    f"Genres: {inserted_counts['genres']}")
        
        return inserted_counts
    except Exception as e:
        conn.rollback()
        logger.error(f"Error during data insertion: {str(e)}")
        raise
    finally:
        cur.close()

def get_artists_without_images(filename):
    """
    Get all artists from a JSON file that don't have an image
    """
    logger.info(f"Finding artists without images in {filename}")
    data = load_data_from_file(filename)
    
    if not data or 'artists' not in data:
        logger.error("No artist data found in file")
        return []
    
    artists_without_images = []
    for artist in data['artists']:
        if not artist.get('artist_image_url') or artist.get('artist_image_url') == '':
            artists_without_images.append({
                'artist_id': artist['artist_id'],
                'name': artist['name']
            })
    
    logger.info(f"Found {len(artists_without_images)} artists without images")
    return artists_without_images

def search_wikipedia_image(artist_name):
    """
    Search Wikipedia for an artist's image
    """
    logger.info(f"Searching Wikipedia for image of {artist_name}")
    try:
        # Rate limit Wikipedia API calls
        time.sleep(WIKIPEDIA_RATE_LIMIT)
        
        # Search for the artist page
        search_results = wikipedia.search(f"{artist_name} musician", results=3)
        
        if not search_results:
            logger.warning(f"No Wikipedia results for {artist_name}")
            return None
        
        # Try each search result until we find a page with an image
        for result in search_results:
            try:
                # Get Wikipedia page
                page = wikipedia.page(result, auto_suggest=False)
                
                # Check if we have images
                if page.images:
                    # Filter for jpg or png images
                    image_urls = [img for img in page.images if img.lower().endswith(('.jpg', '.jpeg', '.png'))]
                    
                    if image_urls:
                        # Try to find artist-related image (avoid logos, icons, etc.)
                        for img_url in image_urls:
                            img_filename = unquote(img_url.split('/')[-1].lower())
                            
                            # Skip small images (likely logos or icons)
                            if "icon" in img_filename or "logo" in img_filename:
                                continue
                                
                            # If artist name appears in filename, prioritize it
                            if re.search(re.escape(artist_name.lower()), img_filename):
                                logger.info(f"Found image for {artist_name}: {img_url}")
                                return img_url
                        
                        # If no name match, return first acceptable image
                        logger.info(f"Found general image for {artist_name}: {image_urls[0]}")
                        return image_urls[0]
            except (wikipedia.exceptions.DisambiguationError, wikipedia.exceptions.PageError):
                continue
        
        logger.warning(f"No suitable images found for {artist_name}")
        return None
    except Exception as e:
        logger.error(f"Error searching Wikipedia for {artist_name}: {str(e)}")
        return None

def update_artist_images(artists_without_images):
    """
    Update artist images in the database using Wikipedia
    """
    logger.info(f"Updating images for {len(artists_without_images)} artists")
    conn = mysql.connection
    cur = conn.cursor()
    updated_count = 0
    
    try:
        for artist in artists_without_images:
            image_url = search_wikipedia_image(artist['name'])
            
            if image_url:
                try:
                    cur.execute(
                        "UPDATE artists SET artist_image_url = %s WHERE artist_id = %s",
                        (image_url, artist['artist_id'])
                    )
                    updated_count += 1
                except Exception as e:
                    logger.error(f"Error updating image for artist {artist['name']}: {str(e)}")
                    continue
        
        conn.commit()
        logger.info(f"Updated images for {updated_count} artists")
        return updated_count
    except Exception as e:
        conn.rollback()
        logger.error(f"Error in update_artist_images: {str(e)}")
        raise
    finally:
        cur.close()

def get_items_without_descriptions(filename, item_type):
    """
    Get all artists or albums from a JSON file that might need descriptions
    
    :param filename: JSON file containing data
    :param item_type: 'artists' or 'albums'
    :return: List of items needing descriptions
    """
    logger.info(f"Finding {item_type} that need descriptions in {filename}")
    data = load_data_from_file(filename)
    
    if not data or item_type not in data:
        logger.error(f"No {item_type} data found in file")
        return []
    
    items_list = []
    for item in data[item_type]:
        if item_type == 'artists':
            items_list.append({
                'id': item['artist_id'],
                'name': item['name']
            })
        elif item_type == 'albums':
            items_list.append({
                'id': item['album_id'],
                'title': item['title'],
                'artist_name': next((artist['name'] for artist in data['artists'] 
                                   if artist['artist_id'] == item['artist_id']), None)
            })
    
    logger.info(f"Found {len(items_list)} {item_type} to check for descriptions")
    return items_list

def search_wikipedia_description(search_term):
    """
    Search Wikipedia for an item's description
    """
    logger.info(f"Searching Wikipedia for description of {search_term}")
    try:
        # Rate limit Wikipedia API calls
        time.sleep(WIKIPEDIA_RATE_LIMIT)
        
        # Search for the page
        search_results = wikipedia.search(search_term, results=3)
        
        if not search_results:
            logger.warning(f"No Wikipedia results for {search_term}")
            return None
        
        # Try each search result
        for result in search_results:
            try:
                # Get Wikipedia page
                page = wikipedia.page(result, auto_suggest=False)
                
                # Get the first few sections of content (to avoid too much text)
                content = page.content
                
                # Extract a reasonable summary (first 2 paragraphs)
                paragraphs = content.split("\n\n")
                summary = "\n\n".join(paragraphs[:min(2, len(paragraphs))])
                
                # Clean up the text (remove citations, etc.)
                summary = re.sub(r'\[\d+\]', '', summary)  # Remove citation numbers
                
                if summary:
                    logger.info(f"Found description for {search_term}")
                    return summary
            except (wikipedia.exceptions.DisambiguationError, wikipedia.exceptions.PageError):
                continue
        
        logger.warning(f"No suitable description found for {search_term}")
        return None
    except Exception as e:
        logger.error(f"Error searching Wikipedia for {search_term}: {str(e)}")
        return None

def update_artist_descriptions(artists_list):
    """
    Update artist descriptions in the database using Wikipedia
    """
    logger.info(f"Updating descriptions for {len(artists_list)} artists")
    conn = mysql.connection
    cur = conn.cursor()
    updated_count = 0
    
    try:
        for artist in artists_list:
            # Check if description already exists
            cur.execute("SELECT 1 FROM artist_descriptions WHERE artist_id = %s", (artist['id'],))
            if cur.fetchone():
                logger.info(f"Description already exists for artist {artist['name']}")
                continue
                
            description = search_wikipedia_description(f"{artist['name']} musician")
            
            if description:
                try:
                    cur.execute(
                        "INSERT INTO artist_descriptions (description, artist_id) VALUES (%s, %s)",
                        (description, artist['id'])
                    )
                    updated_count += 1
                except Exception as e:
                    logger.error(f"Error updating description for artist {artist['name']}: {str(e)}")
                    continue
        
        conn.commit()
        logger.info(f"Updated descriptions for {updated_count} artists")
        return updated_count
    except Exception as e:
        conn.rollback()
        logger.error(f"Error in update_artist_descriptions: {str(e)}")
        raise
    finally:
        cur.close()

def update_album_descriptions(albums_list):
    """
    Update album descriptions in the database using Wikipedia
    """
    logger.info(f"Updating descriptions for {len(albums_list)} albums")
    conn = mysql.connection
    cur = conn.cursor()
    updated_count = 0
    skipped_count = 0
   
    try:
        for album in albums_list:
            # First check if the album exists in the albums table
            cur.execute("SELECT 1 FROM albums WHERE album_id = %s", (album['id'],))
            if not cur.fetchone():
                logger.warning(f"Album ID {album['id']} ({album.get('title', 'Unknown')}) does not exist in database. Skipping.")
                skipped_count += 1
                continue

            # Then check if description already exists
            cur.execute("SELECT 1 FROM album_descriptions WHERE album_id = %s", (album['id'],))
            if cur.fetchone():
                logger.info(f"Description already exists for album {album['title']}")
                continue
               
            search_term = f"{album['title']} album"
            if album.get('artist_name'):
                search_term += f" by {album['artist_name']}"
               
            description = search_wikipedia_description(search_term)
           
            if description:
                try:
                    cur.execute(
                        "INSERT INTO album_descriptions (description, album_id) VALUES (%s, %s)",
                        (description, album['id'])
                    )
                    updated_count += 1
                except Exception as e:
                    logger.error(f"Error updating description for album {album['title']}: {str(e)}")
                    continue
       
        conn.commit()
        logger.info(f"Updated descriptions for {updated_count} albums, skipped {skipped_count} non-existent albums")
        return updated_count
    except Exception as e:
        conn.rollback()
        logger.error(f"Error in update_album_descriptions: {str(e)}")
        raise
    finally:
        cur.close()

@app.route('/update-artist-images', methods=['POST'])
def update_artist_images_endpoint():
    """
    Endpoint to update artist images from Wikipedia
    """
    try:
        if request.is_json:
            request_data = request.get_json()
            
            if 'filename' in request_data:
                filename = request_data['filename']
                artists_without_images = get_artists_without_images(filename)
                
                if not artists_without_images:
                    return jsonify({
                        'status': 'success',
                        'message': 'No artists without images found'
                    })
                
                updated_count = update_artist_images(artists_without_images)
                
                return jsonify({
                    'status': 'success',
                    'message': f'Updated images for {updated_count} out of {len(artists_without_images)} artists',
                    'updated_count': updated_count,
                    'total_count': len(artists_without_images)
                })
            else:
                return jsonify({
                    'status': 'error',
                    'message': 'Request must contain a filename field'
                }), 400
        else:
            return jsonify({
                'status': 'error',
                'message': 'Request must be JSON'
            }), 400
    except Exception as e:
        logger.error(f"Error in update-artist-images endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error updating artist images: {str(e)}'
        }), 500

@app.route('/update-artist-descriptions', methods=['POST'])
def update_artist_descriptions_endpoint():
    """
    Endpoint to update artist descriptions from Wikipedia
    """
    try:
        if request.is_json:
            request_data = request.get_json()
            
            if 'filename' in request_data:
                filename = request_data['filename']
                artists_list = get_items_without_descriptions(filename, 'artists')
                
                if not artists_list:
                    return jsonify({
                        'status': 'success',
                        'message': 'No artists found for description updates'
                    })
                
                updated_count = update_artist_descriptions(artists_list)
                
                return jsonify({
                    'status': 'success',
                    'message': f'Updated descriptions for {updated_count} out of {len(artists_list)} artists',
                    'updated_count': updated_count,
                    'total_count': len(artists_list)
                })
            else:
                return jsonify({
                    'status': 'error',
                    'message': 'Request must contain a filename field'
                }), 400
        else:
            return jsonify({
                'status': 'error',
                'message': 'Request must be JSON'
            }), 400
    except Exception as e:
        logger.error(f"Error in update-artist-descriptions endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error updating artist descriptions: {str(e)}'
        }), 500

@app.route('/update-album-descriptions', methods=['POST'])
def update_album_descriptions_endpoint():
    """
    Endpoint to update album descriptions from Wikipedia
    """
    try:
        if request.is_json:
            request_data = request.get_json()
            
            if 'filename' in request_data:
                filename = request_data['filename']
                albums_list = get_items_without_descriptions(filename, 'albums')
                
                if not albums_list:
                    return jsonify({
                        'status': 'success',
                        'message': 'No albums found for description updates'
                    })
                
                updated_count = update_album_descriptions(albums_list)
                
                return jsonify({
                    'status': 'success',
                    'message': f'Updated descriptions for {updated_count} out of {len(albums_list)} albums',
                    'updated_count': updated_count,
                    'total_count': len(albums_list)
                })
            else:
                return jsonify({
                    'status': 'error',
                    'message': 'Request must contain a filename field'
                }), 400
        else:
            return jsonify({
                'status': 'error',
                'message': 'Request must be JSON'
            }), 400
    except Exception as e:
        logger.error(f"Error in update-album-descriptions endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error updating album descriptions: {str(e)}'
        }), 500

@app.route('/fetch-data', methods=['GET'])
def fetch_data_endpoint():
    """
    Endpoint to fetch data from iTunes API and save to a JSON file
    """
    try:
        logger.info("Starting data fetch process")
        data = fetch_all_data()
        
        # Save the data to a file
        timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"apple_music_data_{timestamp}.json"
        filepath = save_data_to_file(data, filename)
        
        if filepath:
            return jsonify({
                'status': 'success',
                'message': 'Data fetched and saved successfully',
                'filename': filename,
                'filepath': filepath,
                'counts': {
                    'artists': len(data['artists']),
                    'albums': len(data['albums']),
                    'tracks': len(data['tracks']),
                    'music_videos': len(data['music_videos']),
                    'featured_artists': len(data['featured_artists'])
                }
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Error saving data to file'
            }), 500
    except Exception as e:
        logger.error(f"Error in fetch-data endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error fetching data: {str(e)}'
        }), 500

@app.route('/insert-data', methods=['POST'])
def insert_data_endpoint():
    """
    Endpoint to insert data into MySQL database from a JSON file
    """
    try:
        # Check if the request contains a filename to load data from
        if request.is_json:
            request_data = request.get_json()
            
            if 'filename' in request_data:
                filename = request_data['filename']
                data = load_data_from_file(filename)
                
                if data is None:
                    return jsonify({
                        'status': 'error',
                        'message': f'Could not load data from file: {filename}'
                    }), 400
            elif 'data' in request_data:
                # Allow direct data submission as well
                data = request_data['data']
            else:
                return jsonify({
                    'status': 'error',
                    'message': 'Request must contain either a filename or data field'
                }), 400
        else:
            return jsonify({
                'status': 'error',
                'message': 'Request must be JSON'
            }), 400
        
        logger.info("Starting data insertion process")
        
        # Validate data structure
        required_keys = ['artists', 'albums', 'tracks', 'music_videos', 'featured_artists']
        for key in required_keys:
            if key not in data:
                return jsonify({
                    'status': 'error',
                    'message': f'Missing required key in data: {key}'
                }), 400
        
        inserted_counts = insert_data(data)
        
        return jsonify({
            'status': 'success',
            'message': 'Data inserted successfully',
            'inserted_counts': inserted_counts
        })
    except Exception as e:
        logger.error(f"Error in insert-data endpoint: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error inserting data: {str(e)}'
        }), 500

@app.route('/data-files', methods=['GET'])
def list_data_files():
    """
    Endpoint to list all available data files
    """
    try:
        files = [f for f in os.listdir(DATA_FOLDER) if f.endswith('.json')]
        files.sort(reverse=True)  # Most recent first
        
        return jsonify({
            'status': 'success',
            'files': files
        })
    except Exception as e:
        logger.error(f"Error listing data files: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error listing data files: {str(e)}'
        }), 500

@app.route('/download-file/<filename>', methods=['GET'])
def download_file(filename):
    """
    Endpoint to download a specific data file
    """
    try:
        filepath = os.path.join(DATA_FOLDER, filename)
        if os.path.exists(filepath):
            return send_file(filepath, as_attachment=True)
        else:
            return jsonify({
                'status': 'error',
                'message': f'File not found: {filename}'
            }), 404
    except Exception as e:
        logger.error(f"Error downloading file: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'Error downloading file: {str(e)}'
        }), 500

if __name__ == '__main__':
    # Ensure the database has the roles table populated
    try:
        with app.app_context():
            conn = mysql.connection
            cur = conn.cursor()
            
            # Check if roles table is populated
            cur.execute("SELECT COUNT(*) FROM roles")
            count = cur.fetchone()[0]
            
            if count == 0:
                # Insert default roles
                cur.execute("INSERT INTO roles (role_name) VALUES ('admin'), ('customer'), ('premium')")
                conn.commit()
                logger.info("Default roles added to database")
            
            cur.close()
    except Exception as e:
        logger.error(f"Error initializing roles: {str(e)}")
    
    # Ensure data directory exists
    if not os.path.exists(DATA_FOLDER):
        os.makedirs(DATA_FOLDER)
        logger.info(f"Created data directory: {DATA_FOLDER}")
    
    app.run(debug=True, port=5000)