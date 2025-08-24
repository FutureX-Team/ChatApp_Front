# Chat Application - تطبيق الدردشة

A modern, full-stack chat application built with React frontend and Flask backend, featuring a clean separation of concerns and modern development practices.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design with Arabic language support
- **Authentication System**: Secure user registration and login
- **Real-time Messaging**: Tweet-style messaging system
- **Database Integration**: MySQL database with optimized schema
- **RESTful APIs**: Well-structured API endpoints
- **Cross-Origin Support**: CORS enabled for frontend-backend communication

## 🛠 Tech Stack

### Frontend
- **React 18** - Modern JavaScript framework
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - High-quality UI components
- **Lucide React** - Beautiful icons

### Backend
- **Flask** - Lightweight Python web framework
- **SQLAlchemy** - Python SQL toolkit and ORM
- **MySQL** - Relational database
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing

## 📁 Project Structure

```
├── chat_app_backend/          # Backend application
│   ├── src/
│   │   ├── main.py           # Main Flask application
│   │   ├── models/           # Database models
│   │   └── routes/           # API routes
│   └── venv/                 # Virtual environment
│
└── chat_app_frontend/         # Frontend application
    ├── src/
    │   ├── App.jsx           # Main React component
    │   ├── components/       # React components
    │   └── main.jsx          # Entry point
    └── vite.config.js        # Vite configuration
```

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL 8.0+

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd chat_app_backend
   ```

2. **Activate virtual environment**
   ```bash
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Start MySQL and create database**
   ```bash
   sudo systemctl start mysql
   sudo mysql -e "CREATE DATABASE chat_app; CREATE USER 'chat_user'@'localhost' IDENTIFIED BY 'chat_password'; GRANT ALL PRIVILEGES ON chat_app.* TO 'chat_user'@'localhost'; FLUSH PRIVILEGES;"
   ```

5. **Run the backend server**
   ```bash
   python src/main.py
   ```
   The backend will be available at `http://localhost:5001`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd chat_app_frontend
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the development server**
   ```bash
   pnpm run dev --host
   ```
   The frontend will be available at `http://localhost:5173`

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Messages/Tweets
- `GET /api/tweets/` - Get all tweets
- `POST /api/tweets/` - Create new tweet
- `GET /api/tweets/<id>` - Get specific tweet
- `PUT /api/tweets/<id>` - Update tweet
- `DELETE /api/tweets/<id>` - Delete tweet

## 🗄 Database Schema

### Users Table
- `id` - Primary key
- `user_name` - Username
- `email` - Email address
- `password` - Hashed password
- `role` - User role
- `avatar_url` - Profile picture URL
- `is_disabled` - Account status
- `dark_mode` - Theme preference

### Tweets Table
- `id` - Primary key
- `text` - Message content
- `user_id` - Foreign key to users
- `place_id` - Foreign key to places
- `up_count` - Like count
- `down_count` - Dislike count
- `replay_id` - Reply reference

## 🔧 Configuration

### Proxy Configuration
The frontend is configured to proxy API requests to the backend:

```javascript
// vite.config.js
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:5001',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### Database Configuration
```python
# Backend database configuration
SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://chat_user:chat_password@localhost/chat_app'
```

## 🎨 UI Components

The application uses a modern component-based architecture with:
- Responsive design for all screen sizes
- Arabic language support (RTL)
- Clean, intuitive user interface
- Interactive forms with validation
- Modern color scheme and typography

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- CORS protection
- Input validation and sanitization
- SQL injection prevention through ORM

## 🚀 Future Enhancements

- Real-time messaging with WebSocket
- File upload functionality
- Push notifications
- Advanced search features
- Dark/light theme toggle
- Mobile app development
- Performance optimizations

## 📝 License

This project is built for educational purposes and demonstrates modern web development practices.

## 🤝 Contributing

Feel free to fork this project and submit pull requests for any improvements.

---

**Note**: This application is currently configured for development. For production deployment, additional security measures and optimizations should be implemented.

