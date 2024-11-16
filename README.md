# CepaC Play - Gamification System

A comprehensive gamification system for Moodle, focused on law studies.

## Features

- **XP System**: Earn experience points through various activities
- **Level Progression**: Unlock new features and rewards as you level up
- **Daily Challenges**: Complete tasks for bonus rewards
- **Achievement System**: Earn badges and titles for special accomplishments
- **Battle Mode**: Compete with other students in real-time quizzes
- **Premium Rewards**: Unlock exclusive study materials and benefits

## Technical Architecture

### Core Systems
- Game Context Provider for state management
- Moodle Integration Layer
- Real-time Battle System
- Achievement Tracking
- Level Progression System

### Integration Points
- Moodle Event Listeners
- XP Calculation Engine
- Reward Distribution System
- User Progress Tracking

## Setup Guide

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure Moodle integration:
   - Set up event listeners
   - Configure API endpoints
   - Set up authentication

3. Start development server:
   ```bash
   npm run dev
   ```

## Documentation

- [User Guide](./docs/user-guide.md)
- [Admin Guide](./docs/admin-guide.md)
- [API Documentation](./docs/api.md)
- [Integration Guide](./docs/integration.md)

## Development

### Prerequisites
- Node.js 18+
- Moodle 4.0+
- Modern web browser

### Architecture Overview
The system uses a modular architecture with the following components:

1. **Core Game Engine**
   - State Management
   - XP/Level Calculations
   - Achievement Processing

2. **UI Components**
   - React Components
   - Tailwind CSS
   - Framer Motion for animations

3. **Integration Layer**
   - Moodle Event Handlers
   - API Interfaces
   - Data Synchronization

### Best Practices
- Follow TypeScript strict mode
- Use React hooks for state management
- Implement proper error handling
- Maintain test coverage