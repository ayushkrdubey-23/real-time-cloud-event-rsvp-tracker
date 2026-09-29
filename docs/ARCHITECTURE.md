# System Architecture

## Architecture Style

The MVP uses a managed cloud architecture:

``` text
Browser
   |
   v
React + Vite
   |
   +----------------------+
   |                      |
   v                      v
Firebase Authentication   Cloud Firestore
                              |
                              +-- users
                              +-- events
                              +-- rsvps
                              +-- announcements
```

## Frontend Layer

React components provide:

-   Login and registration
-   Dashboard
-   Event management
-   Event details
-   RSVP controls
-   Analytics
-   Announcements
-   Responsive navigation

## Authentication Layer

Firebase Authentication manages email/password authentication.

After registration, a user profile document is created in Firestore.

## Data Layer

Cloud Firestore stores application data in collections.

The frontend uses the Firebase SDK to perform reads, writes, queries,
transactions, and real-time listeners.

## Real-Time Layer

Firestore `onSnapshot` listeners are used where live updates are
required.

Examples:

-   Event detail changes
-   RSVP status
-   Organizer RSVP counts
-   Attendee upcoming events
-   Event announcements

## Security Layer

Firestore Security Rules restrict operations based on authentication and
document ownership.

## Transaction Layer

RSVP changes that affect capacity use a Firestore transaction. This
allows the application to read current values and update related
documents together.

## Design Decision

The MVP intentionally uses the Firebase client SDK instead of creating a
separate REST API server. This keeps the first version smaller while
still demonstrating cloud authentication, database operations, security
rules, and real-time synchronization.

A dedicated API/backend layer can be added later.
