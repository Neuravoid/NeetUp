# NeetUp Frontend

A modern React application for NeetUp, a platform connecting learners with opportunities based on personality test results and professional profiles.

## Overview

NeetUp is a comprehensive platform that helps users discover career opportunities, courses, and projects tailored to their skills and personality profiles. The application includes features for user authentication, profile management, personality assessment, opportunity browsing, and community engagement.

## Tech Stack

- **React**: Frontend library for building the user interface
- **Redux Toolkit**: State management with support for async operations
- **Material UI**: Component library for consistent design
- **React Router**: Navigation and routing
- **i18next**: Localization (English and Turkish)
- **Axios**: HTTP client for API communication
- **date-fns**: Date formatting and manipulation
- **Redux Persist**: Persistence for selected state slices

## Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm (v7.x or higher)

### Installation

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

> **Note**: The `--legacy-peer-deps` flag is required due to some dependency compatibility issues with TypeScript versions.

### Available Scripts

- **npm start**: Runs the app in development mode at [http://localhost:3000](http://localhost:3000)
- **npm test**: Launches the test runner
- **npm run build**: Builds the app for production

## Project Structure

```
src/
├── api/               # API client and service modules
├── assets/            # Static assets (images, fonts, etc.)
├── components/        # Reusable UI components
│   ├── auth/          # Authentication related components
│   ├── common/        # Common UI elements
│   ├── dashboard/     # Dashboard specific components
│   ├── opportunities/ # Opportunity listing and detail components
│   ├── profile/       # User profile components
│   └── community/     # Community features components
├── hooks/             # Custom React hooks
├── layouts/           # Page layout components
│   ├── AuthLayout.js  # Layout for auth pages
│   └── MainLayout.js  # Main application layout with navigation
├── locales/           # i18n translation files
│   ├── en/            # English translations
│   └── tr/            # Turkish translations
├── pages/             # Page components
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard page
│   ├── profile/       # Profile pages
│   └── opportunities/ # Opportunity pages
├── store/             # Redux store configuration
│   ├── slices/        # Redux toolkit slices
│   └── store.js       # Store configuration
├── theme/             # Theme configuration
├── utils/             # Utility functions
├── App.js             # Root App component
├── index.js           # Entry point
└── i18n.js            # i18n configuration
```

## Key Components

### Core Components

- **MainLayout**: Main application layout with header, navigation, and content areas
- **AuthLayout**: Simplified layout for authentication pages
- **ProtectedRoute**: Route wrapper that handles authentication state

### Authentication

- **LoginPage**: User login with email and password
- **RegisterPage**: User registration with multi-step form
- **ForgotPasswordPage**: Password reset functionality
- **EmailVerificationPage**: Email verification process

### Profile

- **ProfilePage**: User profile display with sections for about, skills, experience, education
- **AboutSection**: User bio and personal information
- **SkillsSection**: User skills with endorsements
- **ExperienceSection**: Work experience history
- **EducationSection**: Educational background
- **ConnectionsSection**: Network connections

### Opportunities

- **OpportunitiesPage**: Filterable listings of jobs, courses, and projects
- **OpportunityCard**: Card component for opportunity preview
- **OpportunityDetailPage**: Detailed view of a specific opportunity
- **ApplicationDialog**: Form for applying to opportunities

### Dashboard

- **DashboardPage**: User dashboard with activity, recommendations
- **ActivityFeed**: Recent activity from connections and followed topics
- **RecommendedOpportunities**: AI-powered opportunity recommendations

## State Management

The application uses Redux Toolkit for state management with the following slices:

- **authSlice**: Authentication state, user session
- **profileSlice**: User profile data and related actions
- **opportunitiesSlice**: Opportunities listing and details
- **personalityTestSlice**: Personality test questions and results

## API Services

API services use Axios for communication with the backend:

- **authService**: Authentication endpoints
- **profileService**: User profile management
- **opportunitiesService**: Job, course, and project endpoints
- **personalityTestService**: Personality test operations

## Localization

The application supports English and Turkish languages using i18next:

- Translations organized by namespaces in `/locales/{language}/` directories
- Language detection based on browser settings
- User language preference saved in local storage

## Theme

Material-UI theme customization in `/theme/index.js` with:

- Custom color palette
- Typography settings
- Component style overrides

## Getting Help

If you encounter any issues or have questions about the application, please contact the development team.
