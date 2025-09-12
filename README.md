# README Generator

A modern, AI-powered tool that automatically generates comprehensive README files for any GitHub repository. Built with React, Node.js, and Google's Gemini AI.

## ✨ Features

- **AI-Powered Generation**: Uses Google Gemini AI to create intelligent, context-aware README content
- **Automatic Metadata Extraction**: Fetches repository information, tech stack, file structure, and license details
- **Beautiful UI**: Modern, responsive interface with live preview and markdown rendering
- **One-Click Generation**: Simply paste a GitHub URL and get a complete README in seconds
- **Copy to Clipboard**: Easy copying of generated content
- **Real-time Preview**: See your README rendered as you generate it

## 🚀 Live Demo

[**Try it now**](https://readme-generator-bkns.onrender.com/)

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Gemini AI** - AI content generation
- **GitHub API** - Repository metadata extraction
- **Zod** - Request validation

### Frontend
- **React** - UI framework
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling
- **React Markdown** - Markdown rendering
- **Remark GFM** - GitHub Flavored Markdown support

## 📁 Project Structure

```
READMEgen/
├── backend/                 # Express API server
│   ├── index.js            # Main server file
│   ├── package.json        # Backend dependencies
│   └── ENV.EXAMPLE         # Environment variables template
├── frontend/               # React application
│   ├── src/
│   │   ├── App.jsx         # Main React component
│   │   ├── App.css         # Custom styles
│   │   └── main.jsx        # React entry point
│   ├── package.json        # Frontend dependencies
│   └── vite.config.js      # Vite configuration
└── README.md              # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Google Gemini API key
- GitHub Personal Access Token (optional, for higher rate limits)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/hlo28/READMEgen.git
   cd READMEgen
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp ENV.EXAMPLE .env
   # Add your GEMINI_API_KEY and GITHUB_TOKEN to .env
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   cp ENV.EXAMPLE .env.local
   # Add VITE_API_BASE=http://localhost:3000 to .env.local
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

## 🔧 Environment Variables

### Backend (.env)
```env
GEMINI_API_KEY=your_gemini_api_key
GITHUB_TOKEN=your_github_token  # Optional
NODE_ENV=production
```

### Frontend (.env.local)
```env
VITE_API_BASE=http://localhost:3000  # For development
# VITE_API_BASE=https://your-backend.onrender.com  # For production
```

## 📖 API Usage

### Generate README
```bash
POST /generate
Content-Type: application/json

{
  "repoUrl": "https://github.com/owner/repo"
}
```

### Response
```json
{
  "readme": "# Generated README content in Markdown format"
}
```

## 🎯 How It Works

1. **Input**: User provides a GitHub repository URL
2. **Validation**: Backend validates the URL format using Zod
3. **Data Extraction**: Fetches repository metadata via GitHub API:
   - Repository information (name, description, URL)
   - Tech stack (programming languages)
   - File structure (recursive tree)
   - License information
   - Topics and tags
4. **AI Generation**: Sends structured data to Gemini AI with specific prompts
5. **Response**: Returns complete README in Markdown format
6. **Rendering**: Frontend displays the README with live preview

## 🚀 Deployment

### Backend (Render)
- **Service Type**: Web Service
- **Root Directory**: `backend`
- **Build Command**: `npm install`
- **Start Command**: `node index.js`
- **Environment Variables**: `GEMINI_API_KEY`, `GITHUB_TOKEN`

### Frontend (Render)
- **Service Type**: Static Site
- **Root Directory**: `frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: `VITE_API_BASE`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Google Gemini AI](https://ai.google.dev/) for intelligent content generation
- [GitHub API](https://docs.github.com/en/rest) for repository metadata
- [React](https://reactjs.org/) and [Vite](https://vitejs.dev/) for the frontend
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**Built with ❤️ by [hlo28](https://github.com/hlo28)**
