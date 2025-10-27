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

# Check if git repo is initialized
if [ ! -d ".git" ]; then
    echo "❌ Error: Not a git repository"
    echo "💡 Initialize with: git init"
    exit 1
fi

# Show current status
echo "📊 Git Status:"
git status --short
echo ""

# Check if there are changes to commit
if [[ -z $(git status --porcelain) ]]; then
    echo "✅ No changes to commit - working tree is clean"
    echo ""
    echo "🔄 Would you like to push existing commits? (y/n)"
    read -r response
    if [[ "$response" != "y" ]]; then
        echo "Deployment cancelled."
        exit 0
    fi
else
    # Stage all changes
    echo "📦 Staging all changes..."
    git add -A

    # Commit with timestamp
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    echo "💾 Committing changes..."
    git commit -m "deploy: Update site - $TIMESTAMP" || {
        echo "⚠️  Commit failed"
        exit 1
    }
fi

# Get current branch
BRANCH=$(git branch --show-current)
echo ""
echo "📍 Current branch: $BRANCH"
echo ""

# Push to GitHub (which triggers Netlify)
echo "🌐 Pushing to GitHub..."
echo ""
echo "You may be prompted for your GitHub credentials."
echo "If using HTTPS, you'll need a Personal Access Token."
echo ""

git push origin "$BRANCH" && {
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Netlify will now automatically:"
    echo "   1. Detect the changes"
    echo "   2. Run: npm ci && npm run build"
    echo "   3. Deploy to production (if on main branch)"
    echo ""
    echo "⏱️  Deployment typically takes 2-3 minutes"
    echo "📊 Monitor at: https://app.netlify.com/sites/roots-tech-news/deploys"
    echo ""
    echo "🔗 Your site will be live at: https://rootstechnews.com"
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
    echo "   First fix npm permissions:"
    echo "   sudo chown -R 501:20 \"/Users/aniecepompey/.npm\""
    echo "   Then run:"
    echo "   npm run deploy"
    echo ""
    exit 1
}

