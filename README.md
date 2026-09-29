# BugFlow

BugFlow is a responsive frontend bug tracking and issue management platform inspired by lightweight Jira-style workflows. It is designed as a polished hackathon prototype for demonstrating a realistic bug lifecycle across manager, developer, and tester roles.

## Overview

BugFlow lets a business create a workspace, add team members, report issues, assign work to developers, track a controlled lifecycle, discuss fixes, and verify completed work. Users sign in through a frontend-only demo authentication flow, while organizations, accounts, sessions, bugs, and comments are persisted in the browser with `localStorage`.

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
- Login and signup with duplicate-email validation and password confirmation
- Protected routes with session persistence and logout
- Authenticated Manager, Developer, and Tester accounts with role-based UI
- Organization/workspace signup where the creator automatically becomes Manager
- Manager-only team management for Developer and Tester accounts
- Organization-scoped bugs, members, assignments, dashboard, Kanban, and comments

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

## Workspace and Team Flow

1. A new business creates a BugFlow workspace at `/signup`.
2. The workspace creator becomes its Manager and is signed in automatically.
3. The Manager opens `/team` to add Developer and Tester accounts.
4. Team members log in with their own accounts; their role comes from their account and cannot be manually switched.
5. Bugs, assignments, and dashboard data are scoped to the active organization.

## Demo Accounts

- **Manager:** `manager@bugflow.demo` / `manager123` — Mohit Jangid
- **Developer:** `developer@bugflow.demo` / `developer123` — Rahul Verma
- **Tester:** `tester@bugflow.demo` / `tester123` — Priya Singh

Use the Demo Accounts buttons on the login page to fill credentials quickly. Demo users and legacy mock bugs belong to the `BugFlow Demo Workspace`. New businesses can create independent workspaces without relying on these fixed accounts.

## Authentication and protected routes

`/login` and `/signup` are public routes. The dashboard (`/`), `/bugs`, `/bugs/:id`, `/kanban`, `/report`, and `/team` require an active session. Team management additionally requires the Manager role. A signed-in user visiting `/login` or `/signup` is sent to the dashboard. Logout clears only `bugflow-session`; organizations, registered accounts, bugs, and comments remain available.

Authentication and organization isolation are simulated entirely in the browser. Passwords are stored in localStorage for hackathon demonstration convenience, so this is not production-secure authentication and must not be used for real credentials.

## localStorage data

- `bugflow-organizations` — workspace records
- `bugflow-users` — demo and registered accounts with `organizationId` and role
- `bugflow-session` — the current authenticated session only
- `bugflow-bugs` — issue records, including organization and reporter/assignee IDs where available
- `bugflow-comments` — issue discussions

Legacy accounts and mock bugs without organization metadata are safely associated with the default demo workspace instead of being deleted.

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
├── context/      Authentication, organization, and bug state
├── data/         Mock issue data for the demo
├── pages/        Dashboard, bug list, details, report, and Kanban routes
├── App.jsx       React Router route definitions
└── main.jsx      Application providers and entry point
```

## Important Note

This is a frontend-only hackathon prototype. Role-based permissions and authentication are simulated on the client and are not a replacement for server-side authorization. The project does not include a backend, database, or real authentication service.

## Future Improvements

- REST API and database persistence
- Real authentication and server-side authorization
- Password hashing, secure sessions/tokens, and verified invitations
- Real-time collaboration
- File attachments and screenshots
- Optional drag-and-drop Kanban interactions
- Notifications and activity history
