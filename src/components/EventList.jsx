import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  getAllEvents,
  cancelEvent,
  deleteEvent,
} from "../services/eventService";

import RsvpPanel from "./RsvpPanel";
import RsvpAnalytics from "./RsvpAnalytics";
import EditEvent from "./EditEvent";
import AnnouncementManager from "./AnnouncementManager";
import AnnouncementList from "./AnnouncementList";
import EventDetails from "./EventDetails";


function EventList({ organizerView = false }) {
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingEvent, setEditingEvent] = useState(null);
  const [announcementEvent, setAnnouncementEvent] = useState(null);

  const [selectedEvent, setSelectedEvent] = useState(null);


  async function loadEvents() {
    try {
      setLoading(true);
      setError("");

      const allEvents = await getAllEvents();

      let filteredEvents = allEvents;

      // Organizer sees only their own events
      if (organizerView) {
        filteredEvents = allEvents.filter(
          (event) => event.organizerId === user?.uid
        );
      }

      // Attendee sees only published events
      if (!organizerView) {
        filteredEvents = allEvents.filter(
          (event) => event.status === "PUBLISHED"
        );
      }

      setEvents(filteredEvents);

    } catch (err) {
      console.error("EVENT LOAD ERROR:", err);
      console.error("Error code:", err?.code);
      console.error("Error message:", err?.message);

      setError(
        err?.message ||
          "Unable to load events. Please check Firestore."
      );

    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    if (user?.uid) {
      loadEvents();
    }
  }, [user?.uid, organizerView]);


  async function handleCancel(eventId) {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await cancelEvent(eventId);
      await loadEvents();

      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }

    } catch (err) {
      console.error("CANCEL EVENT ERROR:", err);

      setError(
        err?.message ||
          "Failed to cancel event."
      );
    }
  }


  async function handleDelete(eventId) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this event?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteEvent(eventId);

      if (editingEvent?.id === eventId) {
        setEditingEvent(null);
      }

      if (announcementEvent?.id === eventId) {
        setAnnouncementEvent(null);
      }

      if (selectedEvent?.id === eventId) {
        setSelectedEvent(null);
      }

      await loadEvents();

    } catch (err) {
      console.error("DELETE EVENT ERROR:", err);

      setError(
        err?.message ||
          "Failed to delete event."
      );
    }
  }


  async function handleEventUpdated() {
    setEditingEvent(null);
    await loadEvents();

    if (selectedEvent?.id) {
      const updatedEvents = await getAllEvents();

      const updatedEvent = updatedEvents.find(
        (event) => event.id === selectedEvent.id
      );

      if (updatedEvent) {
        setSelectedEvent(updatedEvent);
      }
    }
  }


  function handleViewDetails(event) {
    setSelectedEvent(event);
  }


  function handleBackToEvents() {
    setSelectedEvent(null);
  }


  if (loading) {
    return <p>Loading events...</p>;
  }


  /*
   * =========================================
   * EVENT DETAILS VIEW
   * =========================================
   */

  if (selectedEvent) {
    return (
      <EventDetails
        event={selectedEvent}
        organizerView={organizerView}
        onBack={handleBackToEvents}
      />
    );
  }


  /*
   * =========================================
   * EVENT LIST VIEW
   * =========================================
   */

  return (
    <div>

      {error && (
        <div className="error-message">
          <strong>Failed to load events.</strong>

          <br />

          {error}
        </div>
      )}


      {!error && events.length === 0 && (
        <p>No events found.</p>
      )}


      {events.length > 0 && (
        <div className="event-grid">

          {events.map((event) => (
            <div
              className="event-card"
              key={event.id}
            >

              <h3>
                {event.eventName}
              </h3>


              <p>
                {event.description ||
                  "No description provided."}
              </p>


              <p>
                <strong>Type:</strong>{" "}
                {event.eventType}
              </p>


              <p>
                <strong>Date:</strong>{" "}
                {event.eventDate}
              </p>


              <p>
                <strong>Time:</strong>{" "}
                {event.startTime} -{" "}
                {event.endTime}
              </p>


              <p>
                <strong>Venue:</strong>{" "}
                {event.venue || "Online"}
              </p>


              {event.onlineLink && (
                <p>
                  <strong>Online Link:</strong>{" "}

                  <a
                    href={event.onlineLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Join Event
                  </a>
                </p>
              )}


              <p>
                <strong>Capacity:</strong>{" "}
                {event.maximumCapacity}
              </p>


              <p>
                <strong>Status:</strong>{" "}
                {event.status}
              </p>


              {/* ================================= */}
              {/* VIEW DETAILS */}
              {/* ================================= */}

              <div className="button-row">

                <button
                  type="button"
                  className="secondary-button"
                  onClick={() =>
                    handleViewDetails(event)
                  }
                >
                  View Details
                </button>

              </div>


              {/* ================================= */}
              {/* ATTENDEE RSVP PANEL */}
              {/* ================================= */}

              {!organizerView && (
                <RsvpPanel
                  event={event}
                />
              )}


              {/* ================================= */}
              {/* ATTENDEE LIVE ANNOUNCEMENTS */}
              {/* ================================= */}

              {!organizerView && (
                <AnnouncementList
                  eventId={event.id}
                />
              )}


              {/* ================================= */}
              {/* ORGANIZER RSVP ANALYTICS */}
              {/* ================================= */}

              {organizerView && (
                <RsvpAnalytics
                  event={event}
                />
              )}


              {/* ================================= */}
              {/* ORGANIZER CONTROLS */}
              {/* ================================= */}

              {organizerView && (
                <div className="button-row">

                  {event.status !== "CANCELLED" && (
                    <button
                      className="secondary-button"
                      onClick={() =>
                        setEditingEvent(event)
                      }
                    >
                      Edit Event
                    </button>
                  )}


                  {event.status !== "CANCELLED" && (
                    <button
                      className="secondary-button"
                      onClick={() =>
                        setAnnouncementEvent(
                          announcementEvent?.id === event.id
                            ? null
                            : event
                        )
                      }
                    >
                      {announcementEvent?.id === event.id
                        ? "Close Announcements"
                        : "Announcements"}
                    </button>
                  )}


                  {event.status !== "CANCELLED" && (
                    <button
                      className="secondary-button"
                      onClick={() =>
                        handleCancel(event.id)
                      }
                    >
                      Cancel Event
                    </button>
                  )}


                  <button
                    className="danger-button"
                    onClick={() =>
                      handleDelete(event.id)
                    }
                  >
                    Delete Event
                  </button>

                </div>
              )}


              {/* ================================= */}
              {/* EDIT EVENT FORM */}
              {/* ================================= */}

              {organizerView &&
                editingEvent?.id === event.id && (
                  <EditEvent
                    event={event}
                    onUpdated={handleEventUpdated}
                    onCancel={() =>
                      setEditingEvent(null)
                    }
                  />
                )}


              {/* ================================= */}
              {/* ANNOUNCEMENT MANAGER */}
              {/* ================================= */}

              {organizerView &&
                announcementEvent?.id === event.id && (
                  <AnnouncementManager
                    event={event}
                  />
                )}

            </div>
          ))}

        </div>
      )}

    </div>
  );
}


export default EventList;