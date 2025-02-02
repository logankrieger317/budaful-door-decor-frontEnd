#!/bin/bash

# Build the application
npm run build

# Create a deployment directory if it doesn't exist
mkdir -p deploy

# Copy necessary files to deployment directory
cp -r dist/* deploy/
cp package.json deploy/
cp package-lock.json deploy/
cp server.js deploy/
cp .env.production deploy/.env

# Create .htaccess file for Hostinger
echo "
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
" > deploy/.htaccess

# Zip the deployment package
cd deploy
zip -r ../deploy.zip .
