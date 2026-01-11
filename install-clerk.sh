#!/bin/bash

# Install Clerk Authentication packages
echo "Installing Clerk packages..."
npm install @clerk/nextjs @clerk/themes svix

echo "✅ Installation complete!"
echo ""
echo "Next steps:"
echo "1. Copy .env.example to .env.local"
echo "2. Follow CLERK-SETUP.md to configure Clerk"
echo "3. Run 'npm run dev' to start the development server"
