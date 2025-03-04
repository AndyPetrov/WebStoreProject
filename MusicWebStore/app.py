from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__, static_folder='static')
app.secret_key = 'your secret key'

app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'webstore'

mysql = MySQL(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/user_status', methods=['GET'])
def user_status():
    if 'user_id' in session:
        return jsonify({'logged_in': True, 'username': session['username']})
    return jsonify({'logged_in': False})

@app.route('/api/user_subscription', methods=['GET'])
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
        return jsonify({"error": f"Subscription not found {session['user_id']}"}), 404

    subscription_data = {
        "type": subscription[0],
        "start_date": subscription[1].strftime('%Y-%m-%d'),
        "end_date": subscription[2].strftime('%Y-%m-%d'),
        "status": subscription[3],
        "price": float(subscription[4])
    }

    return jsonify(subscription_data), 200

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
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
    return render_template('login_register_page.html')

@app.route('/register', methods=['POST'])
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

@app.route('/logout')
def logout():
    session.pop('user_id', None)
    session.pop('username', None)
    return redirect(url_for('index'))

@app.route('/product/<int:product_id>')
def product_page(product_id):
    cursor = mysql.connection.cursor()
    cursor.execute(
        """
        SELECT albums.album_id, albums.title, artists.name, albums.price, albums.cover_image_url
        FROM albums 
        JOIN artists ON albums.artist_id = artists.artist_id 
        WHERE albums.album_id = %s
        """, (product_id,)
    )
    album = cursor.fetchone()
    cursor.close()
    
    if album:
        return render_template("product_page.html", album=album)
    else:
        return "Product Not Found", 404

@app.route('/api/genres', methods=['GET'])
def genres():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT genre_name FROM genres")
        genres = cursor.fetchall()
        cursor.close()
        
        genres_list = [genre[0].lower() for genre in genres]
        return jsonify(genres_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/api/artists', methods=['GET'])
def artists():
    try:
        cursor = mysql.connection.cursor()
        cursor.execute("SELECT artist_id, name FROM artists")
        artists = cursor.fetchall()
        cursor.close()
        
        artists_list = [{"id": artist[0], "name": artist[1]} for artist in artists]
        return jsonify(artists_list)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/albums', methods=['GET'])
def albums():
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
            params.extend([int(artist_id) for artist_id in artists])
        
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

@app.route('/products')
def products_page():
    return render_template('products_page.html')

@app.route('/profile')
def profile_page():
    if 'user_id' not in session:
        return redirect(url_for('login'))
    return render_template('profile_page.html')

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
        
        # Map the database result to a JSON object
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

if __name__ == "__main__":
    app.run(debug=True)