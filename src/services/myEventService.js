import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";


export async function getMyRsvps(userId) {
  if (!userId) {
    return [];
  }

  const rsvpsRef = collection(db, "rsvps");

  const rsvpsQuery = query(
    rsvpsRef,
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(rsvpsQuery);

  return snapshot.docs.map((rsvpDoc) => ({
    id: rsvpDoc.id,
    ...rsvpDoc.data(),
  }));
}


export async function getMyUpcomingEvents(userId) {
  if (!userId) {
    return [];
  }

  const [rsvps, eventsSnapshot] = await Promise.all([
    getMyRsvps(userId),
    getDocs(collection(db, "events")),
  ]);

  const events = eventsSnapshot.docs.map((eventDoc) => ({
    id: eventDoc.id,
    ...eventDoc.data(),
  }));

  const goingEventIds = new Set(
    rsvps
      .filter((rsvp) => rsvp.status === "GOING")
      .map((rsvp) => rsvp.eventId)
  );

  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return events
    .filter((event) => {
      if (!goingEventIds.has(event.id)) {
        return false;
      }

      if (event.status === "CANCELLED") {
        return false;
      }

      if (!event.eventDate) {
        return false;
      }

      const eventDate = new Date(
        `${event.eventDate}T00:00:00`
      );

      return eventDate >= today;
    })
    .sort((a, b) => {
      const firstDate = new Date(
        `${a.eventDate}T${a.startTime || "00:00"}`
      );

      const secondDate = new Date(
        `${b.eventDate}T${b.startTime || "00:00"}`
      );

      return firstDate - secondDate;
    });
}


export function listenToMyUpcomingEvents(
  userId,
  onEvents,
  onError
) {
  if (!userId) {
    onEvents([]);
    return () => {};
  }

  const rsvpsRef = collection(db, "rsvps");

  const rsvpsQuery = query(
    rsvpsRef,
    where("userId", "==", userId)
  );

  let latestRsvps = [];
  let latestEvents = [];

  function buildUpcomingEvents() {
    const goingEventIds = new Set(
      latestRsvps
        .filter(
          (rsvp) => rsvp.status === "GOING"
        )
        .map((rsvp) => rsvp.eventId)
    );

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const upcomingEvents = latestEvents
      .filter((event) => {
        if (!goingEventIds.has(event.id)) {
          return false;
        }

        if (event.status === "CANCELLED") {
          return false;
        }

        if (!event.eventDate) {
          return false;
        }

        const eventDate = new Date(
          `${event.eventDate}T00:00:00`
        );

        return eventDate >= today;
      })
      .sort((a, b) => {
        const firstDate = new Date(
          `${a.eventDate}T${
            a.startTime || "00:00"
          }`
        );

        const secondDate = new Date(
          `${b.eventDate}T${
            b.startTime || "00:00"
          }`
        );

        return firstDate - secondDate;
      });

    onEvents(upcomingEvents);
  }


  const unsubscribeRsvps = onSnapshot(
    rsvpsQuery,
    (snapshot) => {
      latestRsvps = snapshot.docs.map(
        (rsvpDoc) => ({
          id: rsvpDoc.id,
          ...rsvpDoc.data(),
        })
      );

      buildUpcomingEvents();
    },
    (error) => {
      console.error(
        "REAL-TIME RSVP LISTENER ERROR:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );


  const unsubscribeEvents = onSnapshot(
    collection(db, "events"),
    (snapshot) => {
      latestEvents = snapshot.docs.map(
        (eventDoc) => ({
          id: eventDoc.id,
          ...eventDoc.data(),
        })
      );

      buildUpcomingEvents();
    },
    (error) => {
      console.error(
        "REAL-TIME EVENT LISTENER ERROR:",
        error
      );

      if (onError) {
        onError(error);
      }
    }
  );


  return () => {
    unsubscribeRsvps();
    unsubscribeEvents();
  };
}