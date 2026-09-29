import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";

import { db } from "../firebase";


function RsvpAnalytics({ event }) {
  const [liveEvent, setLiveEvent] = useState(event);
  const [error, setError] = useState("");


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
      (err) => {
        console.error("Analytics listener error:", err);
        setError("Unable to load live RSVP analytics.");
      }
    );

    return () => unsubscribe();
  }, [event?.id]);


  if (error) {
    return (
      <div className="analytics-error">
        {error}
      </div>
    );
  }


  const going = Number(liveEvent?.goingCount || 0);
  const maybe = Number(liveEvent?.maybeCount || 0);
  const notGoing = Number(liveEvent?.notGoingCount || 0);

  const capacity = Number(
    liveEvent?.maximumCapacity || 0
  );

  const totalResponses =
    going + maybe + notGoing;

  const remainingSeats = Math.max(
    capacity - going,
    0
  );

  const occupancyPercentage =
    capacity > 0
      ? Math.min((going / capacity) * 100, 100)
      : 0;


  return (
    <div className="analytics-panel">

      <div className="analytics-header">
        <h4>RSVP Analytics</h4>

        <span className="live-badge">
          ● LIVE
        </span>
      </div>


      <div className="analytics-grid">

        <div className="analytics-card going-card">
          <span>GOING</span>
          <strong>{going}</strong>
        </div>


        <div className="analytics-card maybe-card">
          <span>MAYBE</span>
          <strong>{maybe}</strong>
        </div>


        <div className="analytics-card not-going-card">
          <span>NOT GOING</span>
          <strong>{notGoing}</strong>
        </div>


        <div className="analytics-card total-card">
          <span>TOTAL RESPONSES</span>
          <strong>{totalResponses}</strong>
        </div>

      </div>


      <div className="capacity-section">

        <div className="capacity-header">
          <span>Capacity</span>

          <strong>
            {going} / {capacity}
          </strong>
        </div>


        <div className="capacity-bar">
          <div
            className="capacity-progress"
            style={{
              width: `${occupancyPercentage}%`,
            }}
          />
        </div>


        <div className="capacity-footer">

          <span>
            {remainingSeats} seats remaining
          </span>

          <span>
            {Math.round(occupancyPercentage)}% occupied
          </span>

        </div>

      </div>

    </div>
  );
}


export default RsvpAnalytics;