#!/bin/bash

# RootsTechNews - Deploy Script
# This script pushes your changes to GitHub, which triggers Netlify deployment

echo "🚀 Deploying RootsTechNews..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project directory"
    echo "Please run this from /Users/aniecepompey/Documents/projects/roots-tech-news"
    exit 1
fi

# Check git status
echo "📊 Checking git status..."
git status --short
echo ""

# Show commits to be pushed
echo "📦 Commits ready to push:"
git log --oneline origin/main..HEAD
echo ""

# Ask for confirmation
read -p "🤔 Push these changes to GitHub? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]
then
    echo "⬆️  Pushing to GitHub..."
    
    # Try to push
    if git push origin main; then
        echo ""
        echo "✅ Successfully pushed to GitHub!"
        echo ""
        echo "🔄 Netlify is now deploying your changes..."
        echo "⏱️  This will take about 2-3 minutes"
        echo ""
        echo "📍 Check deployment status:"
        echo "   https://app.netlify.com"
        echo ""
        echo "🌐 Your site will be live at:"
        echo "   https://rootstechnews.com"
        echo ""
        echo "⏰ Wait 5 minutes, then:"
        echo "   1. Visit https://rootstechnews.com"
        echo "   2. Hard refresh: Cmd + Shift + R"
        echo "   3. Check browser console (should be 0 errors!)"
        echo ""
        echo "✅ Deployment initiated successfully!"
    else
        echo ""
        echo "❌ Push failed! This is likely an authentication issue."
        echo ""
        echo "🔧 Quick Fix Options:"
        echo ""
        echo "Option 1: Use GitHub Desktop"
        echo "   1. Open GitHub Desktop"
        echo "   2. Click 'Push origin'"
        echo ""
        echo "Option 2: Create Personal Access Token"
        echo "   1. Go to: https://github.com/settings/tokens"
        echo "   2. Generate new token (classic)"
        echo "   3. Check 'repo' permissions"
        echo "   4. Copy the token"
        echo "   5. Run: git push https://YOUR_TOKEN@github.com/Kalefullycode/roots-tech-news.git main"
        echo ""
        exit 1
    fi
else
    echo "❌ Deployment cancelled"
    exit 0
fi
