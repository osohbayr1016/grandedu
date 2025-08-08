# GrandEdu - Full-Stack Application

A modern full-stack application built with Next.js, Express.js, and Tailwind CSS.

## 🚀 Tech Stack

### Frontend

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting

### Backend

- **Express.js** - Node.js web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **Nodemon** - Development server with auto-reload

## 📁 Project Structure

```
grandedu/
├── frontend/          # Next.js application
│   ├── src/
│   │   └── app/       # App Router pages
│   ├── public/        # Static assets
│   └── package.json
├── backend/           # Express.js API
│   ├── src/
│   │   └── server.ts  # Main server file
│   ├── dist/          # Compiled TypeScript (generated)
│   └── package.json
└── README.md
```

## 🛠️ Installation & Setup

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### 1. Clone the repository

```bash
git clone <repository-url>
cd grandedu
```

### 2. Install Frontend Dependencies

```bash
cd frontend
npm install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
```

## 🚀 Running the Application

### Development Mode

#### Start the Backend Server

```bash
cd backend
npm run dev
```

The backend will run on `http://localhost:5000`

#### Start the Frontend Development Server

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:3000`

### Production Mode

#### Build and Start Backend

```bash
cd backend
npm run build
npm start
```

#### Build and Start Frontend

```bash
cd frontend
npm run build
npm start
```

## 📡 API Endpoints

### Health Check

- **GET** `/api/health` - Returns server status and timestamp

### Root

- **GET** `/` - Returns welcome message

## 🎨 Features

- **Real-time Status Monitoring** - Frontend displays backend connection status
- **Responsive Design** - Mobile-first approach with Tailwind CSS
- **Dark Mode Support** - Automatic dark/light theme detection
- **Type Safety** - Full TypeScript implementation
- **Hot Reload** - Development servers with auto-reload

## 🔧 Available Scripts

### Frontend (Next.js)

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Backend (Express.js)

- `npm run dev` - Start development server with nodemon
- `npm run build` - Compile TypeScript to JavaScript
- `npm start` - Start production server

## 🌐 Environment Variables

### Backend (.env)

```env
PORT=5000
NODE_ENV=development
```

## 📝 Development Notes

- The frontend automatically connects to the backend API
- CORS is enabled for local development
- Health checks are performed every 5 seconds
- TypeScript compilation is handled automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
# grandedu
