#!/bin/bash

# RootsTechNews - Deploy Script
# This script builds and deploys to Cloudflare Pages

echo "🚀 Deploying RootsTechNews to Cloudflare Pages..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory"
    exit 1
fi

# Check git status
echo "📊 Checking git status..."
git status --short
echo ""

# Build the project
echo "🔨 Building project..."
if npm run build; then
    echo "✅ Build successful!"
    echo ""
    
    # Deploy to Cloudflare Pages
    echo "☁️  Deploying to Cloudflare Pages..."
    if npx wrangler pages deploy dist --project-name=roots-tech-news; then
        echo ""
        echo "✅ Successfully deployed to Cloudflare Pages!"
        echo ""
        echo "🌐 Your site is live at:"
        echo "   https://rootstechnews.com"
        echo ""
        echo "📍 Check deployment status:"
        echo "   https://dash.cloudflare.com"
        echo ""
    else
        echo ""
        echo "❌ Deployment failed!"
        echo ""
        echo "🔧 Make sure you're logged in:"
        echo "   npx wrangler login"
        echo ""
        exit 1
    fi
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
