import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "../firebase";

const eventsCollection = collection(db, "events");


export async function createEvent(eventData) {
  const event = {
    ...eventData,

    status: "PUBLISHED",

    goingCount: 0,
    maybeCount: 0,
    notGoingCount: 0,

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const document = await addDoc(eventsCollection, event);

  return {
    id: document.id,
    ...event,
  };
}


export async function getAllEvents() {
  const snapshot = await getDocs(eventsCollection);

  return snapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));
}


export async function getPublishedEvents() {
  const snapshot = await getDocs(eventsCollection);

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...document.data(),
    }))
    .filter((event) => event.status === "PUBLISHED");
}


export async function getOrganizerEvents(organizerId) {
  const snapshot = await getDocs(eventsCollection);

  return snapshot.docs
    .map((document) => ({
      id: document.id,
      ...document.data(),
    }))
    .filter((event) => event.organizerId === organizerId);
}


export async function getEventById(eventId) {
  const eventRef = doc(db, "events", eventId);

  const snapshot = await getDoc(eventRef);

  if (!snapshot.exists()) {
    throw new Error("Event not found.");
  }

  return {
    id: snapshot.id,
    ...snapshot.data(),
  };
}


export async function updateEvent(eventId, eventData) {
  const eventRef = doc(db, "events", eventId);

  await updateDoc(eventRef, {
    ...eventData,
    updatedAt: serverTimestamp(),
  });

  return getEventById(eventId);
}


export async function cancelEvent(eventId) {
  const eventRef = doc(db, "events", eventId);

  await updateDoc(eventRef, {
    status: "CANCELLED",
    updatedAt: serverTimestamp(),
  });

  return getEventById(eventId);
}


export async function deleteEvent(eventId) {
  const eventRef = doc(db, "events", eventId);

  await deleteDoc(eventRef);

  return true;
}