from flask import Flask, render_template #install the package -> pip install flask mysql-connector-python
import mysql.connector #install the package ->  pip install mysql-connector-python

app = Flask(__name__)

def get_database_connection():
    connection = mysql.connector.connect(
        host = 'localhost',
        user = 'root',
        password = '',
        database = 'webstore'
    )
    return connection

def get_music():
    conn = get_database_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT `name`, `author`, `price`, `type` FROM `music`')

    music = cursor.fetchall()

    cursor.close()
    conn.close()
    return music

def get_dynamic_filter():
    # Connect to the MySQL database
    conn = get_database_connection()
    cursor = conn.cursor()

    # Fetch categories from the categories table
    cursor.execute("SELECT * FROM categories")
    categories = cursor.fetchall()

    # Fetch options for each category
    categories_with_options = []
    for category in categories:
        category_id = category[0]
        cursor.execute(f"SELECT * FROM music_authors WHERE category_id = {category_id} UNION ALL SELECT * FROM type_music WHERE category_id = {category_id}")
        #options = cursor.fetchall()
        #cursor.execute("SELECT * FROM type_music WHERE category_id = %s", (category_id))
        options = cursor.fetchall()
        
        categories_with_options.append({
            'category_name': category[1],
            'options': options
        })
        
    cursor.close()
    conn.close()

    # Render HTML with data passed to the template
    return categories_with_options
@app.route('/')
def all():
    music = get_music()
    categories_with_options = get_dynamic_filter()
    return render_template('test.html', music = music, categories_with_options = categories_with_options)

if __name__ == '__main__':
    app.run(debug = True)