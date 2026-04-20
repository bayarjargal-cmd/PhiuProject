import pymysql
from config import Config

def get_db_connection():
    return pymysql.connect(
        host=Config.MYSQL_HOST,
        user=Config.MYSQL_USER,
        password=Config.MYSQL_PASSWORD,
        database=Config.MYSQL_DB,
        cursorclass=pymysql.cursors.DictCursor
    )

class Content:
    @staticmethod
    def get_all():
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM contents ORDER BY created_at DESC")
            result = cursor.fetchall()
        conn.close()
        return result
    
    @staticmethod
    def get_by_id(content_id):
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM contents WHERE id = %s", (content_id,))
            result = cursor.fetchone()
        conn.close()
        return result
    
    @staticmethod
    def create(title, description, content_type):
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "INSERT INTO contents (title, description, content_type) VALUES (%s, %s, %s)",
                (title, description, content_type)
            )
            conn.commit()
            new_id = cursor.lastrowid
        conn.close()
        return new_id
    
    @staticmethod
    def update(content_id, title, description, content_type):
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute(
                "UPDATE contents SET title = %s, description = %s, content_type = %s WHERE id = %s",
                (title, description, content_type, content_id)
            )
            conn.commit()
        conn.close()
        return True
    
    @staticmethod
    def delete(content_id):
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("DELETE FROM contents WHERE id = %s", (content_id,))
            conn.commit()
        conn.close()
        return True

class Admin:
    @staticmethod
    def authenticate(username, password):
        conn = get_db_connection()
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM admins WHERE username = %s", (username,))
            admin = cursor.fetchone()
        conn.close()
        
        if admin and password == admin['password']:  # In production, use bcrypt
            return admin
        return None