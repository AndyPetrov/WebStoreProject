from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import os
import json

app = Flask(__name__, static_folder='static')
app.secret_key = 'your secret key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = '' 
app.config['MYSQL_DB'] = 'webstore'

mysql = MySQL(app)

# Frontend routes - serve HTML templates
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login', methods=['GET'])
def login_page():
    return render_template('login_register_page.html')

@app.route('/products')
def products_page():
    return render_template('products_page.html')

@app.route('/tracks')
def tracks_page():
    return render_template('tracks_page.html')

@app.route('/artists')
def artists_page():
    return render_template('artists_page.html')

@app.route('/artist/<artist_id>')
def artist_page(artist_id):
    return render_template('artist_page.html')

@app.route('/product/<album_id>')
def product_page(album_id):
    return render_template('product_page.html')

@app.route('/track/<track_id>')
def track_page(track_id):
    return render_template('track_page.html')

@app.route('/profile')
def profile_page():
    if 'user_id' not in session:
        return redirect(url_for('login_page'))
    return render_template('profile_page.html')

@app.route('/player')
def player_page():
    return render_template('player.html')

# Authentication API routes
@app.route('/api/auth/status', methods=['GET'])
def user_status():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'username': session['username']})
    return jsonify({'logged_in': False})

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT user_id, username, password FROM users WHERE username = %s", (username,))
    user = cursor.fetchone()
    if user and check_password_hash(user[2], password):
        session['user_id'] = user[0]
        session['username'] = user[1]
        return jsonify({"message": "Login successful"}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401

@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.json
    username = data.get("username")
    name = data.get("name")
    surname = data.get("surname")
    email = data.get("email")
    password = generate_password_hash(data.get("password"))
    role_id = 2

    cursor = mysql.connection.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, name, surname, email, password, role_id) VALUES (%s, %s, %s, %s, %s, %s)", 
            (username, name, surname, email, password, role_id)
        )
        mysql.connection.commit()
        return jsonify({"message": "Registration successful"}), 201
    except Exception as e:
        return jsonify({"error": "Username or email already exists"}), 400

