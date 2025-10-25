#!/bin/bash

# RootsTechNews Deployment Script
# This script commits and pushes changes to trigger Netlify deployment

echo "🚀 RootsTechNews Deployment Script"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    exit 1
fi

# Show current status
echo "📊 Git Status:"
git status --short
echo ""

# Stage all changes
echo "📦 Staging all changes..."
git add -A

# Commit with timestamp
TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
echo "💾 Committing changes..."
git commit -m "deploy: Update site - $TIMESTAMP" || {
    echo "ℹ️  No changes to commit or commit failed"
}

# Push to GitHub (which triggers Netlify)
echo "🌐 Pushing to GitHub..."
echo ""
echo "You may be prompted for your GitHub credentials."
echo "If using HTTPS, you'll need a Personal Access Token."
echo ""

git push origin main && {
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Netlify will now automatically:"
    echo "   1. Detect the changes"
    echo "   2. Build your site"
    echo "   3. Deploy to rootstechnews.com"
    echo ""
    echo "⏱️  Deployment typically takes 2-3 minutes"
    echo "📊 Monitor at: https://app.netlify.com/sites/roots-tech-news/deploys"
    echo ""
} || {
    echo ""
    echo "❌ Failed to push to GitHub"
    echo ""
    echo "💡 Alternative Options:"
    echo ""
    echo "1. Set up SSH keys (recommended):"
    echo "   https://docs.github.com/en/authentication/connecting-to-github-with-ssh"
    echo ""
    echo "2. Use GitHub Personal Access Token:"
    echo "   - Go to: https://github.com/settings/tokens"
    echo "   - Create token with 'repo' scope"
    echo "   - Use token as password when prompted"
    echo ""
    echo "3. Manual Netlify Deploy:"
    echo "   npx netlify-cli deploy --prod --dir=dist"
    echo ""
}

