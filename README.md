# ENTNT Ship Maintenance Dashboard

A comprehensive ship maintenance management system built with React, featuring role-based access control, real-time notifications, and interactive maintenance scheduling.

## Features

- **User Authentication**
  - Role-based access control (Admin, Inspector, Engineer)
  - Secure login with email/password
  - Session persistence using localStorage

- **Ships Management**
  - CRUD operations for ships
  - Detailed ship profiles
  - Component tracking
  - Maintenance history

- **Components Management**
  - Add/Edit/Delete ship components
  - Track installation and maintenance dates
  - Component-specific maintenance jobs

- **Maintenance Jobs**
  - Create and assign maintenance tasks
  - Priority-based job scheduling
  - Status tracking and updates
  - Calendar view for scheduled maintenance

- **Dashboard & Analytics**
  - Real-time KPI monitoring
  - Maintenance status overview
  - Interactive charts and statistics
  - Overdue maintenance alerts

- **Notification System**
  - Real-time maintenance alerts
  - Job status updates
  - Dismissible notifications
  - Unread notification tracking

## Tech Stack

- React 18.3
- TypeScript
- Tailwind CSS
- React Router v6
- Context API for state management
- Lucide React for icons
- Vite for build tooling

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/entnt-ship-maintenance.git
   ```

2. Install dependencies:
   ```bash
   cd entnt-ship-maintenance
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:5173](http://localhost:5173) in your browser

### Demo Accounts

- Admin: admin@entnt.in / admin123
- Inspector: inspector@entnt.in / inspect123
- Engineer: engineer@entnt.in / engine123

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Authentication/  # Login and auth components
│   ├── Dashboard/      # Dashboard widgets and charts
│   ├── Ships/          # Ship management components
│   ├── Components/     # Component management
│   ├── Jobs/           # Maintenance job components
│   └── Notifications/  # Notification system
├── contexts/           # React Context providers
├── pages/              # Page components
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Architecture

The application follows a component-based architecture with the following key aspects:

- **State Management**: Uses React Context API for global state management
- **Data Persistence**: Implements localStorage for data persistence
- **Component Hierarchy**: Follows a modular component structure
- **Role-based Access**: Implements permission-based feature access
- **Responsive Design**: Mobile-first approach using Tailwind CSS

## Known Limitations

1. Data persistence is limited to browser localStorage
2. No real-time synchronization between multiple tabs/windows
3. Calendar view limited to basic scheduling features
4. Chart visualizations use basic implementation

## Technical Decisions

1. **React Context over Redux**
   - Simpler state management for medium-scale application
   - Reduced boilerplate code
   - Built-in React feature requiring no additional dependencies

2. **Tailwind CSS**
   - Rapid UI development
   - Consistent styling system
   - Excellent responsive design support
   - Small bundle size with purge CSS

3. **TypeScript**
   - Type safety and better developer experience
   - Enhanced code maintainability
   - Better IDE support and code documentation

4. **Vite**
   - Fast development server
   - Quick build times
   - Modern development experience

## Future Improvements

1. Implement dark mode support
2. Add export functionality for reports
3. Enhanced calendar features
4. Advanced filtering and search capabilities
5. Implement data backup/restore functionality

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - [@hemanth](https://www.linkedin.com/in/hemanth-guntreddy-536242238/)
Project Link: [https://github.com/yourusername/entnt-ship-maintenance](https://github.com/yourusername/entnt-ship-maintenance)
