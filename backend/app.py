from flask import Flask, request, jsonify, session
from flask_cors import CORS
from models import Content, Admin
import jwt
import datetime
from functools import wraps
from config import Config

app = Flask(__name__)
app.config['SECRET_KEY'] = Config.SECRET_KEY
CORS(app, origins=['http://localhost', 'http://localhost:80'])

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token:
            return jsonify({'message': 'Token missing!'}), 401
        
        try:
            token = token.split(' ')[1]
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
        except:
            return jsonify({'message': 'Invalid token!'}), 401
        
        return f(*args, **kwargs)
    
    return decorated

# Public routes
@app.route('/api/contents', methods=['GET'])
def get_contents():
    contents = Content.get_all()
    return jsonify(contents), 200

@app.route('/api/contents/<int:content_id>', methods=['GET'])
def get_content(content_id):
    content = Content.get_by_id(content_id)
    if content:
        return jsonify(content), 200
    return jsonify({'message': 'Content not found'}), 404

# Admin routes
@app.route('/api/admin/login', methods=['POST'])
def admin_login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    admin = Admin.authenticate(username, password)
    
    if admin:
        token = jwt.encode({
            'user_id': admin['id'],
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'])
        
        return jsonify({'token': token, 'message': 'Login successful'}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/api/admin/contents', methods=['POST'])
@token_required
def create_content():
    data = request.json
    content_id = Content.create(
        data.get('title'),
        data.get('description'),
        data.get('content_type', 'general')
    )
    return jsonify({'id': content_id, 'message': 'Content created'}), 201

@app.route('/api/admin/contents/<int:content_id>', methods=['PUT'])
@token_required
def update_content(content_id):
    data = request.json
    Content.update(
        content_id,
        data.get('title'),
        data.get('description'),
        data.get('content_type', 'general')
    )
    return jsonify({'message': 'Content updated'}), 200

@app.route('/api/admin/contents/<int:content_id>', methods=['DELETE'])
@token_required
def delete_content(content_id):
    Content.delete(content_id)
    return jsonify({'message': 'Content deleted'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)