import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  createAnnouncement,
  getEventAnnouncements,
  updateAnnouncement,
  deleteAnnouncement,
} from "../services/announcementService";


function AnnouncementManager({ event }) {
  const { user } = useAuth();

  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  /*
    ============================================
    LOAD ANNOUNCEMENTS
    ============================================
  */

  async function loadAnnouncements() {
    if (!event?.id) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await getEventAnnouncements(event.id);

      setAnnouncements(data);
    } catch (err) {
      console.error(
        "ANNOUNCEMENT LOAD ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to load announcements."
      );
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    loadAnnouncements();
  }, [event?.id]);


  /*
    ============================================
    RESET FORM
    ============================================
  */

  function resetForm() {
    setTitle("");
    setMessage("");
    setEditingId(null);
  }


  /*
    ============================================
    CREATE / UPDATE
    ============================================
  */

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!user) {
      setError("You must be logged in.");
      return;
    }

    if (!title.trim()) {
      setError(
        "Announcement title is required."
      );
      return;
    }

    if (!message.trim()) {
      setError(
        "Announcement message is required."
      );
      return;
    }

    try {
      setSaving(true);

      /*
        UPDATE EXISTING ANNOUNCEMENT
      */

      if (editingId) {
        await updateAnnouncement(
          editingId,
          {
            title: title.trim(),
            message: message.trim(),
          }
        );

        setSuccess(
          "Announcement updated successfully."
        );
      }

      /*
        CREATE NEW ANNOUNCEMENT
      */

      else {
        await createAnnouncement({
          eventId: event.id,
          organizerId: user.uid,
          title: title.trim(),
          message: message.trim(),
        });

        setSuccess(
          "Announcement published successfully."
        );
      }

      resetForm();

      await loadAnnouncements();

    } catch (err) {
      console.error(
        "ANNOUNCEMENT SAVE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to save announcement."
      );
    } finally {
      setSaving(false);
    }
  }


  /*
    ============================================
    EDIT ANNOUNCEMENT
    ============================================
  */

  function handleEdit(announcement) {
    setEditingId(announcement.id);

    setTitle(
      announcement.title || ""
    );

    setMessage(
      announcement.message || ""
    );

    setError("");
    setSuccess("");
  }


  /*
    ============================================
    DELETE ANNOUNCEMENT
    ============================================
  */

  async function handleDelete(announcementId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");
      setSuccess("");

      await deleteAnnouncement(
        announcementId
      );

      setSuccess(
        "Announcement deleted successfully."
      );

      if (editingId === announcementId) {
        resetForm();
      }

      await loadAnnouncements();

    } catch (err) {
      console.error(
        "ANNOUNCEMENT DELETE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Failed to delete announcement."
      );
    }
  }


  /*
    ============================================
    DATE FORMATTER
    ============================================
  */

  function formatDate(timestamp) {
    if (!timestamp) {
      return "Just now";
    }

    try {
      const date = timestamp.toDate
        ? timestamp.toDate()
        : new Date(timestamp);

      return date.toLocaleString();
    } catch {
      return "Recently";
    }
  }


  return (
    <div className="announcement-manager">

      <div className="announcement-header">
        <div>
          <h4>
            Event Announcements
          </h4>

          <p>
            Share important updates with attendees.
          </p>
        </div>
      </div>


      {/* ======================================
          ANNOUNCEMENT FORM
          ====================================== */}

      <form
        className="announcement-form"
        onSubmit={handleSubmit}
      >

        <label>
          Announcement Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="Important event update"
          maxLength={100}
          required
        />


        <label>
          Message
        </label>

        <textarea
          value={message}
          onChange={(e) =>
            setMessage(e.target.value)
          }
          placeholder="Write your announcement..."
          rows="4"
          maxLength={1000}
          required
        />


        <div className="button-row">

          <button
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingId
                ? "Update Announcement"
                : "Publish Announcement"}
          </button>


          {editingId && (
            <button
              type="button"
              className="secondary-button"
              onClick={resetForm}
              disabled={saving}
            >
              Cancel Edit
            </button>
          )}

        </div>

      </form>


      {/* ======================================
          MESSAGES
          ====================================== */}

      {success && (
        <p className="success-message">
          {success}
        </p>
      )}

      {error && (
        <p className="error-message">
          {error}
        </p>
      )}


      {/* ======================================
          ANNOUNCEMENT LIST
          ====================================== */}

      <div className="announcement-list">

        <h5>
          Published Announcements
        </h5>


        {loading && (
          <p>
            Loading announcements...
          </p>
        )}


        {!loading &&
          announcements.length === 0 && (
            <p className="empty-message">
              No announcements yet.
            </p>
          )}


        {!loading &&
          announcements.length > 0 &&
          announcements.map(
            (announcement) => (
              <div
                className="announcement-item"
                key={announcement.id}
              >

                <div className="announcement-item-content">

                  <h5>
                    {announcement.title}
                  </h5>

                  <p>
                    {announcement.message}
                  </p>

                  <small>
                    Published:{" "}
                    {formatDate(
                      announcement.createdAt
                    )}
                  </small>

                </div>


                <div className="announcement-actions">

                  <button
                    type="button"
                    className="secondary-button"
                    onClick={() =>
                      handleEdit(
                        announcement
                      )
                    }
                  >
                    Edit
                  </button>


                  <button
                    type="button"
                    className="danger-button"
                    onClick={() =>
                      handleDelete(
                        announcement.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            )
          )}

      </div>

    </div>
  );
}


export default AnnouncementManager;