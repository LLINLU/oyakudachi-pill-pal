# Oyakudachi Pill Pal - Development Workflow

## Table of Contents
- [Project Overview](#project-overview)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Key Features & Components](#key-features--components)
- [Testing & Quality Assurance](#testing--quality-assurance)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## Project Overview

**Oyakudachi Pill Pal** is a comprehensive medication management application designed to help users track medications, set reminders, and coordinate with family members. The app features voice controls, OCR medication scanning, family notifications, and mobile-first design.

### Key Technologies
- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Mobile**: Capacitor for native mobile capabilities
- **Voice**: Web Speech API for voice recognition and synthesis
- **OCR**: Tesseract.js for medication text recognition
- **State Management**: React Query + Custom hooks
- **Routing**: React Router DOM

## Development Setup

### Prerequisites
- Node.js (v18 or higher)
- npm or bun package manager
- Git

### Initial Setup
```bash
# Clone the repository
git clone <repository-url>
cd oyakudachi-pill-pal

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Project Structure

```
oyakudachi-pill-pal/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components (shadcn/ui)
│   │   ├── onboarding/     # Onboarding flow components
│   │   └── demo/           # Demo and testing components
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── lib/                # Library configurations
├── public/                 # Static assets
├── capacitor.config.ts     # Capacitor configuration
└── package.json           # Dependencies and scripts
```

## Development Workflow

## Team Collaboration Workflow Guide

## 📚 Table of Contents
1. [Quick Reference](#quick-reference)
2. [Branch Strategy](#branch-strategy)
3. [Feature Development Workflow](#feature-development-workflow)
4. [UI/UX Exploration Workflow](#uiux-exploration-workflow)
5. [Testing Without Merging](#testing-without-merging)
6. [Git Commands Cheatsheet](#git-commands-cheatsheet)
7. [Conflict Resolution](#conflict-resolution)
8. [Best Practices](#best-practices)

---

## 🚀 Quick Reference

### Daily Commands You'll Use Most
```bash
# Start your day - sync with latest
git fetch --all
git pull origin main

# Create new feature
git checkout -b feature/your-feature-name

# Save your work
git add -A
git commit -m "feat: describe your change"

# Share your work
git push origin feature/your-feature-name

# Test someone else's work
git checkout origin/their-branch  # Detached HEAD for testing
git checkout -                    # Return to your branch
```

---

## 🌳 Branch Strategy

### Branch Structure
```
main (stable, production-ready)
│
├── develop (optional: integration testing)
│
├── feature/* (Qi's exploratory features)
│   ├── feature/pace-tracker
│   ├── feature/filler-detector
│   ├── feature/gap-analysis
│   └── feature/memo-generation
│
└── UI/* (UI team's explorations)
    ├── UI/ver1-minimal
    ├── UI/ver2-dashboard
    └── UI/ver3-presenter-focus
```

### When to Merge to Main

| Merge to Main ✅ | Keep in Feature Branch 🧪 |
|------------------|---------------------------|
| Core infrastructure (ASR, Audio) | Experimental features |
| Stable, tested features | Multiple competing versions |
| Bug fixes | UI-specific experiments |
| Documentation updates | Breaking changes |
| Team-agreed essentials | Features under active development |

---

## 💡 Feature Development Workflow

### For Feature Developers (Qi's Workflow)

#### 1. Starting a New Feature
```bash
# Always start from latest main
git checkout main
git pull origin main
git checkout -b feature/tracker-pace-v1

# Work on your feature
# ... make changes ...

# Commit regularly
git add -A
git commit -m "feat: implement basic pace tracking"
```

#### 2. Sharing Feature for Testing (Without Merging to Main)
```bash
# Push to remote
git push origin feature/tracker-pace-v1

# Announce in Slack
"🧪 New feature ready for testing: Pace Tracker
Branch: feature/tracker-pace-v1
To test: git merge origin/feature/tracker-pace-v1"
```

#### 3. Creating Feature Documentation
Create a `README.md` in your feature branch:
```markdown
# Feature: Pace Tracker

## Description
Real-time speaking pace tracker with visual warnings

## Integration
`git merge origin/feature/tracker-pace-v1`

## Dependencies
- Requires: feature/ASR-integration
- Conflicts: None
- Optional: feature/visual-indicators

## Configuration
No additional configuration needed

## Testing
1. Start recording session
2. Speak at different paces
3. Observe pace warnings
```

---

## 🎨 Design Exploration Workflow

### For Design

#### 1. Starting a UI Version
```bash
# Start from main or develop
git checkout main
git pull origin main
git checkout -b UI/ver2-dashboard

# Work on UI version
# ... make changes ...
```

#### 2. Testing Dev's Features (LEGO Approach)

**Option A: Temporary Testing (Recommended for exploration)**
```bash
# Save your current work
git stash

# Test a feature
git merge origin/feature/pace-tracker

# Test it out
npm run dev

# If you like it, keep it
git commit -m "integrate: add pace tracker to UI v2"

# If you don't like it, remove it
git reset --hard HEAD~1
```

**Option B: Cherry-Pick Specific Commits**
```bash
# View commits in a feature branch
git log origin/feature/pace-tracker --oneline

# Cherry-pick specific commits you want
git cherry-pick abc1234
git cherry-pick def5678
```

**Option C: Create Integration Branch**
```bash
# Create a temporary branch combining multiple features
git checkout -b integration/UI-v2-with-trackers
git merge origin/UI/ver2-dashboard
git merge origin/feature/pace-tracker
git merge origin/feature/gap-analysis

# Test the combination
npm run dev

# If successful, can merge back to your UI branch
git checkout UI/ver2-dashboard
git merge integration/UI-v2-with-trackers
```

---

## 🧪 Testing Without Merging

### Quick Test Script
Create `test-branch.sh`:
```bash
#!/bin/bash
# Usage: ./test-branch.sh feature/pace-tracker

BRANCH=$1
CURRENT=$(git branch --show-current)

echo "Testing branch: $BRANCH"
git stash push -m "Testing $BRANCH"
git checkout origin/$BRANCH
npm install
npm run dev

echo "Press any key to return to $CURRENT"
read -n 1
git checkout $CURRENT
git stash pop
```

### Testing Multiple Features Together
```bash
# Create a test branch
git checkout -b test/combined-features
git merge origin/feature/pace-tracker
git merge origin/feature/filler-detector
git merge origin/feature/gap-analysis

# Test the combination
npm run dev

# Clean up when done
git checkout main
git branch -D test/combined-features
```

---

## 📝 Git Commands Cheatsheet

### Essential Commands

#### Viewing & Navigation
```bash
# See all branches (local and remote)
git branch -a

# See your current branch
git branch --show-current

# View commit history
git log --oneline -10
git log --graph --pretty=oneline --abbrev-commit

# See what changed
git status
git diff                    # Unstaged changes
git diff --staged          # Staged changes
git diff main...HEAD       # All changes since main
```

#### Syncing with Team
```bash
# Get latest without merging
git fetch --all

# Get latest and merge
git pull origin main

# Update your feature branch with main
git checkout feature/your-feature
git merge origin/main       # or git rebase origin/main
```

#### Saving Work
```bash
# Save everything
git add -A
git commit -m "type: description"

# Save specific files
git add src/specific-file.ts
git commit -m "fix: correct specific issue"

# Amend last commit
git commit --amend -m "new message"

# Temporary save (stashing)
git stash                   # Save current changes
git stash list             # See all stashes
git stash pop              # Restore latest stash
git stash apply stash@{1}  # Apply specific stash
```

#### Branch Management
```bash
# Create and switch to new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
git checkout -              # Previous branch

# Delete branches
git branch -d feature/completed    # Local
git push origin --delete feature/completed  # Remote

# Rename branch
git branch -m old-name new-name
```

#### Sharing Work
```bash
# First time pushing a branch
git push -u origin feature/your-feature

# Subsequent pushes
git push

# Force push (use with caution!)
git push --force-with-lease
```

---

## 🔧 Conflict Resolution

### When Conflicts Occur
```bash
# 1. See conflicted files
git status

# 2. Open conflicted files and resolve
# Look for <<<<<<< HEAD markers

# 3. After resolving
git add <resolved-files>
git commit -m "resolve: merge conflicts with main"
```

### Conflict Prevention
```bash
# Regularly sync with main
git fetch origin main
git merge origin/main

# Before starting new work
git checkout main
git pull origin main
git checkout -b feature/new-work
```

---

## ✅ Best Practices

### 1. Commit Message Convention
```bash
# Format: <type>: <description>

feat: add pace tracking algorithm
fix: correct calculation in gap analysis
docs: update API documentation
refactor: simplify tracker service
test: add unit tests for memo generator
style: format code according to standards
chore: update dependencies
```

### 2. Branch Naming Convention
```bash
feature/pace-tracker-v1      # New features
feature/pace-tracker-v2      # Alternative versions
bugfix/transcript-timing      # Bug fixes
UI/minimal-dashboard          # UI versions
experiment/new-approach       # Experiments
refactor/service-layer       # Refactoring
```

### 3. Daily Workflow
```bash
# Morning routine
git fetch --all
git checkout main
git pull origin main
git checkout feature/your-current-work
git merge origin/main  # Stay updated

# Before ending day
git add -A
git commit -m "WIP: description of progress"
git push origin feature/your-current-work
```

### 4. Communication Protocol

**When creating a feature:**
```markdown
Slack: "@team New feature available for testing
Branch: feature/gap-analysis
Integrates with: ASR, pace-tracker
Test with: git merge origin/feature/gap-analysis"
```

**When ready for main:**
```markdown
Slack: "@team Feature ready for review
PR: #123 - Gap Analysis Implementation
Tested with: UI/ver1, UI/ver2
No conflicts with main"
```

### 5. Cleanup Regular
```bash
# List merged branches
git branch --merged main

# Delete merged local branches
git branch -d $(git branch --merged main | grep -v main)

# Clean up remote tracking
git remote prune origin
```

---

## 🚨 Emergency Commands

### Undo Changes
```bash
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1

# Undo a merge
git reset --hard HEAD~1

# Recover deleted branch
git reflog
git checkout -b recovered-branch HEAD@{1}
```

### Fix Mistakes
```bash
# Accidentally committed to wrong branch
git reset HEAD~1           # Undo commit
git stash                   # Save changes
git checkout correct-branch
git stash pop              # Apply changes

# Forgot to add files to commit
git add forgotten-file.ts
git commit --amend --no-edit
```

---

## 📊 Decision Matrix

### Should I Merge This Feature?

| Question | Yes → | No → |
|----------|-------|------|
| Is it stable and tested? | ✅ Continue | 🧪 Keep in feature branch |
| Does the team need it? | ✅ Continue | 🧪 Keep in feature branch |
| Will it break existing code? | ❌ Don't merge | ✅ Continue |
| Is it one of multiple options? | 🧪 Keep in feature branch | ✅ Continue |
| Has it been code reviewed? | ✅ Can merge to main | 📝 Get review first |

---

## 🤝 Team Scenarios

### Scenario 1: UI team needs multiple features
```bash
# UI team creates integration branch
git checkout -b UI/ver1-integrated
git merge origin/feature/pace-tracker
git merge origin/feature/gap-analysis
# Test together
```

### Scenario 2: Qi needs to test UI version
```bash
# Quick test without affecting current work
git stash
git checkout origin/UI/ver2-dashboard
npm run dev
# Return to work
git checkout -
git stash pop
```

### Scenario 3: Feature has multiple versions
```bash
# Keep both versions separate
feature/tracker-simple
feature/tracker-advanced

# UI team can test both
git checkout -b test/ui-with-simple
git merge origin/UI/ver1
git merge origin/feature/tracker-simple

git checkout -b test/ui-with-advanced
git merge origin/UI/ver1
git merge origin/feature/tracker-advanced
```

---

## 📅 Weekly Workflow

### Monday - Planning
- Review branches: `git branch -a`
- Clean old branches
- Plan week's features

### Daily
- Morning sync: `git fetch --all`
- Share progress in Slack
- Test others' work

### Friday - Cleanup
- Review what's ready for main
- Create PRs for stable features
- Document completed work

---

## 🆘 Getting Help

### Commands for Investigation
```bash
# Who changed what
git blame file.ts

# Find when bug introduced
git bisect start
git bisect bad HEAD
git bisect good abc1234

# Search commits
git log --grep="pace tracker"

# Find lost work
git reflog
```

### Team Contacts
- **Feature Development**: Qi (@qc)
- **UI/UX**: Lindsay (@lindsay)
- **Git Issues**: Post in #dev-help Slack channel

---

*Last Updated: August 2025*
*Version: 1.0*

## Testing & Quality Assurance

### Code Quality
```bash
# Run linting
npm run lint

# Check TypeScript types
npx tsc --noEmit
```

### Testing Guidelines
1. **Component Testing**: Test individual components
2. **Integration Testing**: Test feature workflows
3. **Voice Testing**: Test voice recognition accuracy
4. **Mobile Testing**: Test on actual devices
5. **Accessibility Testing**: Ensure app is accessible

### Testing Checklist
- [ ] Components render correctly
- [ ] Voice commands work as expected
- [ ] Mobile responsiveness
- [ ] Family notifications function
- [ ] OCR scanning accuracy
- [ ] Medication tracking accuracy

## Deployment

### Development Deployment
```bash
# Build for development
npm run build:dev

# Preview the build
npm run preview
```

### Production Deployment
```bash
# Build for production
npm run build

# Deploy to hosting platform
# (Follow platform-specific instructions)
```

### Mobile Deployment
```bash
# Build for mobile
npx cap build android
npx cap build ios

# Sync changes
npx cap sync
```

## Troubleshooting

### Common Issues

#### Voice Recognition Not Working
- Check browser permissions
- Ensure HTTPS in production
- Test microphone access
- Verify Web Speech API support

#### Mobile Build Issues
- Update Capacitor plugins
- Check platform-specific requirements
- Verify native dependencies

#### OCR Scanning Problems
- Ensure good image quality
- Check Tesseract.js configuration
- Verify image format support

#### Family Notifications
- Check notification permissions
- Verify family member setup
- Test notification delivery

### Debug Commands
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting issues
npm run lint

# Check Capacitor status
npx cap doctor

# Check mobile build
npx cap build android --verbose
```

### Performance Optimization
- Lazy load components
- Optimize images
- Minimize bundle size
- Use React.memo for expensive components
- Implement proper error boundaries

## Contributing Guidelines

### Code Style
- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components with hooks
- Implement proper error handling
- Add JSDoc comments for complex functions

### Git Workflow
1. Create feature branch from main
2. Make focused, atomic commits
3. Write descriptive commit messages
4. Test thoroughly before merging
5. Create pull request for review

### Documentation
- Update this workflow document for new features
- Document new components and hooks
- Update README.md for user-facing changes
- Add inline comments for complex logic

---

**Last Updated**: [Current Date]
**Version**: [Current Version]
**Maintainer**: [Your Name/Team]
