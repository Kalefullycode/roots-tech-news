# Roots Tech News

A modern AI & tech news aggregator with real-time updates, curated content, and comprehensive resources.

## 🚀 Features

- **Real-time RSS Feed Aggregation** - News from major tech sources
- **AI-Powered Daily Briefing** - Curated tech and AI updates
- **Live Video Feed** - YouTube integration for latest tech content
- **Newsletter System** - Powered by Resend.com
- **Advanced Search** - Filter by category, source, and keywords
- **Responsive Design** - Mobile-first with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, shadcn/ui
- **Backend:** Netlify Serverless Functions
- **Deployment:** Netlify / Cloudflare Pages
- **Email:** Resend.com API
- **Data:** RSS-Parser, React Query

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Visit `http://localhost:5173`

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🌍 Environment Variables

Create a `.env.local` file:

```bash
# Newsletter (Required for subscription feature)
RESEND_API_KEY=your_resend_api_key

# Analytics (Optional)
VITE_GA_TRACKING_ID=GA-XXXXXXX
```

## 📁 Project Structure

```
roots-tech-news/
├── docs/              # Documentation
├── scripts/           # Deployment and utility scripts
├── src/
│   ├── components/    # React components
│   ├── pages/         # Page components
│   ├── services/      # API services
│   ├── hooks/         # Custom React hooks
│   └── types/         # TypeScript types
├── public/            # Static assets
└── netlify/           # Serverless functions
    └── functions/
```

## 📚 Documentation

- [Master Plan](docs/MASTER_PLAN.md) - Project roadmap and vision
- [Features](docs/FEATURES.md) - Complete feature list
- [Deployment Guide](docs/DEPLOYMENT.md) - Deployment instructions
- [Newsletter Setup](docs/NEWSLETTER_SETUP.md) - Email integration guide

## 🚀 Deployment

### Netlify

```bash
./scripts/deploy.sh
```

Or push to `main` branch for automatic deployment.

### Cloudflare Pages

1. Connect your GitHub repository
2. Build command: `npm run build`
3. Publish directory: `dist`
4. Environment variables: Add `RESEND_API_KEY`

## 🧪 Testing

```bash
# Local development
npm run dev

# Production preview
npm run build && npm run preview
```

## 📝 License

MIT

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Contact

Visit [rootstechnews.com](https://rootstechnews.com)

---

Built with ❤️ using React, TypeScript, and Vite

