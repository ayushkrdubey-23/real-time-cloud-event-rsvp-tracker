import {
  doc,
  getDoc,
  onSnapshot,
  runTransaction,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

import { db } from "../firebase";


function getRsvpId(eventId, userId) {
  return `${eventId}_${userId}`;
}


/*
  Create or update RSVP.

  Only GOING consumes event capacity.
*/
export async function saveRsvp(eventId, userId, status) {
  const eventRef = doc(db, "events", eventId);

  const rsvpId = getRsvpId(eventId, userId);
  const rsvpRef = doc(db, "rsvps", rsvpId);

  await runTransaction(db, async (transaction) => {

    const eventSnapshot = await transaction.get(eventRef);

    if (!eventSnapshot.exists()) {
      throw new Error("Event not found.");
    }

    const event = eventSnapshot.data();

    if (event.status === "CANCELLED") {
      throw new Error("This event has been cancelled.");
    }

    if (event.status === "COMPLETED") {
      throw new Error("This event has already been completed.");
    }


    const rsvpSnapshot = await transaction.get(rsvpRef);

    const previousStatus = rsvpSnapshot.exists()
      ? rsvpSnapshot.data().status
      : null;


    let goingCount = Number(event.goingCount || 0);
    let maybeCount = Number(event.maybeCount || 0);
    let notGoingCount = Number(event.notGoingCount || 0);


    // Remove previous status count
    if (previousStatus === "GOING") {
      goingCount = Math.max(0, goingCount - 1);
    }

    if (previousStatus === "MAYBE") {
      maybeCount = Math.max(0, maybeCount - 1);
    }

    if (previousStatus === "NOT_GOING") {
      notGoingCount = Math.max(0, notGoingCount - 1);
    }


    // Capacity applies only to GOING
    if (status === "GOING") {

      const maximumCapacity =
        Number(event.maximumCapacity || 0);

      if (
        previousStatus !== "GOING" &&
        goingCount >= maximumCapacity
      ) {
        throw new Error(
          "This event is full. GOING registrations are no longer available."
        );
      }

      goingCount += 1;
    }


    if (status === "MAYBE") {
      maybeCount += 1;
    }


    if (status === "NOT_GOING") {
      notGoingCount += 1;
    }


    transaction.set(rsvpRef, {
      rsvpId,
      eventId,
      userId,
      status,
      respondedAt: rsvpSnapshot.exists()
        ? rsvpSnapshot.data().respondedAt
        : new Date(),
      updatedAt: new Date(),
    });


    transaction.update(eventRef, {
      goingCount,
      maybeCount,
      notGoingCount,
      status:
        goingCount >= Number(event.maximumCapacity || 0)
          ? "FULL"
          : "PUBLISHED",
    });
  });
}


/*
  Get current user's RSVP.
*/
export async function getMyRsvp(eventId, userId) {
  const rsvpId = getRsvpId(eventId, userId);

  const rsvpRef = doc(db, "rsvps", rsvpId);

  const snapshot = await getDoc(rsvpRef);

  if (!snapshot.exists()) {
    return null;
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}


/*
  Real-time listener for current user's RSVP.
*/
export function listenToMyRsvp(eventId, userId, callback) {
  const rsvpId = getRsvpId(eventId, userId);

  const rsvpRef = doc(db, "rsvps", rsvpId);

  return onSnapshot(
    rsvpRef,
    (snapshot) => {

      if (snapshot.exists()) {
        callback({
          id: snapshot.id,
          ...snapshot.data(),
        });
      } else {
        callback(null);
      }

    },
    (error) => {
      console.error("RSVP listener error:", error);
    }
  );
}


/*
  Get all RSVPs for an event.

  Organizer analytics will use this.
*/
export async function getEventRsvps(eventId) {
  const rsvpsCollection = collection(db, "rsvps");

  const rsvpQuery = query(
    rsvpsCollection,
    where("eventId", "==", eventId)
  );

  const snapshot = await getDocs(rsvpQuery);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}
