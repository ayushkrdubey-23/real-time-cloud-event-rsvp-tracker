# Real-Time Cloud-Based Event Planning & RSVP Tracker

A cloud-based event planning and RSVP management application built with
**React, Vite, Firebase Authentication, and Cloud Firestore**.

The project demonstrates real-time cloud application concepts through
organizer event management, attendee RSVP handling, capacity tracking,
live announcements, and responsive dashboards.

## Project Author

**Ayush Kumar Dubey**

## Project Type

Cloud Computing --- Industry-Oriented Academic Project

## Technology Stack

-   Frontend: React + Vite
-   Authentication: Firebase Authentication
-   Database: Cloud Firestore
-   Real-time updates: Firestore `onSnapshot`
-   Styling: CSS
-   QR package: `qrcode` installed for future enhancement
-   Version control: Git/GitHub

## Core Features

### Organizer

-   Register/login as organizer
-   Create events
-   Edit events
-   Cancel events
-   Delete events
-   View organizer event dashboard
-   Monitor live RSVP analytics
-   View GOING, MAYBE, and NOT GOING counts
-   Track capacity and remaining seats
-   Publish event announcements
-   Edit/delete announcements

### Attendee

-   Register/login as attendee
-   Discover published events
-   View complete event details
-   RSVP with GOING, MAYBE, or NOT GOING
-   Change RSVP status
-   See live capacity information
-   Receive live event announcements
-   View upcoming GOING events
-   Open detailed event information
-   Responsive mobile navigation

## Cloud Features Demonstrated

-   Cloud authentication
-   Cloud-hosted NoSQL database
-   Real-time database listeners
-   Client-side cloud SDK integration
-   Firestore security rules
-   Transaction-based capacity handling
-   Role-based application behavior
-   Real-time RSVP analytics
-   Real-time announcements
-   Cloud-ready architecture

## Application Architecture

``` text
User
  |
  v
React + Vite Frontend
  |
  +--------------------+
  |                    |
  v                    v
Firebase Auth      Cloud Firestore
  |                    |
  |                    +--> users
  |                    +--> events
  |                    +--> rsvps
  |                    +--> announcements
  |
  v
Authenticated User
```

## Main Data Collections

### users

Stores basic user profile information and role.

### events

Stores event details, organizer information, capacity, status, and RSVP
counters.

### rsvps

Stores one RSVP document per user/event combination.

### announcements

Stores event-specific organizer announcements.

See [Firestore Schema](docs/FIRESTORE_SCHEMA.md) for details.

## RSVP Capacity Logic

When an attendee selects **GOING**, the application uses a Firestore
transaction to:

1.  Read the latest event data.
2.  Read the attendee's previous RSVP.
3.  Check available capacity.
4.  Adjust the previous RSVP count if necessary.
5.  Increase the GOING count.
6.  Save the RSVP.
7.  Update event counters atomically.

This helps prevent simple over-capacity updates when multiple users
respond at nearly the same time.

## Real-Time Functionality

The application uses Firestore real-time listeners for:

-   Event details
-   RSVP status
-   RSVP analytics
-   Upcoming events
-   Announcements

When Firestore data changes, the relevant UI updates without requiring a
manual page refresh.

## Project Structure

``` text
rsvp-tracker/
├── src/
│   ├── components/
│   │   ├── AnnouncementList.jsx
│   │   ├── AnnouncementManager.jsx
│   │   ├── EditEvent.jsx
│   │   ├── EventDetails.jsx
│   │   ├── EventList.jsx
│   │   ├── MyUpcomingEvents.jsx
│   │   ├── Navbar.jsx
│   │   ├── RsvpAnalytics.jsx
│   │   ├── RsvpPanel.jsx
│   │   └── UiStyles.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── CreateEvent.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   ├── announcementService.js
│   │   ├── authService.js
│   │   ├── eventService.js
│   │   ├── myEventService.js
│   │   ├── rsvpHistoryService.js
│   │   └── rsvpService.js
│   ├── firebase.js
│   ├── App.jsx
│   └── index.css
├── docs/
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Local Setup

### 1. Clone the repository

``` bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd rsvp-tracker
```

### 2. Install dependencies

``` bash
npm install
```

### 3. Configure Firebase

Create a Firebase project and enable:

-   Authentication → Email/Password
-   Cloud Firestore

Create a web application in Firebase and place the configuration values
in `.env`.

Example:

``` env
VITE_FIREBASE_API_KEY=YOUR_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID
```

Never commit real secrets or private credentials.

### 4. Start the application

``` bash
npm run dev
```

The Vite development server will display the local application URL.

## Firestore Security

The project includes Firestore security rules for:

-   User ownership
-   Organizer-owned event creation/update/delete
-   RSVP ownership
-   Organizer announcement ownership
-   Restricted fallback access

See [SECURITY.md](docs/SECURITY.md).

## Testing Checklist

-   [ ] Organizer registration
-   [ ] Attendee registration
-   [ ] Login/logout
-   [ ] Event creation
-   [ ] Event editing
-   [ ] Event cancellation
-   [ ] Event deletion
-   [ ] Attendee event discovery
-   [ ] GOING RSVP
-   [ ] MAYBE RSVP
-   [ ] NOT GOING RSVP
-   [ ] RSVP update
-   [ ] Capacity restriction
-   [ ] Live RSVP counters
-   [ ] Organizer analytics
-   [ ] Announcement creation
-   [ ] Announcement editing/deletion
-   [ ] Live attendee announcements
-   [ ] Upcoming events
-   [ ] Mobile navigation
-   [ ] Firestore security rules

## Current MVP Scope

The current version focuses on the core real-time event and RSVP
workflow.

Planned future enhancements are documented separately and are
intentionally not part of the current MVP.

## Future Enhancements

-   Waitlist with FIFO processing
-   QR invitation and check-in
-   Push/email notifications
-   Advanced analytics
-   Admin dashboard
-   REST API/backend service
-   Automated testing
-   Production deployment
-   Calendar integration
-   Event image upload
-   Audit log
-   Advanced reporting

See [FUTURE_ENHANCEMENTS.md](docs/FUTURE_ENHANCEMENTS.md).

## Academic / Cloud Computing Relevance

This project demonstrates how a traditional event registration workflow
can be implemented using managed cloud services. Firebase removes the
need to maintain an authentication server and database server while
Firestore provides real-time synchronization and scalable document
storage.

## License

This project is intended for educational and portfolio purposes.
