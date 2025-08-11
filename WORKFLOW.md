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

### 1. Feature Development

#### Starting a New Feature
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Follow the component structure**
   - Place new components in `src/components/`
   - Create custom hooks in `src/hooks/`
   - Add types in `src/types/`
   - Update utilities in `src/utils/`

3. **Component Development Guidelines**
   - Use TypeScript for all components
   - Follow the existing naming conventions
   - Use shadcn/ui components when possible
   - Implement responsive design with Tailwind CSS

#### Code Organization
- **Components**: Functional components with TypeScript
- **Hooks**: Custom hooks for business logic
- **Types**: Shared TypeScript interfaces
- **Utils**: Pure functions and helpers

### 2. Voice Feature Development

The app includes comprehensive voice control capabilities:

#### Voice Components
- `VoiceInterface.tsx` - Main voice control interface
- `VoiceControls.tsx` - Voice control buttons
- `VoiceConversationPage.tsx` - Voice conversation UI
- `useVoiceManager.ts` - Voice management hook

#### Voice Workflow
1. **Speech Recognition**: Uses Web Speech API
2. **Command Processing**: Parses voice commands
3. **Action Execution**: Triggers appropriate app actions
4. **Feedback**: Provides voice confirmation

### 3. Medication Management Features

#### Core Features
- **Medication Tracking**: Record and monitor medication intake
- **Reminders**: Set up medication reminders
- **Family Notifications**: Alert family members
- **OCR Scanning**: Scan medication labels
- **Voice Input**: Voice-controlled medication logging

#### Key Components
- `MedicationCard.tsx` - Individual medication display
- `MedicationReminder.tsx` - Reminder functionality
- `MedicationHandbookScanner.tsx` - OCR scanning
- `FamilyDashboard.tsx` - Family coordination

### 4. Mobile Development

#### Capacitor Integration
- **Platform Support**: iOS and Android
- **Native Features**: Push notifications, local notifications
- **Mobile UI**: Touch-optimized interface

#### Mobile-Specific Considerations
- Touch targets should be at least 44px
- Implement proper mobile navigation
- Test on actual devices
- Handle mobile-specific permissions

## Key Features & Components

### Onboarding Flow
The app includes a comprehensive onboarding process:
- Welcome screen
- Permission requests
- Family setup
- Notification preferences
- LINE integration

### Voice Interface
- Speech-to-text for medication input
- Text-to-speech for feedback
- Voice command recognition
- Conversation history

### Medication Management
- Add/edit medications
- Set schedules and reminders
- Track completion
- Family notifications
- OCR label scanning

### Family Coordination
- Family member management
- Notification sharing
- Dashboard for family oversight
- Emergency contacts

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
