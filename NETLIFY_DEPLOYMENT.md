# Netlify Deployment Instructions for Golden MSP Acquisition Adventure Game

This document provides step-by-step instructions for deploying the Golden MSP Acquisition Adventure Game to your Netlify servers.

## Prerequisites

Before deploying, ensure you have:

1. A Netlify account (sign up at [netlify.com](https://netlify.com) if you don't have one)
2. Git installed on your local machine
3. Node.js (version 16.x or higher) and npm installed

## Deployment Steps

### 1. Prepare Your Repository

First, initialize a Git repository for your project if you haven't already:

```bash
cd golden-msp-game
git init
git add .
git commit -m "Initial commit - Golden MSP Acquisition Adventure Game"
```

### 2. Create a GitHub Repository (Optional but Recommended)

For easier deployment and continuous integration:

1. Create a new repository on GitHub
2. Follow GitHub's instructions to push your existing repository:

```bash
git remote add origin https://github.com/yourusername/golden-msp-game.git
git branch -M main
git push -u origin main
```

### 3. Deploy to Netlify

#### Option A: Deploy via Netlify UI (Recommended for First-Time Setup)

1. Log in to your Netlify account
2. Click "New site from Git"
3. Select GitHub as your Git provider and authorize Netlify
4. Select your golden-msp-game repository
5. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. Click "Deploy site"

#### Option B: Deploy via Netlify CLI

1. Install Netlify CLI:
   ```bash
   npm install netlify-cli -g
   ```

2. Login to Netlify:
   ```bash
   netlify login
   ```

3. Initialize Netlify site:
   ```bash
   netlify init
   ```

4. Follow the prompts to either:
   - Create a new site
   - Connect to an existing site

5. Deploy your site:
   ```bash
   netlify deploy --prod
   ```

### 4. Environment Variables (If Needed)

If you need to set environment variables for API keys or other sensitive information:

1. Go to your site settings in Netlify dashboard
2. Navigate to "Build & deploy" > "Environment"
3. Add environment variables as needed, such as:
   - `REACT_APP_API_KEY`
   - `REACT_APP_AUTH_DOMAIN`

### 5. Custom Domain (Optional)

To use a custom domain:

1. Go to your site settings in Netlify dashboard
2. Navigate to "Domain management" > "Domains"
3. Click "Add custom domain"
4. Follow the instructions to configure your DNS settings

### 6. Continuous Deployment

With your repository connected to Netlify, any changes pushed to your main branch will automatically trigger a new build and deployment.

### 7. Troubleshooting

If you encounter issues with your deployment:

1. Check the build logs in Netlify dashboard
2. Ensure all dependencies are correctly listed in package.json
3. Verify that the build command and publish directory are correctly configured
4. Check that the netlify.toml file is in the root of your project

## Local Testing Before Deployment

To test your build locally before deploying:

```bash
npm run build
npx serve -s dist
```

This will serve your production build on a local server, typically at http://localhost:5000.

## Updating Your Deployment

To update your site after making changes:

1. Make your changes to the code
2. Commit the changes to your Git repository:
   ```bash
   git add .
   git commit -m "Description of changes"
   git push
   ```
3. Netlify will automatically detect the changes and redeploy your site

## Additional Resources

- [Netlify Documentation](https://docs.netlify.com/)
- [Netlify CLI Documentation](https://docs.netlify.com/cli/get-started/)
- [Troubleshooting Guide](https://docs.netlify.com/configure-builds/troubleshooting-tips/)
