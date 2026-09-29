# Firestore Database Schema

## users

Document ID:

``` text
users/{userId}
```

Fields:

  Field       Description
  ----------- -----------------------------
  uid         Firebase Authentication UID
  name        User display name
  email       User email
  role        organizer or attendee
  createdAt   Account creation timestamp

## events

Document ID:

``` text
events/{eventId}
```

Fields:

  Field                  Description
  ---------------------- -----------------------------
  eventId                Event identifier
  organizerId            UID of organizer
  organizerName          Organizer display name
  eventName              Event name
  description            Event description
  eventType              Event category
  eventDate              Event date
  startTime              Start time
  endTime                End time
  venue                  Physical venue
  onlineLink             Optional online meeting URL
  maximumCapacity        Maximum GOING registrations
  registrationDeadline   RSVP deadline
  status                 Event status
  goingCount             Current GOING count
  maybeCount             Current MAYBE count
  notGoingCount          Current NOT GOING count
  createdAt              Creation timestamp
  updatedAt              Last update timestamp

Typical statuses:

``` text
PUBLISHED
FULL
COMPLETED
CANCELLED
```

## rsvps

Document ID:

``` text
rsvps/{eventId}_{userId}
```

Fields:

  Field         Description
  ------------- ----------------------------
  eventId       Event identifier
  userId        Attendee UID
  status        GOING, MAYBE, or NOT_GOING
  respondedAt   Initial response time
  updatedAt     Last response update time

Using `{eventId}_{userId}` makes the RSVP relationship unique for one
attendee and one event.

## announcements

Document ID:

``` text
announcements/{announcementId}
```

Fields:

  Field         Description
  ------------- -----------------------
  eventId       Event identifier
  organizerId   Organizer UID
  title         Announcement title
  message       Announcement message
  createdAt     Creation timestamp
  updatedAt     Last update timestamp

## Relationships

``` text
users
  |
  +---- organizerId ----> events
  |
  +---- userId ---------> rsvps

events
  |
  +---- eventId --------> rsvps
  |
  +---- eventId --------> announcements
```

## Firestore Index

The announcement query uses:

``` text
where(eventId == selectedEvent)
orderBy(createdAt, desc)
```

Firestore may request a composite index for this query. The required
index can be created using the Firebase Console link shown in the
Firestore error.
