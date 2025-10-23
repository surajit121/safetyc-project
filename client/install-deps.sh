#!/bin/bash

# Script to ensure all dependencies are properly installed
echo "Starting dependency installation process..."

# Clear any existing node_modules and package-lock to start fresh
echo "Cleaning previous installations..."
rm -rf node_modules
rm -f package-lock.json

# Install dependencies with maximum verbosity
echo "Installing dependencies..."
npm install --verbose

# Explicitly install react-toastify to ensure it's available
echo "Explicitly installing react-toastify..."
npm install react-toastify@latest --verbose

# Verify installation of react-toastify
echo "Verifying react-toastify installation..."
if [ -d "node_modules/react-toastify" ]; then
  echo "✅ react-toastify is installed correctly"
  ls -la node_modules/react-toastify
else
  echo "❌ react-toastify installation failed!"
  exit 1
fi

echo "Dependency installation completed successfully"