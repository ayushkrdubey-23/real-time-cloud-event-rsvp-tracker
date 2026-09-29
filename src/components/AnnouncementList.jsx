import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";


function AnnouncementList({ eventId }) {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {
    if (!eventId) {
      setAnnouncements([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    const announcementsRef = collection(
      db,
      "announcements"
    );

    const announcementsQuery = query(
      announcementsRef,
      where("eventId", "==", eventId),
      orderBy("createdAt", "desc")
    );


    const unsubscribe = onSnapshot(
      announcementsQuery,

      (snapshot) => {
        const announcementData = snapshot.docs.map(
          (announcementDoc) => ({
            id: announcementDoc.id,
            ...announcementDoc.data(),
          })
        );

        setAnnouncements(announcementData);
        setLoading(false);
      },

      (err) => {
        console.error(
          "REAL-TIME ANNOUNCEMENT ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load announcements."
        );

        setLoading(false);
      }
    );


    return () => {
      unsubscribe();
    };
  }, [eventId]);


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


  if (loading) {
    return (
      <div className="announcement-list">
        <h4>📢 Event Announcements</h4>

        <p>
          Loading announcements...
        </p>
      </div>
    );
  }


  return (
    <div className="announcement-list">

      <div className="announcement-list-header">
        <div>
          <h4>
            📢 Event Announcements
          </h4>

          <p>
            Live updates from the organizer.
          </p>
        </div>

        <span className="live-badge">
          ● LIVE
        </span>
      </div>


      {error && (
        <div className="error-message">
          {error}
        </div>
      )}


      {!error &&
        announcements.length === 0 && (
          <p className="empty-message">
            No announcements yet.
          </p>
        )}


      {!error &&
        announcements.length > 0 && (
          <div className="announcement-items">

            {announcements.map(
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

                </div>
              )
            )}

          </div>
        )}

    </div>
  );
}


export default AnnouncementList;