# SparkSkill - Young Entrepreneur Academy

A gamified, kid-friendly web application teaching entrepreneurial skills through 12 structured lessons with badges and progress tracking.

## Features

- **12 Interactive Lessons**: Complete curriculum from idea discovery to business implementation 
- **Gamified Learning**: Badge system with unique rewards for each lesson completion
- **Kid-Friendly Design**: Colorful gradients, emojis, and engaging interface
- **Progress Tracking**: Real-time completion status and streak management
- **Interactive Activities**: Digital creation tools, pitch cards, and idea blast posters
- **Responsive Design**: Works on desktop and mobile devices

## Lessons Overview

1. **Discover Your Spark** 🌟 - Find your strengths and spark your first business idea
2. **Brainstorm Solutions** 💡 - Create amazing solutions and your Idea Blast Poster
3. **Validate Your Vision** ✨ - Test your idea and create a Validation Star Chart
4. **Craft Your Pitch** 🎤 - Create an exciting pitch and Pitch Spark Card
5. **Plan Your Mini-Business** 📋 - Create a simple business plan and Mini-Business Blueprint
6. **Money Basics** 💰 - Set a price for your idea and create a Pricing Poster
7. **Make It Pop** 🎨 - Create a brand identity and Brand Spark Board
8. **Market Your Magic** 📢 - Plan marketing and create a Spark Flyer
9. **Sell with Confidence** 💪 - Practice a sales pitch and create a Sales Spark Script
10. **Track Your Success** 📊 - Track progress with QUASH method and create a Success Spark Tracker
11. **Celebrate Your Spark** 🎉 - Celebrate your journey with a SparkStar Showcase
12. **Spark It Forward** 🚀 - Share your idea with a wider audience and create a Spark It Forward Plan

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** with shadcn/ui components
- **TanStack Query** for state management
- **Wouter** for routing

### Backend
- **Node.js** with Express
- **TypeScript** with ES modules
- **In-memory storage** with interface for database integration
- **RESTful API** design

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sparkskill
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5000`

## Deployment

### Firebase Hosting

1. Install Firebase CLI:
```bash
npm install -g firebase-tools
```

2. Login to Firebase:
```bash
firebase login
```

3. Initialize Firebase project:
```bash
firebase init
```

4. Build the project:
```bash
npm run build
```

5. Deploy to Firebase:
```bash
firebase deploy
```

### GitHub Pages

1. Build the project:
```bash
npm run build
```

2. Push the `dist` folder to your GitHub repository's `gh-pages` branch

## Project Structure

```
sparkskill/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/            # Utilities and data
│   │   └── hooks/          # Custom React hooks
│   └── index.html
├── server/                 # Backend Express server
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data storage layer
│   └── vite.ts            # Vite integration
├── shared/                 # Shared types and schemas
│   └── schema.ts
├── firebase.json          # Firebase configuration
└── package.json
```

## API Endpoints

- `GET /api/lessons` - Get all lessons 
- `GET /api/lessons/:id` - Get specific lesson
- `GET /api/progress` - Get user progress
- `POST /api/progress/:lessonId/section/:sectionId` - Update section progress
- `GET /api/badges` - Get user badges
- `GET /api/badges/all` - Get all available badges
- `POST /api/activities` - Save activity response

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Target Audience

Designed for children aged 7-12 years old learning entrepreneurial skills in a fun, interactive way.
