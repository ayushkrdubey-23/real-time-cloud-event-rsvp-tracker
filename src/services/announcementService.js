import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "../firebase";


/*
  ============================================
  ANNOUNCEMENT COLLECTION
  ============================================

  Firestore:

  announcements/{announcementId}

  Fields:

  eventId
  organizerId
  title
  message
  createdAt
  updatedAt
*/


const announcementsCollection = collection(
  db,
  "announcements"
);


/*
  ============================================
  CREATE ANNOUNCEMENT
  ============================================
*/

export async function createAnnouncement({
  eventId,
  organizerId,
  title,
  message,
}) {
  if (!eventId) {
    throw new Error("Event ID is required.");
  }

  if (!organizerId) {
    throw new Error("Organizer ID is required.");
  }

  if (!title?.trim()) {
    throw new Error("Announcement title is required.");
  }

  if (!message?.trim()) {
    throw new Error("Announcement message is required.");
  }

  const announcementData = {
    eventId,
    organizerId,

    title: title.trim(),
    message: message.trim(),

    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const announcementRef = await addDoc(
    announcementsCollection,
    announcementData
  );

  return announcementRef.id;
}


/*
  ============================================
  GET ANNOUNCEMENTS FOR AN EVENT
  ============================================
*/

export async function getEventAnnouncements(eventId) {
  if (!eventId) {
    return [];
  }

  const announcementsQuery = query(
    announcementsCollection,
    where("eventId", "==", eventId),
    orderBy("createdAt", "desc")
  );

  const snapshot = await getDocs(
    announcementsQuery
  );

  return snapshot.docs.map((announcementDoc) => ({
    id: announcementDoc.id,
    ...announcementDoc.data(),
  }));
}


/*
  ============================================
  UPDATE ANNOUNCEMENT
  ============================================
*/

export async function updateAnnouncement(
  announcementId,
  updates
) {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const announcementRef = doc(
    db,
    "announcements",
    announcementId
  );

  await updateDoc(announcementRef, {
    ...updates,

    updatedAt: serverTimestamp(),
  });
}


/*
  ============================================
  DELETE ANNOUNCEMENT
  ============================================
*/

export async function deleteAnnouncement(
  announcementId
) {
  if (!announcementId) {
    throw new Error("Announcement ID is required.");
  }

  const announcementRef = doc(
    db,
    "announcements",
    announcementId
  );

  await deleteDoc(announcementRef);
}
