# Bug Smasher

Bug Smasher is a comprehensive QA and bug tracking platform designed to streamline the quality assurance process for development teams. It provides a structured approach to managing QA checklists, bug reports, and team assignments.

## Features

### QA Checklist Management
- Create and manage QA checklists with customizable items
- Pre-built templates for different types of QA processes:
  - Web QA Checklist
  - Event QA Checklist
  - Content QA Checklist
- Support for required and optional checklist items
- Item ordering and categorization
- Detailed notes and documentation for each item

### Team Collaboration
- Assign team members to QA tasks
- Set due dates and priorities
- Add assignment-specific notes
- Track assignment status (pending, accepted, rejected)
- Real-time updates on task progress

### Project Organization
- Categorize projects by type and priority
- Tag-based organization system
- Status tracking (draft, active, archived)
- Priority levels (low, medium, high)
- Project descriptions and documentation

### User Management
- Role-based access control
- User profiles with avatars and roles
- Team member assignment system
- User activity tracking

## Technical Stack

- **Frontend**: Next.js with TypeScript
- **UI Components**: Custom components with Tailwind CSS
- **Authentication**: JWT-based authentication
- **API**: RESTful API integration
- **State Management**: React hooks and context

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   ```env
   NEXT_PUBLIC_API_URL=your_api_url
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
bug-report-form/
├── app/
│   ├── actions/         # API actions and data fetching
│   ├── components/      # Reusable UI components
│   ├── qa/             # QA-related pages and components
│   └── lib/            # Utility functions and contexts
├── public/             # Static assets
└── styles/            # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 