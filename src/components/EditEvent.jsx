import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateEvent } from "../services/eventService";

function EditEvent({ event, onUpdated, onCancel }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    eventName: event?.eventName || "",
    description: event?.description || "",
    eventType: event?.eventType || "Workshop",
    eventDate: event?.eventDate || "",
    startTime: event?.startTime || "",
    endTime: event?.endTime || "",
    venue: event?.venue || "",
    onlineLink: event?.onlineLink || "",
    maximumCapacity: event?.maximumCapacity || 100,
    registrationDeadline: event?.registrationDeadline || "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!event?.id) {
      setError("Event ID is missing.");
      return;
    }

    if (form.startTime >= form.endTime) {
      setError("End time must be later than start time.");
      return;
    }

    if (Number(form.maximumCapacity) <= 0) {
      setError("Capacity must be greater than zero.");
      return;
    }

    if (form.registrationDeadline > form.eventDate) {
      setError(
        "Registration deadline cannot be after the event date."
      );
      return;
    }

    try {
      setSaving(true);

      await updateEvent(event.id, {
        eventName: form.eventName.trim(),
        description: form.description.trim(),
        eventType: form.eventType,

        eventDate: form.eventDate,
        startTime: form.startTime,
        endTime: form.endTime,

        venue: form.venue.trim(),
        onlineLink: form.onlineLink.trim(),

        maximumCapacity: Number(form.maximumCapacity),

        registrationDeadline: form.registrationDeadline,
      });

      setMessage("Event updated successfully.");

      if (onUpdated) {
        await onUpdated();
      }
    } catch (err) {
      console.error("UPDATE EVENT ERROR:", err);

      setError(
        err?.message ||
          "Failed to update event. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="edit-event-container">
      <div className="form-card">
        <div className="edit-event-header">
          <div>
            <h2>Edit Event</h2>
            <p>
              Update the details of your event.
            </p>
          </div>

          {onCancel && (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={saving}
            >
              Close
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <label>Event Name</label>

          <input
            type="text"
            name="eventName"
            value={form.eventName}
            onChange={handleChange}
            placeholder="Cloud Computing Workshop"
            required
          />

          <label>Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your event"
            rows="4"
            required
          />

          <label>Event Type</label>

          <select
            name="eventType"
            value={form.eventType}
            onChange={handleChange}
          >
            <option>Workshop</option>
            <option>Conference</option>
            <option>Seminar</option>
            <option>Webinar</option>
            <option>College Event</option>
            <option>Meetup</option>
            <option>Other</option>
          </select>

          <label>Event Date</label>

          <input
            type="date"
            name="eventDate"
            value={form.eventDate}
            onChange={handleChange}
            required
          />

          <label>Start Time</label>

          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            required
          />

          <label>End Time</label>

          <input
            type="time"
            name="endTime"
            value={form.endTime}
            onChange={handleChange}
            required
          />

          <label>Venue</label>

          <input
            type="text"
            name="venue"
            value={form.venue}
            onChange={handleChange}
            placeholder="BIT Seminar Hall"
            required
          />

          <label>Online Meeting Link (Optional)</label>

          <input
            type="url"
            name="onlineLink"
            value={form.onlineLink}
            onChange={handleChange}
            placeholder="https://example.com/meeting"
          />

          <label>Maximum Capacity</label>

          <input
            type="number"
            name="maximumCapacity"
            value={form.maximumCapacity}
            onChange={handleChange}
            min="1"
            required
          />

          <label>Registration Deadline</label>

          <input
            type="date"
            name="registrationDeadline"
            value={form.registrationDeadline}
            onChange={handleChange}
            required
          />

          <div className="button-row">
            <button
              type="submit"
              disabled={saving}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

            {onCancel && (
              <button
                type="button"
                className="secondary-button"
                onClick={onCancel}
                disabled={saving}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {message && (
          <p className="success-message">
            {message}
          </p>
        )}

        {error && (
          <p className="error-message">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

export default EditEvent;
