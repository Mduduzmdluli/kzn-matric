#!/bin/bash

echo "🚀 Preparing for Afrihost Deployment..."
echo ""

# Step 1: Clean previous builds
echo "📦 Step 1: Cleaning previous builds..."
rm -rf .next out
echo "✅ Cleaned"
echo ""

# Step 2: Install dependencies
echo "📦 Step 2: Installing dependencies..."
npm install
echo "✅ Dependencies installed"
echo ""

# Step 3: Build for production
echo "🔨 Step 3: Building for production..."
npm run build
echo "✅ Build complete"
echo ""

# Step 4: Create deployment package info
echo "📋 Step 4: Files ready for deployment:"
echo ""
echo "Required files/folders to upload:"
echo "  ✓ .next/"
echo "  ✓ public/"
echo "  ✓ node_modules/ (or run 'npm install' on server)"
echo "  ✓ package.json"
echo "  ✓ package-lock.json"
echo "  ✓ next.config.mjs"
echo "  ✓ server.js"
echo "  ✓ .env.prod (rename to .env on server)"
echo ""
echo "✅ Deployment package ready!"
echo ""
echo "📖 Next steps:"
echo "1. Upload files to your Afrihost server"
echo "2. Configure Node.js app in cPanel"
echo "3. Set environment variables from .env.prod"
echo "4. Run 'npm install' on server (if node_modules not uploaded)"
echo "5. Start the application"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
