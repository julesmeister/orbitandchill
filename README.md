# 🌟 Orbit and Chill

**A modern astrology platform combining precise natal chart generation with community engagement**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.1-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-3776AB?style=flat-square&logo=python)](https://python.org/)

## ✨ Features

### 🎯 Core Functionality
- **Free Natal Chart Generation**: Create precise astrological charts using astronomy-engine
- **Location Search**: Intelligent location autocomplete powered by Nominatim OpenStreetMap API
- **User Persistence**: Anonymous user profiles with data caching using Zustand + IndexedDB
- **Responsive Design**: Beautiful UI that works perfectly on all devices

### 🏛️ Admin Dashboard
- **Analytics Overview**: Site metrics, user analytics, and traffic monitoring
- **Content Management**: Rich text editor for blog posts and forum threads
- **User Management**: Track user activity and engagement
- **Post Creation**: TipTap-powered rich text editor with full formatting capabilities

### 🌐 Community Features
- **Forum System**: Threaded discussions with visual threading lines
- **Comment Threading**: SVG-based visual connection system for nested replies
- **Blog Platform**: Publishing system for astrological content
- **SEO Optimized**: Comprehensive metadata and structured data

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Python 3.8+ (for natal chart calculations)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/orbit-and-chill.git
   cd orbit-and-chill
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install Python library dependencies**
   ```bash
   cd natal
   poetry install
   # or with pip
   pip install -r requirements.txt
   ```

4. **Start development servers**
   ```bash
   # Frontend (Next.js)
   npm run dev

   # Python documentation (optional)
   cd natal
   poetry run mkdocs serve
   ```

5. **Open your browser**
   - Frontend: [http://localhost:3000](http://localhost:3000)
   - Python docs: [http://localhost:8000](http://localhost:8000)

## 🏗️ Architecture

### Frontend (Next.js 15)
```
src/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard
│   ├── discussions/       # Forum discussions
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── admin/             # Admin-specific components
│   ├── discussions/       # Discussion components
│   ├── threading/         # Comment threading system ⭐
│   ├── forms/             # Form components
│   └── reusable/          # Shared components
├── hooks/                 # Custom React hooks
├── store/                 # Zustand state management
└── utils/                 # Utility functions
    └── threading/         # Threading utilities (legacy)
```

### Backend Library (Python)
```
natal/
├── natal/                 # Core library
│   ├── chart.py          # Chart generation
│   ├── data.py           # Data models
│   └── utils.py          # Utility functions
├── tests/                 # Test suite
└── docs/                  # Documentation
```

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.1
- **State Management**: Zustand
- **Database**: Dexie (IndexedDB)
- **Rich Text**: TipTap editor
- **Location API**: Nominatim OpenStreetMap

### Backend Library
- **Language**: Python 3.8+
- **Astrology Engine**: astronomy-engine (MIT license)
- **Chart Generation**: Custom SVG rendering
- **Documentation**: MkDocs
- **Testing**: pytest

## 📝 Usage Examples

### Generate a Natal Chart
```python
from natal import Data, Chart

# Create chart data
data = Data(
    name="John Doe",
    utc_dt="1990-01-15 14:30",
    lat=40.7128,
    lon=-74.0060,
)

# Generate SVG chart
chart = Chart(data, width=600)
svg_string = chart.svg
```

### Access Admin Dashboard
1. Navigate to `/admin` (no authentication required in demo mode)
2. Manage posts, view analytics, and monitor traffic
3. Create content using the rich text editor

## 🎨 Key Features in Detail

### Location Search
- **Smart Autocomplete**: Real-time location suggestions
- **Coordinates**: Automatic latitude/longitude extraction
- **Caching**: Efficient API usage with local storage

### User Persistence
- **Anonymous Profiles**: No sign-up required
- **Data Caching**: Charts and preferences stored locally
- **Cross-session**: Data persists between visits

### Admin Analytics
- **Real-time Metrics**: Live user counts and activity
- **Traffic Analysis**: Visitor patterns and page views
- **Content Management**: CRUD operations for posts and threads

### Comment Threading System ⭐
- **Visual Connections**: SVG-based threading lines between comments
- **Adaptive Layout**: Dynamic height calculation based on comment hierarchy
- **Performance Optimized**: Lightweight SVG rendering with no JavaScript calculations
- **Reusable Design**: Easily extractable as standalone component library

![Comment Threading Demo](src/components/threading/React-Thread-Lines-For-Comments/Screenshot%202025-06-11%20121301.png)

## 🚀 Deployment

### Vercel (Recommended)
```bash
# Build and deploy
npm run build
vercel --prod
```

### Manual Deployment
```bash
# Build for production
npm run build
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Astronomy-Engine**: Professional-grade astronomical calculations (±1 arcminute precision)
- **OpenStreetMap**: Free location data via Nominatim
- **Next.js Team**: Outstanding React framework
- **Tailwind CSS**: Beautiful utility-first CSS

## 📞 Support

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Report bugs on GitHub Issues
- **Community**: Join our forum for discussions

---

**Built with ❤️ for the astrology community**