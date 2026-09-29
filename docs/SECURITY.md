# Security Documentation

## Authentication

The application requires Firebase Authentication for protected Firestore
operations.

The MVP uses email/password authentication.

## User Data

Users can read, create, and update their own profile document.

Deleting user profile documents is disabled through the current rules.

## Events

Authenticated users can read events.

An event can be created only when:

``` text
request.resource.data.organizerId == request.auth.uid
```

Organizers can manage their own events.

Specific event counter/status updates are permitted for RSVP operations.

## RSVPs

Authenticated users can create an RSVP only for themselves.

Users can update or delete only their own RSVP documents.

## Announcements

Only the organizer who owns an announcement can create, update, or
delete it.

Authenticated users can read announcements.

## Default Deny

The final catch-all rule denies unspecified access:

``` text
match /{document=**} {
  allow read, write: if false;
}
```

This is important because new collections do not automatically become
publicly writable.

## Environment Configuration

Firebase configuration is stored through Vite environment variables.

The `.env` file should not be committed when it contains
environment-specific configuration that the project owner does not want
public.

The repository `.gitignore` includes environment file patterns.

## Production Considerations

Before production deployment, consider:

-   Stronger role enforcement using trusted server-side claims
-   App Check
-   More restrictive event read rules
-   Validation of event status transitions
-   Server-side notification processing
-   Rate limiting through a backend service
-   Audit logging
-   Monitoring and alerting
-   Automated security-rule tests
