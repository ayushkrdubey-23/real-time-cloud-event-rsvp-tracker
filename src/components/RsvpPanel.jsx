import { useEffect, useState } from "react";

import { useAuth } from "../context/AuthContext";

import {
  listenToMyRsvp,
  saveRsvp,
} from "../services/rsvpService";


function RsvpPanel({ event }) {

  const { user } = useAuth();

  const [myRsvp, setMyRsvp] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  useEffect(() => {

    if (!user?.uid || !event?.id) {
      return;
    }

    const unsubscribe = listenToMyRsvp(
      event.id,
      user.uid,
      (rsvp) => {
        setMyRsvp(rsvp);
      }
    );

    return () => unsubscribe();

  }, [user?.uid, event?.id]);


  async function handleRsvp(status) {

    if (!user?.uid) {
      setError("Please login first.");
      return;
    }

    try {

      setSaving(true);
      setError("");
      setSuccess("");

      await saveRsvp(
        event.id,
        user.uid,
        status
      );

      setSuccess(
        `Your RSVP has been updated to ${status}.`
      );

    } catch (err) {

      console.error("RSVP ERROR:", err);

      setError(
        err?.message ||
        "Failed to save RSVP."
      );

    } finally {

      setSaving(false);
    }
  }


  const goingCount = Number(event.goingCount || 0);

  const maximumCapacity =
    Number(event.maximumCapacity || 0);

  const isFull =
    goingCount >= maximumCapacity;


  return (
    <div className="rsvp-panel">

      <h4>Your RSVP</h4>


      {myRsvp && (
        <p className="current-rsvp">
          Current response:
          <strong> {myRsvp.status}</strong>
        </p>
      )}


      <div className="rsvp-stats">

        <span>
          GOING: <strong>{goingCount}</strong>
        </span>

        <span>
          MAYBE:{" "}
          <strong>
            {Number(event.maybeCount || 0)}
          </strong>
        </span>

        <span>
          NOT GOING:{" "}
          <strong>
            {Number(event.notGoingCount || 0)}
          </strong>
        </span>

      </div>


      <p>
        Capacity:{" "}
        <strong>
          {goingCount} / {maximumCapacity}
        </strong>
      </p>


      {error && (
        <div className="rsvp-error">
          {error}
        </div>
      )}


      {success && (
        <div className="rsvp-success">
          {success}
        </div>
      )}


      <div className="rsvp-buttons">

        <button
          className="rsvp-going"
          disabled={
            saving ||
            (isFull && myRsvp?.status !== "GOING")
          }
          onClick={() => handleRsvp("GOING")}
        >
          {saving ? "Saving..." : "GOING"}
        </button>


        <button
          className="rsvp-maybe"
          disabled={saving}
          onClick={() => handleRsvp("MAYBE")}
        >
          MAYBE
        </button>


        <button
          className="rsvp-not-going"
          disabled={saving}
          onClick={() => handleRsvp("NOT_GOING")}
        >
          NOT GOING
        </button>

      </div>


      {isFull && myRsvp?.status !== "GOING" && (
        <p className="capacity-warning">
          This event is currently full.
        </p>
      )}

    </div>
  );
}


export default RsvpPanel;