# SecureSharing 🔐

A modern, secure file sharing platform built with React and Node.js that allows users to share files with advanced security features including password protection, expiration dates, and view limits.

## ✨ Features

### 🔒 Security First
- **Password Protection**: Secure your files with custom passwords
- **Expiration Dates**: Set automatic file expiration
- **View Limits**: Control how many times files can be accessed
- **JWT Authentication**: Secure user authentication system
- **Unique Share Links**: UUID-based sharing links with 122 bits of entropy

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Dark/Light Mode**: Toggle between themes
- **Tailwind CSS**: Modern, utility-first styling
- **Smooth Animations**: Enhanced user experience with CSS animations
- **Intuitive Interface**: Clean and user-friendly design

### 📁 File Management
- **Multiple File Types**: Support for images, videos, documents, and more
- **Drag & Drop Upload**: Easy file uploading interface
- **File Preview**: View file information before sharing
- **Bulk Operations**: Manage multiple files efficiently
- **Real-time Updates**: Live file status updates

## 🚀 Live Demo

- **Frontend**: [SecureSharing App](https://securesharing-frontend.onrender.com)
- **Backend API**: [SecureSharing API](https://securesharing-backend.onrender.com)

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Multer** - File upload handling
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)
- **Git**

## ⚡ Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Shubhamkahar196/SecureSharing.git
cd SecureSharing
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your configuration
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/securesharing
# or use MongoDB Atlas
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/securesharing

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Server Port
PORT=5000

# File Upload Settings
MAX_FILE_SIZE=10485760  # 10MB in bytes
UPLOAD_PATH=./uploads
```

### 5. Run the Application

**Start Backend (Terminal 1):**
```bash
cd backend
npm start
```

**Start Frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📁 Project Structure

```
SecureSharing/
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── fileController.js  # File management logic
│   │   └── viewController.js  # File viewing logic
│   ├── middleware/
│   │   └── authMiddleware.js  # JWT authentication middleware
│   ├── models/
│   │   ├── User.js           # User model
│   │   └── File.js           # File model
│   ├── routes/
│   │   ├── authRoutes.js     # Authentication routes
│   │   ├── fileRoutes.js     # File management routes
│   │   └── viewRoutes.js     # File viewing routes
│   ├── uploads/              # File storage directory
│   ├── .env                  # Environment variables
│   ├── package.json
│   └── server.js             # Main server file
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   ├── context/          # React Context providers
│   │   ├── pages/            # Page components
│   │   ├── services/         # API service functions
│   │   ├── App.jsx           # Main App component
│   │   └── main.jsx          # Entry point
│   ├── package.json
│   └── vite.config.js        # Vite configuration
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### File Management
- `POST /api/files/upload` - Upload a file
- `GET /api/files/my-files` - Get user's files
- `DELETE /api/files/:id` - Delete a file

### File Viewing
- `GET /api/view/:shareLink` - Get file information
- `POST /api/view/:shareLink/access` - Access/download file

## 🚀 Deployment

### Frontend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install && npm run build`
3. Set publish directory: `./dist`

### Backend (Render)
1. Connect your GitHub repository to Render
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables in Render dashboard

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For support and questions:

- **Email**: ksk185246@gmail.com
- **Phone**: +91 8933853880
- **GitHub Issues**: [Create an issue](https://github.com/Shubhamkahar196/SecureSharing/issues)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by the need for secure file sharing
- Thanks to the open-source community

---

**Made with ❤️ by [Shubham Kahar](https://github.com/Shubhamkahar196)**
