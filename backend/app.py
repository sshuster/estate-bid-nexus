
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os
import jwt
from datetime import datetime, timedelta
from werkzeug.security import generate_password_hash, check_password_hash
import uuid

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Secret key for JWT
app.config['SECRET_KEY'] = 'your_secret_key_here'  # In production, use an environment variable

# Database setup
DB_PATH = os.path.join(os.path.dirname(__file__), 'database.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    
    # Create users table
    conn.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    ''')
    
    # Create properties table
    conn.execute('''
    CREATE TABLE IF NOT EXISTS properties (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        type TEXT NOT NULL,
        property_type TEXT NOT NULL,
        price REAL NOT NULL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        area REAL NOT NULL,
        street TEXT,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        zip_code TEXT,
        features TEXT,
        images TEXT,
        owner_id TEXT NOT NULL,
        status TEXT NOT NULL,
        listed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id)
    )
    ''')
    
    # Create bids table
    conn.execute('''
    CREATE TABLE IF NOT EXISTS bids (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        amount REAL NOT NULL,
        message TEXT,
        status TEXT NOT NULL,
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties (id),
        FOREIGN KEY (user_id) REFERENCES users (id)
    )
    ''')
    
    # Create contracts table
    conn.execute('''
    CREATE TABLE IF NOT EXISTS contracts (
        id TEXT PRIMARY KEY,
        property_id TEXT NOT NULL,
        owner_id TEXT NOT NULL,
        agent_id TEXT NOT NULL,
        commission REAL NOT NULL,
        status TEXT NOT NULL,
        start_date TIMESTAMP,
        end_date TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (property_id) REFERENCES properties (id),
        FOREIGN KEY (owner_id) REFERENCES users (id),
        FOREIGN KEY (agent_id) REFERENCES users (id)
    )
    ''')
    
    # Add mock users if they don't exist
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username='muser'")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
            ('user-1', 'muser', 'muser@example.com', generate_password_hash('muser'), 'user')
        )
    
    cursor.execute("SELECT * FROM users WHERE username='mvc'")
    if not cursor.fetchone():
        cursor.execute(
            "INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
            ('admin-1', 'mvc', 'mvc@example.com', generate_password_hash('mvc'), 'admin')
        )
    
    conn.commit()
    conn.close()

# Generate JWT token
def generate_token(user_id, username, role):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': user_id,
        'username': username,
        'role': role
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

# Middleware to check if user is authenticated
def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        try:
            data = jwt.decode(token, app.config.get('SECRET_KEY'), algorithms=['HS256'])
            user_id = data['sub']
            
            conn = get_db_connection()
            cursor = conn.cursor()
            cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
            current_user = cursor.fetchone()
            conn.close()
            
            if not current_user:
                return jsonify({'message': 'User not found'}), 401
        except:
            return jsonify({'message': 'Token is invalid'}), 401
        
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

# Admin check middleware
def admin_required(f):
    def decorated(current_user, *args, **kwargs):
        if current_user['role'] != 'admin':
            return jsonify({'message': 'Admin privilege required'}), 403
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

# Initialize database
init_db()

# Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if required fields are present
    required_fields = ['username', 'email', 'password']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if username or email already exists
    cursor.execute("SELECT * FROM users WHERE username = ? OR email = ?", 
                   (data['username'], data['email']))
    user = cursor.fetchone()
    
    if user:
        conn.close()
        return jsonify({'message': 'Username or email already exists'}), 409
    
    # Create new user
    user_id = str(uuid.uuid4())
    hashed_password = generate_password_hash(data['password'])
    role = 'user'  # Default role for new users
    
    cursor.execute(
        "INSERT INTO users (id, username, email, password, role) VALUES (?, ?, ?, ?, ?)",
        (user_id, data['username'], data['email'], hashed_password, role)
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'User registered successfully', 'user_id': user_id}), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'message': 'Username and password are required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM users WHERE username = ?", (data['username'],))
    user = cursor.fetchone()
    conn.close()
    
    if not user or not check_password_hash(user['password'], data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = generate_token(user['id'], user['username'], user['role'])
    
    return jsonify({
        'id': user['id'],
        'username': user['username'],
        'email': user['email'],
        'role': user['role'],
        'token': token
    })

# Property routes
@app.route('/api/properties', methods=['GET'])
def get_properties():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties")
    properties = cursor.fetchall()
    conn.close()
    
    result = []
    for property in properties:
        prop_dict = dict(property)
        if prop_dict['features']:
            prop_dict['features'] = prop_dict['features'].split(',')
        if prop_dict['images']:
            prop_dict['images'] = prop_dict['images'].split(',')
        result.append(prop_dict)
    
    return jsonify(result)

@app.route('/api/properties/<property_id>', methods=['GET'])
def get_property(property_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    property = cursor.fetchone()
    conn.close()
    
    if not property:
        return jsonify({'message': 'Property not found'}), 404
    
    prop_dict = dict(property)
    if prop_dict['features']:
        prop_dict['features'] = prop_dict['features'].split(',')
    if prop_dict['images']:
        prop_dict['images'] = prop_dict['images'].split(',')
    
    return jsonify(prop_dict)

@app.route('/api/properties', methods=['POST'])
@token_required
def create_property(current_user):
    data = request.get_json()
    
    # Check required fields
    required_fields = ['title', 'type', 'propertyType', 'price', 'area', 'city', 'state']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    property_id = str(uuid.uuid4())
    
    # Process features and images if present
    features = ','.join(data.get('features', [])) if data.get('features') else None
    images = ','.join(data.get('images', [])) if data.get('images') else None
    
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        """
        INSERT INTO properties 
        (id, title, description, type, property_type, price, bedrooms, bathrooms, area, 
         street, city, state, zip_code, features, images, owner_id, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            property_id, 
            data['title'], 
            data.get('description'), 
            data['type'], 
            data['propertyType'], 
            data['price'], 
            data.get('bedrooms'), 
            data.get('bathrooms'), 
            data['area'], 
            data.get('street'), 
            data['city'], 
            data['state'], 
            data.get('zipCode'), 
            features, 
            images, 
            current_user['id'], 
            'active'
        )
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Property created successfully', 'property_id': property_id}), 201

@app.route('/api/properties/<property_id>', methods=['PUT'])
@token_required
def update_property(current_user, property_id):
    data = request.get_json()
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if property exists and belongs to the user
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    property = cursor.fetchone()
    
    if not property:
        conn.close()
        return jsonify({'message': 'Property not found'}), 404
    
    if property['owner_id'] != current_user['id'] and current_user['role'] != 'admin':
        conn.close()
        return jsonify({'message': 'Unauthorized to update this property'}), 403
    
    # Process features and images if present
    features = ','.join(data.get('features', [])) if data.get('features') else None
    images = ','.join(data.get('images', [])) if data.get('images') else None
    
    # Update property
    cursor.execute(
        """
        UPDATE properties SET 
        title = ?, description = ?, type = ?, property_type = ?, price = ?, 
        bedrooms = ?, bathrooms = ?, area = ?, street = ?, city = ?, 
        state = ?, zip_code = ?, features = ?, images = ?, status = ? 
        WHERE id = ?
        """,
        (
            data.get('title', property['title']), 
            data.get('description', property['description']), 
            data.get('type', property['type']), 
            data.get('propertyType', property['property_type']), 
            data.get('price', property['price']), 
            data.get('bedrooms', property['bedrooms']), 
            data.get('bathrooms', property['bathrooms']), 
            data.get('area', property['area']), 
            data.get('street', property['street']), 
            data.get('city', property['city']), 
            data.get('state', property['state']), 
            data.get('zipCode', property['zip_code']), 
            features if features is not None else property['features'], 
            images if images is not None else property['images'], 
            data.get('status', property['status']), 
            property_id
        )
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Property updated successfully'})

@app.route('/api/properties/<property_id>', methods=['DELETE'])
@token_required
def delete_property(current_user, property_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if property exists and belongs to the user
    cursor.execute("SELECT * FROM properties WHERE id = ?", (property_id,))
    property = cursor.fetchone()
    
    if not property:
        conn.close()
        return jsonify({'message': 'Property not found'}), 404
    
    if property['owner_id'] != current_user['id'] and current_user['role'] != 'admin':
        conn.close()
        return jsonify({'message': 'Unauthorized to delete this property'}), 403
    
    # Delete property
    cursor.execute("DELETE FROM properties WHERE id = ?", (property_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Property deleted successfully'})

# Bid routes
@app.route('/api/bids', methods=['POST'])
@token_required
def create_bid(current_user):
    data = request.get_json()
    
    # Check required fields
    required_fields = ['propertyId', 'amount']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if property exists
    cursor.execute("SELECT * FROM properties WHERE id = ?", (data['propertyId'],))
    property = cursor.fetchone()
    
    if not property:
        conn.close()
        return jsonify({'message': 'Property not found'}), 404
    
    bid_id = str(uuid.uuid4())
    
    cursor.execute(
        "INSERT INTO bids (id, property_id, user_id, amount, message, status) VALUES (?, ?, ?, ?, ?, ?)",
        (bid_id, data['propertyId'], current_user['id'], data['amount'], data.get('message'), 'pending')
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Bid created successfully', 'bid_id': bid_id}), 201

@app.route('/api/bids/property/<property_id>', methods=['GET'])
def get_bids_by_property(property_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bids WHERE property_id = ?", (property_id,))
    bids = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(bid) for bid in bids])

@app.route('/api/bids/user', methods=['GET'])
@token_required
def get_bids_by_user(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bids WHERE user_id = ?", (current_user['id'],))
    bids = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(bid) for bid in bids])

@app.route('/api/bids/<bid_id>/status', methods=['PUT'])
@token_required
def update_bid_status(current_user, bid_id):
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({'message': 'Status is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get bid and check property owner
    cursor.execute("""
        SELECT b.*, p.owner_id 
        FROM bids b 
        JOIN properties p ON b.property_id = p.id 
        WHERE b.id = ?
    """, (bid_id,))
    bid = cursor.fetchone()
    
    if not bid:
        conn.close()
        return jsonify({'message': 'Bid not found'}), 404
    
    # Only property owner or admin can update bid status
    if bid['owner_id'] != current_user['id'] and current_user['role'] != 'admin':
        conn.close()
        return jsonify({'message': 'Unauthorized to update this bid'}), 403
    
    cursor.execute("UPDATE bids SET status = ? WHERE id = ?", (data['status'], bid_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Bid status updated successfully'})

# Contract routes
@app.route('/api/contracts', methods=['POST'])
@token_required
def create_contract(current_user):
    data = request.get_json()
    
    # Check required fields
    required_fields = ['propertyId', 'agentId', 'commission', 'startDate', 'endDate']
    for field in required_fields:
        if field not in data:
            return jsonify({'message': f'Missing required field: {field}'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if property exists and belongs to the user
    cursor.execute("SELECT * FROM properties WHERE id = ?", (data['propertyId'],))
    property = cursor.fetchone()
    
    if not property:
        conn.close()
        return jsonify({'message': 'Property not found'}), 404
    
    if property['owner_id'] != current_user['id'] and current_user['role'] != 'admin':
        conn.close()
        return jsonify({'message': 'Unauthorized to create contract for this property'}), 403
    
    # Check if agent exists
    cursor.execute("SELECT * FROM users WHERE id = ?", (data['agentId'],))
    agent = cursor.fetchone()
    
    if not agent:
        conn.close()
        return jsonify({'message': 'Agent not found'}), 404
    
    contract_id = str(uuid.uuid4())
    
    cursor.execute(
        """
        INSERT INTO contracts 
        (id, property_id, owner_id, agent_id, commission, status, start_date, end_date) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """,
        (
            contract_id, 
            data['propertyId'], 
            property['owner_id'], 
            data['agentId'], 
            data['commission'], 
            'pending', 
            data['startDate'], 
            data['endDate']
        )
    )
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Contract created successfully', 'contract_id': contract_id}), 201

@app.route('/api/contracts/user', methods=['GET'])
@token_required
def get_contracts_by_user(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT * FROM contracts WHERE owner_id = ? OR agent_id = ?", 
        (current_user['id'], current_user['id'])
    )
    contracts = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(contract) for contract in contracts])

@app.route('/api/contracts/<contract_id>/status', methods=['PUT'])
@token_required
def update_contract_status(current_user, contract_id):
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({'message': 'Status is required'}), 400
    
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Get contract
    cursor.execute("SELECT * FROM contracts WHERE id = ?", (contract_id,))
    contract = cursor.fetchone()
    
    if not contract:
        conn.close()
        return jsonify({'message': 'Contract not found'}), 404
    
    # Only property owner, agent involved, or admin can update contract status
    if (contract['owner_id'] != current_user['id'] and 
        contract['agent_id'] != current_user['id'] and 
        current_user['role'] != 'admin'):
        conn.close()
        return jsonify({'message': 'Unauthorized to update this contract'}), 403
    
    cursor.execute("UPDATE contracts SET status = ? WHERE id = ?", (data['status'], contract_id))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Contract status updated successfully'})

# Admin routes
@app.route('/api/admin/users', methods=['GET'])
@token_required
@admin_required
def get_all_users(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, username, email, role, created_at FROM users")
    users = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(user) for user in users])

@app.route('/api/admin/users/<user_id>', methods=['DELETE'])
@token_required
@admin_required
def delete_user(current_user, user_id):
    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if user exists
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()
    
    if not user:
        conn.close()
        return jsonify({'message': 'User not found'}), 404
    
    # Delete user
    cursor.execute("DELETE FROM users WHERE id = ?", (user_id,))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'User deleted successfully'})

@app.route('/api/admin/bids', methods=['GET'])
@token_required
@admin_required
def get_all_bids(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM bids")
    bids = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(bid) for bid in bids])

@app.route('/api/admin/contracts', methods=['GET'])
@token_required
@admin_required
def get_all_contracts(current_user):
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM contracts")
    contracts = cursor.fetchall()
    conn.close()
    
    return jsonify([dict(contract) for contract in contracts])

if __name__ == '__main__':
    app.run(debug=True)
