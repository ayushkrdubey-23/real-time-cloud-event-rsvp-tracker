import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";

import RsvpPanel from "./RsvpPanel";
import RsvpAnalytics from "./RsvpAnalytics";
import AnnouncementList from "./AnnouncementList";

function EventDetails({
  event,
  organizerView = false,
  onBack,
}) {
  const [liveEvent, setLiveEvent] = useState(event);

  useEffect(() => {
    if (!event?.id) {
      return;
    }

    const eventRef = doc(db, "events", event.id);

    const unsubscribe = onSnapshot(
      eventRef,
      (snapshot) => {
        if (snapshot.exists()) {
          setLiveEvent({
            id: snapshot.id,
            ...snapshot.data(),
          });
        }
      },
      (error) => {
        console.error(
          "EVENT DETAILS LISTENER ERROR:",
          error
        );
      }
    );

    return () => unsubscribe();
  }, [event?.id]);

  if (!liveEvent) {
    return (
      <div className="event-details-container">
        <div className="form-card">

          <h2>Event Not Found</h2>

          <p>
            The selected event could not be found.
          </p>

          {onBack && (
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              Back to Events
            </button>
          )}

        </div>
      </div>
    );
  }

  const goingCount = Number(
    liveEvent.goingCount || 0
  );

  const maximumCapacity = Number(
    liveEvent.maximumCapacity || 0
  );

  const remainingSeats = Math.max(
    maximumCapacity - goingCount,
    0
  );

  const isFull =
    maximumCapacity > 0 &&
    goingCount >= maximumCapacity;

  const isCancelled =
    liveEvent.status === "CANCELLED";

  return (
    <div className="event-details-container">

      <div className="event-details-card">

        {/* ============================= */}
        {/* TOP NAVIGATION */}
        {/* ============================= */}

        <div className="event-details-topbar">

          {onBack && (
            <button
              type="button"
              className="secondary-button"
              onClick={onBack}
            >
              ← Back to Events
            </button>
          )}

          <span className="live-event-indicator">
            ● LIVE DATA
          </span>

        </div>


        {/* ============================= */}
        {/* EVENT HEADER */}
        {/* ============================= */}

        <div className="event-details-header">

          <div className="event-details-title-area">

            <span className="event-type-badge">
              {liveEvent.eventType || "Event"}
            </span>

            <h2>
              {liveEvent.eventName}
            </h2>

            <p className="event-details-description">
              {liveEvent.description ||
                "No description provided."}
            </p>

          </div>


          <span
            className={`event-status-badge ${
              isCancelled
                ? "cancelled"
                : isFull
                ? "full"
                : "published"
            }`}
          >
            {isCancelled
              ? "CANCELLED"
              : isFull
              ? "FULL"
              : liveEvent.status}
          </span>

        </div>


        {/* ============================= */}
        {/* QUICK EVENT SUMMARY */}
        {/* ============================= */}

        <div className="event-summary-grid">

          <div className="event-summary-card">

            <span>
              📅 Date
            </span>

            <strong>
              {liveEvent.eventDate}
            </strong>

          </div>


          <div className="event-summary-card">

            <span>
              🕐 Time
            </span>

            <strong>
              {liveEvent.startTime} -{" "}
              {liveEvent.endTime}
            </strong>

          </div>


          <div className="event-summary-card">

            <span>
              👥 Seats Available
            </span>

            <strong>
              {remainingSeats}
            </strong>

          </div>


          <div className="event-summary-card">

            <span>
              📝 Registration Deadline
            </span>

            <strong>
              {liveEvent.registrationDeadline}
            </strong>

          </div>

        </div>


        {/* ============================= */}
        {/* EVENT INFORMATION */}
        {/* ============================= */}

        <div className="event-details-info-grid">

          <div className="event-info-item">

            <span className="event-info-label">
              📍 Venue
            </span>

            <strong>
              {liveEvent.venue ||
                "Online Event"}
            </strong>

          </div>


          <div className="event-info-item">

            <span className="event-info-label">
              👤 Organizer
            </span>

            <strong>
              {liveEvent.organizerName ||
                "Event Organizer"}
            </strong>

          </div>


          <div className="event-info-item">

            <span className="event-info-label">
              👥 Maximum Capacity
            </span>

            <strong>
              {maximumCapacity}
            </strong>

          </div>


          <div className="event-info-item">

            <span className="event-info-label">
              ✅ Confirmed Attendees
            </span>

            <strong>
              {goingCount}
            </strong>

          </div>

        </div>


        {/* ============================= */}
        {/* CAPACITY PROGRESS */}
        {/* ============================= */}

        <div className="event-capacity-section">

          <div className="event-capacity-header">

            <div>
              <h4>
                Registration Capacity
              </h4>

              <p>
                {goingCount} of{" "}
                {maximumCapacity} seats filled
              </p>
            </div>

            <strong>
              {maximumCapacity > 0
                ? Math.round(
                    (goingCount /
                      maximumCapacity) *
                      100
                  )
                : 0}
              %
            </strong>

          </div>


          <div className="event-capacity-bar">

            <div
              className="event-capacity-progress"
              style={{
                width: `${
                  maximumCapacity > 0
                    ? Math.min(
                        (goingCount /
                          maximumCapacity) *
                          100,
                        100
                      )
                    : 0
                }%`,
              }}
            />

          </div>


          <div className="event-capacity-footer">

            <span>
              {remainingSeats} seats remaining
            </span>

            {isFull && !isCancelled && (
              <span className="capacity-full-text">
                Event is currently full
              </span>
            )}

          </div>

        </div>


        {/* ============================= */}
        {/* ONLINE EVENT */}
        {/* ============================= */}

        {liveEvent.onlineLink && (
          <div className="online-event-section">

            <h4>
              🌐 Online Meeting
            </h4>

            <p>
              This event includes an online
              meeting option.
            </p>

            <a
              href={liveEvent.onlineLink}
              target="_blank"
              rel="noopener noreferrer"
              className="primary-link-button"
            >
              Join Online Event
            </a>

          </div>
        )}


        {/* ============================= */}
        {/* ATTENDEE RSVP */}
        {/* ============================= */}

        {!organizerView &&
          !isCancelled && (
            <div className="event-details-section">

              <RsvpPanel
                event={liveEvent}
              />

            </div>
          )}


        {/* ============================= */}
        {/* CANCELLED EVENT MESSAGE */}
        {/* ============================= */}

        {!organizerView &&
          isCancelled && (
            <div className="event-cancelled-message">

              <h4>
                Event Cancelled
              </h4>

              <p>
                This event has been cancelled
                by the organizer.
              </p>

            </div>
          )}


        {/* ============================= */}
        {/* ANNOUNCEMENTS */}
        {/* ============================= */}

        {!organizerView && (
          <div className="event-details-section">

            <AnnouncementList
              eventId={liveEvent.id}
            />

          </div>
        )}


        {/* ============================= */}
        {/* ORGANIZER ANALYTICS */}
        {/* ============================= */}

        {organizerView && (
          <div className="event-details-section">

            <RsvpAnalytics
              event={liveEvent}
            />

          </div>
        )}

      </div>

    </div>
  );
}

export default EventDetails;