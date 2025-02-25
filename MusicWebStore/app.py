from flask import Flask, request, jsonify, render_template
from flask_mysqldb import MySQL
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

@app.route('/login')
def login_register():
    return render_template('login_register_page.html')

@app.route('/product/<int:product_id>')
def product_page(product_id):
    return render_template('product_page.html', product_id=product_id)

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