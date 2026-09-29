# Project Report --- Real-Time Cloud-Based Event Planning & RSVP Tracker

## Abstract

The Real-Time Cloud-Based Event Planning & RSVP Tracker is a web-based
cloud application designed to simplify event creation, attendee
registration, RSVP management, capacity tracking, and organizer
communication.

The application uses React and Vite for the frontend and Firebase
services for authentication and cloud data storage. Cloud Firestore
real-time listeners provide live synchronization for RSVP analytics,
event details, announcements, and upcoming events.

## Objectives

1.  Build a cloud-based event management application.
2.  Provide organizer and attendee workflows.
3.  Implement secure authentication.
4.  Store event and RSVP information in a cloud database.
5.  Demonstrate real-time data synchronization.
6.  Handle event capacity through transactional updates.
7.  Provide live organizer analytics.
8.  Provide real-time event announcements.
9.  Build a responsive user interface.

## Functional Modules

### Authentication Module

Provides account registration, login, role selection, and logout.

### Event Management Module

Allows organizers to create, edit, cancel, delete, and view events.

### RSVP Module

Allows attendees to select and change RSVP status.

### Analytics Module

Displays live RSVP counts and capacity utilization.

### Announcement Module

Allows organizers to publish event-specific announcements.

### Upcoming Events Module

Displays future events for which the attendee has a GOING RSVP.

## Technology Selection

React was selected for component-based frontend development.

Vite provides a lightweight development and build environment.

Firebase Authentication provides managed authentication.

Cloud Firestore provides cloud NoSQL storage and real-time
synchronization.

## Results

The MVP demonstrates a complete event-to-RSVP workflow:

``` text
Authentication
     ↓
Role Selection
     ↓
Event Creation
     ↓
Event Discovery
     ↓
RSVP
     ↓
Live Capacity / Analytics
     ↓
Announcements
```

## Conclusion

The project demonstrates how managed cloud services can be combined with
a modern frontend framework to create a real-time application without
maintaining a traditional backend server for the MVP.

The architecture also provides a foundation for future services such as
notifications, waitlists, administration, automated testing, and
production deployment.
