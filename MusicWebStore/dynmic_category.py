from flask import Flask, render_template
import mysql.connector

app = Flask(__name__)

def get_database_connection():
    connection = mysql.connector.connect(
        host='26.61.144.216',
        user='tonkata',
        password='123',
        database='webstore'
    )
    return connection

# Get the genres from the database
def get_genres():
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT `genre_id`, `genre_name` FROM `genres`')
    genres = cursor.fetchall()
    cursor.close()
    conn.close()
    return genres

# Get the albums from the database
def get_albums():
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT `album_id`, `title`, `genre_id`, `artist_id`, `price` FROM `albums`')
    albums = cursor.fetchall()
    cursor.close()
    conn.close()
    return albums

# Get the artists from the database
def get_artists():
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT `artist_id`, `name` FROM `artists`')
    artists = cursor.fetchall()
    cursor.close()
    conn.close()
    return artists

# Get dynamic filters (categories with options) from the database
def get_dynamic_filter():
    categories = ['By genre', 'By artist']
    artists = get_artists()
    genres = get_genres()
    categories_with_options = []

    for category in categories:
        if category == 'By genre':
            list_genre = [{"id": genre_id, "name": genre_name} for genre_id, genre_name in genres]
            categories_with_options.append({'category_name': category, 'options': list_genre})

        elif category == 'By artist':
            list_artist = [{"id": artist_id, "name": artist_name} for artist_id, artist_name in artists]
            categories_with_options.append({'category_name': category, 'options': list_artist})

    return categories_with_options

@app.route('/')
def all():
    artists = get_artists()
    genres = get_genres()
    albums = get_albums()
    categories_with_options = get_dynamic_filter()

    # Pass all the data to the template
    return render_template('products_page.html', artists=artists, genres=genres, albums=albums, categories_with_options=categories_with_options)

if __name__ == '__main__':
    app.run(debug=True)
