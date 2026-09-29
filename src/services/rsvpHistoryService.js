import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { db } from "../firebase";


export async function getMyRsvpHistory(userId) {
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


export async function getMyRsvpHistoryWithEvents(
  userId
) {
  if (!userId) {
    return [];
  }

  const [rsvpSnapshot, eventSnapshot] =
    await Promise.all([
      getDocs(
        query(
          collection(db, "rsvps"),
          where("userId", "==", userId)
        )
      ),
      getDocs(collection(db, "events")),
    ]);

  const rsvps = rsvpSnapshot.docs.map(
    (rsvpDoc) => ({
      id: rsvpDoc.id,
      ...rsvpDoc.data(),
    })
  );

  const events = eventSnapshot.docs.map(
    (eventDoc) => ({
      id: eventDoc.id,
      ...eventDoc.data(),
    })
  );

  const eventMap = new Map(
    events.map((event) => [
      event.id,
      event,
    ])
  );

  return rsvps
    .map((rsvp) => {
      const event = eventMap.get(
        rsvp.eventId
      );

      if (!event) {
        return null;
      }

      return {
        ...rsvp,
        event,
      };
    })
    .filter(Boolean)
    .sort((a, b) => {
      const firstDate = new Date(
        `${a.event.eventDate}T${
          a.event.startTime || "00:00"
        }`
      );

      const secondDate = new Date(
        `${b.event.eventDate}T${
          b.event.startTime || "00:00"
        }`
      );

      return secondDate - firstDate;
    });
}
