# Testing Documentation

## Manual Functional Testing

### Authentication

  Test                     Expected Result
  ------------------------ ---------------------------------
  Organizer registration   Account and profile are created
  Attendee registration    Account and profile are created
  Valid login              User enters dashboard
  Invalid login            Authentication error is shown
  Logout                   User is signed out

### Event Management

  Test           Expected Result
  -------------- ---------------------------------------
  Create event   Event appears in organizer dashboard
  Edit event     Event data is updated
  Cancel event   Event status becomes CANCELLED
  Delete event   Event is removed
  View details   Dedicated event details are displayed

### RSVP

  Test          Expected Result
  ------------- ------------------------------------------------------
  GOING         GOING count increases
  MAYBE         MAYBE count increases
  NOT GOING     NOT GOING count increases
  Change RSVP   Previous counter decreases and new counter increases
  Full event    New GOING response is prevented
  Live update   Event analytics update without manual refresh

### Announcements

  Test                  Expected Result
  --------------------- ------------------------------------------
  Create announcement   Announcement appears
  Edit announcement     Announcement text changes
  Delete announcement   Announcement disappears
  Attendee listener     New announcement appears without refresh

### Upcoming Events

  Test                 Expected Result
  -------------------- -------------------------------------
  GOING future event   Appears in upcoming events
  Change from GOING    Event is removed from upcoming list
  Cancel event         Cancelled event is removed
  Past event           Past event is not listed

### Responsive UI

Test at:

-   Desktop
-   Tablet width
-   Mobile width

Verify that:

-   Navigation collapses
-   Buttons remain accessible
-   Event cards fit the viewport
-   Forms remain usable
-   Analytics cards stack correctly

## Build Verification

Before final submission, run:

``` bash
npm run build
```

A successful Vite build should complete without compilation errors.

## Known MVP Limitations

The current version does not yet include automated unit/integration
tests. The testing document therefore focuses on manual functional
verification.
