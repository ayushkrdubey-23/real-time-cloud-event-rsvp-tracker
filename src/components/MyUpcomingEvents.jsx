import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";
import { listenToMyUpcomingEvents } from "../services/myEventService";

function MyUpcomingEvents({ onViewDetails }) {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.uid) {
      setEvents([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const unsubscribe = listenToMyUpcomingEvents(
      user.uid,
      (upcomingEvents) => {
        setEvents(upcomingEvents);
        setLoading(false);
      },
      (err) => {
        console.error(
          "MY UPCOMING EVENTS LISTENER ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load your upcoming events."
        );

        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user?.uid]);

  function formatEventDate(dateString) {
    if (!dateString) {
      return "Date not available";
    }

    try {
      const date = new Date(
        `${dateString}T00:00:00`
      );

      return date.toLocaleDateString(
        undefined,
        {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      );
    } catch {
      return dateString;
    }
  }

  if (loading) {
    return (
      <div className="upcoming-events-section">
        <div className="section-heading">
          <div>
            <h2>My Upcoming Events</h2>
            <p>
              Events you are attending.
            </p>
          </div>
        </div>

        <div className="upcoming-events-empty">
          <p>
            Loading your upcoming events...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="upcoming-events-section">

      <div className="section-heading">

        <div>
          <h2>
            My Upcoming Events
          </h2>

          <p>
            Events you have confirmed with
            a GOING RSVP.
          </p>
        </div>

        <span className="upcoming-events-count">
          {events.length}{" "}
          {events.length === 1
            ? "Event"
            : "Events"}
        </span>

      </div>


      {error && (
        <div className="error-message">

          <strong>
            Unable to load events.
          </strong>

          <br />

          {error}

        </div>
      )}


      {!error && events.length === 0 && (
        <div className="upcoming-events-empty">

          <div className="upcoming-events-empty-icon">
            📅
          </div>

          <h3>
            No upcoming events
          </h3>

          <p>
            Events that you mark as GOING
            will appear here automatically.
          </p>

        </div>
      )}


      {!error && events.length > 0 && (
        <div className="upcoming-events-grid">

          {events.map((event) => {

            const goingCount = Number(
              event.goingCount || 0
            );

            const capacity = Number(
              event.maximumCapacity || 0
            );

            const remainingSeats =
              Math.max(
                capacity - goingCount,
                0
              );

            const isFull =
              capacity > 0 &&
              goingCount >= capacity;

            return (
              <div
                className="upcoming-event-card"
                key={event.id}
              >

                <div className="upcoming-event-card-top">

                  <span className="event-type-badge">
                    {event.eventType ||
                      "Event"}
                  </span>

                  <span className="going-status-badge">
                    ✓ GOING
                  </span>

                </div>


                <h3>
                  {event.eventName}
                </h3>


                <p className="upcoming-event-description">
                  {event.description ||
                    "No description provided."}
                </p>


                <div className="upcoming-event-info">

                  <div>
                    <span>📅</span>

                    <strong>
                      {formatEventDate(
                        event.eventDate
                      )}
                    </strong>
                  </div>


                  <div>
                    <span>🕐</span>

                    <strong>
                      {event.startTime} -{" "}
                      {event.endTime}
                    </strong>
                  </div>


                  <div>
                    <span>📍</span>

                    <strong>
                      {event.venue ||
                        "Online Event"}
                    </strong>
                  </div>

                </div>


                <div className="upcoming-event-capacity">

                  <span>
                    {remainingSeats} seats
                    remaining
                  </span>

                  {isFull && (
                    <span className="capacity-full-text">
                      Full
                    </span>
                  )}

                </div>


                <button
                  type="button"
                  className="secondary-button upcoming-event-details-button"
                  onClick={() => {
                    if (onViewDetails) {
                      onViewDetails(event);
                    }
                  }}
                >
                  View Event Details
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default MyUpcomingEvents;