@app.route('/api/auth/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return jsonify({"message": "Logout successful"}), 200

# User API routes
@app.route('/api/user/profile', methods=['GET'])
def user_profile():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    
    try:
        cursor = mysql.connection.cursor()
        cursor.execute(
            """
            SELECT username, name, surname, email, 
                IFNULL(profile_picture_url, '') as profile_picture 
            FROM users 
            WHERE user_id = %s
            """, 
            (session['user_id'],)
        )
        user = cursor.fetchone()
        cursor.close()
        
        if not user:
            return jsonify({"error": "User not found"}), 404
        
        user_data = {
            "username": user[0],
            "name": user[1],
            "surname": user[2],
            "email": user[3],
            "profile_picture": user[4] or "/static/images/default_profile_picture.png"
        }
        
        return jsonify(user_data)
    except Exception as e:
        print(f"Error in user_profile: {str(e)}")
        return jsonify({"error": "Database error occurred"}), 500

@app.route('/api/user/subscription', methods=['GET'])
def user_subscription():
    if 'user_id' not in session:
        return jsonify({"error": "Not logged in"}), 401
    
    cursor = mysql.connection.cursor()
    cursor.execute("""            
        SELECT subT.type_name, sub.start_date, sub.end_date, sub.status, subT.price
        FROM subscriptions AS sub
        JOIN subscription_types subT ON subT.subscription_type_id = sub.subscription_type_id
        WHERE sub.user_id  = %s""", 
        (session['user_id'],)
    )
    subscription = cursor.fetchone()
    cursor.close()

    if not subscription:
        return jsonify({"error": "Subscription not found"}), 404

    subscription_data = {
        "type": subscription[0],
        "start_date": subscription[1].strftime('%Y-%m-%d'),
        "end_date": subscription[2].strftime('%Y-%m-%d'),
        "status": subscription[3],
        "price": float(subscription[4])
    }

    return jsonify(subscription_data), 200

# Albums API routes
@app.route('/api/albums', methods=['GET'])
def albums_list():
    try:
        search_term = request.args.get('query', '').strip()
        
        page = request.args.get('page', type=int, default=1)
        per_page = request.args.get('per_page', type=int, default=30)
        offset = (page - 1) * per_page
        
        filters = request.args.getlist('filter')
        artists = request.args.getlist('artist')
        min_price = request.args.get('min_price', type=float, default=0)
        max_price = request.args.get('max_price', type=float)
        
        sort_param = request.args.get('sort', 'albums.title-asc')
        if '-' in sort_param:
            sort_by, order = sort_param.split('-')
            order = "ASC" if order.lower() == "asc" else "DESC"
        else:
            sort_by = "albums.title"
            order = "ASC"
        
        valid_sort_fields = ["albums.title", "albums.price", "albums.release_date", "artists.name"]
        if sort_by not in valid_sort_fields:
            sort_by = "albums.title"
        
        base_query = """
            FROM albums 
            JOIN artists ON albums.artist_id = artists.artist_id
            JOIN genres ON albums.genre_id = genres.genre_id
        """
        
        conditions = []
        params = []
        
        if search_term:
            conditions.append("LOWER(albums.title) LIKE LOWER(%s) OR LOWER(artists.name) LIKE LOWER(%s)")
            params.append(f"%{search_term}%")
            params.append(f"%{search_term}%")
        
        if min_price is not None:
            conditions.append("albums.price >= %s")
            params.append(min_price)
        
        if max_price is not None:
            conditions.append("albums.price <= %s")
            params.append(max_price)
        
        if filters:
            placeholders = ', '.join(['%s'] * len(filters))
            conditions.append(f"LOWER(genres.genre_name) IN ({placeholders})")
            params.extend([filter_value.lower() for filter_value in filters])
        
        if artists:
            placeholders = ', '.join(['%s'] * len(artists))
            conditions.append(f"artists.artist_id IN ({placeholders})")
            params.extend([artist_id for artist_id in artists])
        
        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        
        # Get total count for pagination
        count_query = "SELECT COUNT(DISTINCT albums.album_id) " + base_query + where_clause
        
        # Build data query with pagination
        data_query = """
            SELECT albums.album_id, albums.title, artists.name, albums.price, albums.cover_image_url
        """ + base_query + where_clause + f" ORDER BY {sort_by} {order} LIMIT %s OFFSET %s"
        
        # Execute count query
        cursor = mysql.connection.cursor()
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()[0]
        
        # Execute data query with pagination
        data_params = params.copy()
        data_params.extend([per_page, offset])
        cursor.execute(data_query, data_params)
        albums = cursor.fetchall()
        cursor.close()
        
        # Format results
        albums_list = [
            {
                "id": album[0],
                "title": album[1],
                "artist": album[2],
                "price": float(album[3]),
                "cover": album[4]
            } for album in albums
        ]
        
        # Return data with pagination metadata
        return jsonify({
            "albums": albums_list,
            "page": page,
            "per_page": per_page,
            "total": total_count,
            "has_more": total_count > (page * per_page)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/albums/<album_id>', methods=['GET'])
def album_details(album_id):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """
        SELECT albums.album_id, albums.title, albums.artist_id, artists.name, 
               albums.price, albums.cover_image_url,
               genres.genre_name
        FROM albums 
        JOIN artists ON albums.artist_id = artists.artist_id 
        JOIN genres ON albums.genre_id = genres.genre_id
        WHERE albums.album_id = %s
        """, (album_id,)
    )
    album = cursor.fetchone()
    cursor.close()
    
    if album:
        album_data = {
            "album_id": album[0],
            "title": album[1],
            "artist_id": album[2],
            "artist": album[3],
            "price": float(album[4]),
            "cover_image_url": album[5],
            "genre": album[6]
        }
        return jsonify(album_data)
    else:
        return jsonify({"error": "Album not found"}), 404

@app.route('/api/albums/<album_id>/tracks', methods=['GET'])
def album_tracks(album_id):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """
        SELECT track_number, title, duration_milliseconds, preview_url
        FROM tracks
        WHERE album_id = %s
        """, (album_id,)
    )
    tracks = cursor.fetchall()
    cursor.close()
    
    tracks_list = [
        {
            "pos": track[0],
            "title": track[1],
            "duration": format_duration(track[2]),
            "preview_url": track[3] 
        } for track in tracks
    ]
    
    return jsonify(tracks_list)

# Artists API routes
@app.route('/api/artists', methods=['GET'])
def artists_list():
    try:
        search_term = request.args.get('query', '').strip()
        page = request.args.get('page', type=int, default=1)
        per_page = request.args.get('per_page', type=int, default=30)
        offset = (page - 1) * per_page

        filters = request.args.getlist('filter')  # Genre filters

        sort_param = request.args.get('sort', 'artists.name-asc')
        if '-' in sort_param:
            sort_by, order = sort_param.split('-')
            order = "ASC" if order.lower() == "asc" else "DESC"
        else:
            sort_by = "artists.name"
            order = "ASC"

        # Validate sort field
        valid_sort_fields = ["artists.name"]
        if sort_by not in valid_sort_fields:
            sort_by = "artists.name"

        # Base FROM and JOINs
        base_query = """
            FROM artists
            LEFT JOIN albums ON artists.artist_id = albums.artist_id
            LEFT JOIN genres ON albums.genre_id = genres.genre_id
        """

        # Conditions and parameters
        conditions = []
        params = []

        if search_term:
            conditions.append("LOWER(artists.name) LIKE LOWER(%s)")
            params.append(f"%{search_term}%")

        if filters:
            placeholders = ', '.join(['%s'] * len(filters))
            conditions.append(f"LOWER(genres.genre_name) IN ({placeholders})")
            params.extend([filter_value.lower() for filter_value in filters])

        # WHERE clause
        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""

        # GROUP BY to prevent duplicates
        group_by = " GROUP BY artists.artist_id "

        # Total count query (without LEFT JOIN on albums/genres to prevent overcounting)
        count_query = f"SELECT COUNT(DISTINCT artists.artist_id) FROM artists {where_clause}"

        # Data query with DISTINCT and pagination
        data_query = f"""
            SELECT 
                artists.artist_id,
                artists.name,
                MAX(genres.genre_name) AS genre_name,  -- Picking one genre if multiple
                artists.artist_image_url,
                COUNT(DISTINCT albums.album_id) AS album_count
            {base_query}
            {where_clause}
            {group_by}
            ORDER BY {sort_by} {order}
            LIMIT %s OFFSET %s
        """

        # DB connection & execution
        cursor = mysql.connection.cursor()

        # Execute count query
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()[0]

        # Execute data query with pagination
        data_params = params + [per_page, offset]
        cursor.execute(data_query, data_params)
        artists = cursor.fetchall()
        cursor.close()

        # Formatting results
        artists_list = [
            {
                "artist_id": artist[0],
                "name": artist[1],
                "genre": artist[2],
                "artist_url": artist[3],
                "album_count": artist[4]
            } for artist in artists
        ]

        # Return JSON response with pagination
        return jsonify({
            "artists": artists_list,
            "page": page,
            "per_page": per_page,
            "total": total_count,
            "has_more": total_count > (page * per_page)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/artists/<artist_id>', methods=['GET'])
def artist_details(artist_id):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """
        SELECT artists.artist_id, artists.name, genres.genre_name, artists.artist_image_url
        FROM artists
        LEFT JOIN albums ON artists.artist_id = albums.artist_id
        LEFT JOIN genres ON albums.genre_id = genres.genre_id
        WHERE artists.artist_id = %s
        GROUP BY artists.artist_id
        """, (artist_id,)
    )
    artist = cursor.fetchone()
    cursor.close()
    
    if artist:
        artist_data = {
            "artist_id": artist[0],
            "name": artist[1],
            "genre": artist[2],
            "artist_image_url": artist[3]
        }
        return jsonify(artist_data)
    else:
        return jsonify({"error": "Artist not found"}), 404

# Tracks API routes
@app.route('/api/tracks', methods=['GET'])
def tracks_list():
    try:
        search_term = request.args.get('query', '').strip()
        
        page = request.args.get('page', type=int, default=1)
        per_page = request.args.get('per_page', type=int, default=30)
        offset = (page - 1) * per_page
        
        filters = request.args.getlist('filter')
        artists = request.args.getlist('artist')
        min_price = request.args.get('min_price', type=float, default=0)
        max_price = request.args.get('max_price', type=float)
        
        sort_param = request.args.get('sort', 'tracks.title-asc')
        if '-' in sort_param:
            sort_by, order = sort_param.split('-')
            order = "ASC" if order.lower() == "asc" else "DESC"
        else:
            sort_by = "tracks.title"
            order = "ASC"
        
        valid_sort_fields = ["tracks.title", "tracks.price", "artists.name", "tracks.track_number"]
        if sort_by not in valid_sort_fields:
            sort_by = "tracks.title"
        
        base_query = """
            FROM tracks 
            JOIN artists ON tracks.artist_id = artists.artist_id
            JOIN albums ON tracks.album_id = albums.album_id
            JOIN genres ON albums.genre_id = genres.genre_id
        """
        
        conditions = []
        params = []
        
        if search_term:
            conditions.append("(LOWER(tracks.title) LIKE LOWER(%s) OR LOWER(artists.name) LIKE LOWER(%s) OR LOWER(albums.title) LIKE LOWER(%s))")
            params.extend([f"%{search_term}%", f"%{search_term}%", f"%{search_term}%"])
        
        if min_price is not None:
            conditions.append("tracks.price >= %s")
            params.append(min_price)
        
        if max_price is not None:
            conditions.append("tracks.price <= %s")
            params.append(max_price)
        
        if filters:
            placeholders = ', '.join(['%s'] * len(filters))
            conditions.append(f"LOWER(genres.genre_name) IN ({placeholders})")
            params.extend([filter_value.lower() for filter_value in filters])
        
        if artists:
            placeholders = ', '.join(['%s'] * len(artists))
            conditions.append(f"artists.artist_id IN ({placeholders})")
            params.extend([artist_id for artist_id in artists])
        
        where_clause = " WHERE " + " AND ".join(conditions) if conditions else ""
        
        # Get total count for pagination
        count_query = "SELECT COUNT(DISTINCT tracks.track_id) " + base_query + where_clause
        
        # Build data query with pagination
        data_query = """
            SELECT tracks.track_id, tracks.title, artists.name, albums.title, 
                   tracks.price, albums.cover_image_url, tracks.preview_url,
                   tracks.duration_milliseconds, tracks.track_number
        """ + base_query + where_clause + f" ORDER BY {sort_by} {order} LIMIT %s OFFSET %s"
        
        # Execute count query
        cursor = mysql.connection.cursor()
        cursor.execute(count_query, params)
        total_count = cursor.fetchone()[0]
        
        # Execute data query with pagination
        data_params = params.copy()
        data_params.extend([per_page, offset])
        cursor.execute(data_query, data_params)
        tracks = cursor.fetchall()
        cursor.close()
        
        # Format results
        tracks_list = [
            {
                "id": track[0],
                "title": track[1],
                "artist": track[2],
                "album": track[3],
                "price": float(track[4]),
                "album_cover": track[5],
                "preview_url": track[6],
                "duration": format_duration(track[7]),
                "track_number": track[8]
            } for track in tracks
        ]
        
        # Return data with pagination metadata
        return jsonify({
            "tracks": tracks_list,
            "page": page,
            "per_page": per_page,
            "total": total_count,
            "has_more": total_count > (page * per_page)
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/tracks/<track_id>', methods=['GET'])
def track_details(track_id):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """
        SELECT tracks.track_id, tracks.title, tracks.artist_id, artists.name, 
               tracks.album_id, albums.title, tracks.price, albums.cover_image_url,
               tracks.duration_milliseconds, tracks.track_number, tracks.preview_url,
               genres.genre_name
        FROM tracks 
        JOIN artists ON tracks.artist_id = artists.artist_id 
        JOIN albums ON tracks.album_id = albums.album_id
        JOIN genres ON albums.genre_id = genres.genre_id
        WHERE tracks.track_id = %s
        """, (track_id,)
    )
    track = cursor.fetchone()
    cursor.close()
    
    if track:        
        track_data = {
            "track_id": track[0],
            "title": track[1],
            "artist_id": track[2],
            "artist": track[3],
            "album_id": track[4],
            "album": track[5],
            "price": float(track[6]),
            "cover_image_url": track[7],
            "duration": format_duration(track[8]),
            "track_number": track[9],
            "preview_url": track[10],
            "genre": track[11]
        }
        return jsonify(track_data)
    else:
        return jsonify({"error": "Track not found"}), 404

# Other utility API routes
@app.route('/api/genres', methods=['GET'])
def genres_list():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT genre_name FROM genres")
        genres = cursor.fetchall()
        cursor.close()
        
        genres_list = [genre[0].lower() for genre in genres]
        return jsonify(genres_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Helper functions
def format_duration(milliseconds):
    """Format milliseconds to minutes:seconds format"""
    seconds = milliseconds // 1000
    minutes = seconds // 60
    remaining_seconds = seconds % 60
    return f"{minutes}:{remaining_seconds:02d}"

if __name__ == "__main__":
    app.run(debug=True)