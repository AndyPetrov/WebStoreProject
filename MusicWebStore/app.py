from flask import Flask, request, jsonify, render_template, session, redirect, url_for
from flask_mysqldb import MySQL
from werkzeug.security import generate_password_hash, check_password_hash
import mysql

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

#Работи само ако паролите в базата данни са хеширани. Трябва да оправим базата данни,
#но дотогава просто създайвайте акаунти при тестване
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST': #Може да се избегне проверка, но нека е така, защото не пречи
        data = request.json
        username = data.get("username")
        password = data.get("password") #Няма нужда да я хешираме тук

        cursor = mysql.connection.cursor()

        cursor.execute("SELECT user_id, username, password FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if user and check_password_hash(user[2], password): #Метода я хешира и сравнява двете хеширани пароли
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
    except:
        return jsonify({"error": "Username or email already exists"}), 400

    return render_template('login_register_page.html') #Знам че няма де се стигне дотук но нека стои за сега

@app.route('/logout') #Не се използва никъде. Трябва да направим бутон за logout
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
        """
        , (product_id,))
    album = cursor.fetchone()
    cursor.close()

    if album:
        return render_template("product_page.html", album=album)
    else:
        return "Product Not Found", 404

def get_albums(filters=None, min_price=None, max_price=None, sort_by=None, order="ASC"):
    cursor = mysql.connection.cursor()

    query = """
        SELECT albums.album_id, albums.title, artists.name, albums.price, albums.cover_image_url
        FROM albums 
        JOIN artists ON albums.artist_id = artists.artist_id
        Join genres ON albums.genre_id = genres.genre_id
    """
    params = []
    conditions = []

    if min_price is not None:
        conditions.append("albums.price >= %s")
        params.append(min_price)

    if max_price is not None:
        conditions.append("albums.price <= %s")
        params.append(max_price)

    if filters and len(filters) > 0:
        placeholders = ', '.join(['%s'] * len(filters))
        conditions.append(f"genres.genre_name IN ({placeholders})")
        params.extend(filters)

    if conditions:
        query += " WHERE " + " AND ".join(conditions)

    if sort_by:
        query += f" ORDER BY {sort_by} {order}"
    else:
        query += " ORDER BY albums.title ASC"

    cursor.execute(query, params)
    albums = cursor.fetchall()

    cursor.close()
    return albums



@app.route('/api/albums', methods=['GET'])
def albums():
    filters = request.args.getlist('filter')  
    min_price = request.args.get('min_price', type=float, default=0)
    max_price = request.args.get('max_price', type=float) if request.args.get('max_price') else None
    
    sort_param = request.args.get('sort', 'title-asc').split('-')
    sort_by, order = sort_param[0], "ASC" if sort_param[1].lower() == "asc" else "DESC"

    albums = get_albums(filters, min_price, max_price, sort_by, order)
    
    albums_list = [
        {
            "id": album[0],
            "title": album[1],
            "artist": album[2],
            "price": album[3],
            "cover": album[4]
        } for album in albums
    ]

    return jsonify(albums_list)


@app.route('/products')
def products_page():
    get_albums()
    return render_template('products_page.html')

@app.route('/profile')
def profile_page():
    return render_template('profile_page.html')

if __name__ == "__main__":
    app.run(debug = True)