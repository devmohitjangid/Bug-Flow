# BugFlow

BugFlow is a responsive frontend bug tracking and issue management platform inspired by lightweight Jira-style workflows. It is designed as a polished hackathon prototype for demonstrating a realistic bug lifecycle across manager, developer, and tester roles.

## Overview

BugFlow lets a team report issues, assign them to developers, track work through a controlled lifecycle, discuss fixes, and verify completed work. Demo role switching simulates authentication while all application data is persisted in the browser with `localStorage`.

## Features

- Bug reporting with validation and sequential issue IDs
- Manager assignment of open issues to developers
- Developer workflow for assigned issues
- Tester verification, closure, and reopen workflow
- Role-based permissions and strict status transitions
- Search by issue ID, title, reporter, or assignee
- Combined status, severity, and assignee filtering
- Responsive Kanban board with role-aware actions
- Persistent issue comments
- Dashboard statistics, workflow summary, and severity distribution
- Responsive tables, cards, forms, navigation, and mobile sidebar
- Browser `localStorage` persistence across refreshes

## Workflow

```text
Open → Assigned → In Progress → Fixed → Closed
                         Fixed → In Progress (Reopen)
```

Roles:

- **Manager** — views all issues and assigns open issues to developers.
- **Developer** — works only on issues assigned to the active developer, moving them from Assigned to In Progress to Fixed.
- **Tester** — verifies fixed issues, closes successful fixes, or reopens fixes that need more work.

## Tech Stack

- React
- Vite
- JavaScript / JSX
- Tailwind CSS
- React Router
- Lucide React
- React Context API
- `localStorage`

## Demo Users

- **Manager:** Mohit Jangid
- **Developer:** Rahul Verma
- **Tester:** Priya Singh

The role selector in the navbar simulates authentication for this frontend prototype. Switching roles changes the active demo user and available workflow actions.

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm.cmd run dev
```

The standard command also works in environments where PowerShell script execution permits npm wrappers:

```bash
npm run dev
```

## Production Build

```bash
npm.cmd run lint
npm.cmd run build
```

The Vite production output is generated in `dist`.

## Project Structure

```text
src/
├── components/   Shared layout, navbar, sidebar, and stat card UI
├── context/      Global bug and active-role state
├── data/         Mock issue data for the demo
├── pages/        Dashboard, bug list, details, report, and Kanban routes
├── App.jsx       React Router route definitions
└── main.jsx      Application providers and entry point
```

## Important Note

This is a frontend-only hackathon prototype. Role-based permissions are simulated on the client and are not a replacement for server-side authorization. The project does not include a backend, database, or real authentication service.

## Future Improvements

- REST API and database persistence
- Real authentication and server-side authorization
- Real-time collaboration
- File attachments and screenshots
- Optional drag-and-drop Kanban interactions
- Notifications and activity history
