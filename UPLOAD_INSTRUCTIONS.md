# GitHub Upload Instructions for WhoKnowsBall Frontend

This guide will help you upload the WhoKnowsBall frontend project to GitHub.

## Prerequisites

Before you begin, ensure you have:

1. **GitHub Account**: Create one at [github.com](https://github.com) if you don't have one
2. **Git Installed**: Verify by running `git --version` in your terminal
3. **SSH Key Configured**: Set up SSH keys with GitHub following [GitHub's SSH guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
   - Alternatively, you can use HTTPS (instructions below include both methods)

## Step 1: Create GitHub Repository

1. Go to [github.com/new](https://github.com/new)
2. Fill in the repository details:
   - **Repository name**: `whoknowsball-frontend`
   - **Description**: "React Native mobile app for sports betting predictions and trivia - Frontend"
   - **Visibility**: Public (or Private if you prefer)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click "Create repository"

## Step 2: Initialize Git and Push to GitHub

Open your terminal and run the following commands:

### Using SSH (Recommended)

```bash
# Navigate to the frontend directory
cd ~/Documents/github-portfolio/whoknowsball-frontend

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: WhoKnowsBall React Native app"

# Rename branch to main
git branch -M main

# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin git@github.com:YOUR_USERNAME/whoknowsball-frontend.git

# Push to GitHub
git push -u origin main
```

### Using HTTPS (Alternative)

If you prefer HTTPS or haven't set up SSH keys:

```bash
# Navigate to the frontend directory
cd ~/Documents/github-portfolio/whoknowsball-frontend

# Initialize git repository
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: WhoKnowsBall React Native app"

# Rename branch to main
git branch -M main

# Add remote origin (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/whoknowsball-frontend.git

# Push to GitHub
git push -u origin main
```

## Step 3: Verify Upload

1. Go to `https://github.com/YOUR_USERNAME/whoknowsball-frontend`
2. Verify all files are present
3. Check that the README.md displays correctly

## Step 4: Post-Upload Configuration

### Add Repository Description

1. Go to your repository page
2. Click the gear icon next to "About"
3. Add description: "React Native mobile app for sports betting predictions and trivia"
4. Add website URL if applicable
5. Click "Save changes"

### Add Topics/Tags

In the same "About" section, add relevant topics:
- `react-native`
- `typescript`
- `sports`
- `betting`
- `trivia`
- `expo`
- `mobile-app`
- `ios`
- `android`
- `react-navigation`
- `supabase`

### Pin Repository to Profile (Optional)

1. Go to your GitHub profile
2. Click "Customize your pins"
3. Select `whoknowsball-frontend`
4. Click "Save pins"

### Enable GitHub Pages (Optional)

If you want to host documentation:
1. Go to repository Settings
2. Navigate to "Pages" in the left sidebar
3. Under "Source", select the branch and folder
4. Click "Save"

## Step 5: Change Visibility (Optional)

If you want to make the repository private later:

1. Go to repository Settings
2. Scroll to the bottom to "Danger Zone"
3. Click "Change visibility"
4. Select "Make private"
5. Confirm the action

## Troubleshooting

### Authentication Failed (HTTPS)

If using HTTPS and authentication fails:
- You may need to use a Personal Access Token instead of your password
- Generate one at [github.com/settings/tokens](https://github.com/settings/tokens)
- Use the token as your password when prompted

### Permission Denied (SSH)

If you get "Permission denied (publickey)":
- Verify SSH key is added to GitHub: `ssh -T git@github.com`
- Follow [GitHub's SSH troubleshooting guide](https://docs.github.com/en/authentication/troubleshooting-ssh)

### Remote Already Exists

If you get "remote origin already exists":
```bash
git remote remove origin
git remote add origin git@github.com:YOUR_USERNAME/whoknowsball-frontend.git
```

## Next Steps

After uploading to GitHub:

1. **Set up branch protection** (Settings > Branches) to protect the main branch
2. **Enable Dependabot** (Settings > Security) for dependency updates
3. **Add collaborators** if working with a team (Settings > Collaborators)
4. **Create a development branch** for ongoing work:
   ```bash
   git checkout -b develop
   git push -u origin develop
   ```

## Future Updates

To push future changes:

```bash
# Make your changes, then:
git add .
git commit -m "Description of your changes"
git push
```

## Additional Resources

- [GitHub Documentation](https://docs.github.com)
- [Git Basics](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [React Native Deployment Guide](https://reactnative.dev/docs/publishing-to-app-store)

---

**Note**: Remember to update any sensitive information (API keys, secrets) in your configuration files before pushing to a public repository. Use environment variables and add sensitive files to `.gitignore`.
