import { useState } from "react";

import { useAuth } from "../context/AuthContext";

import EventList from "../components/EventList";
import MyUpcomingEvents from "../components/MyUpcomingEvents";
import EventDetails from "../components/EventDetails";
import UiStyles from "../components/UiStyles";


function Dashboard() {
  const { user, userProfile } = useAuth();

  const [selectedEvent, setSelectedEvent] =
    useState(null);

  const isOrganizer =
    userProfile?.role === "organizer";


  function handleViewUpcomingEvent(event) {
    setSelectedEvent(event);
  }


  function handleBackToUpcomingEvents() {
    setSelectedEvent(null);
  }


  if (!user) {
    return (
      <>
        <UiStyles />

        <div className="dashboard-container">
          <div className="form-card">

            <h2>Dashboard</h2>

            <p>
              Please log in to continue.
            </p>

          </div>
        </div>
      </>
    );
  }


  if (selectedEvent) {
    return (
      <>
        <UiStyles />

        <div className="dashboard-container">

          <EventDetails
            event={selectedEvent}
            organizerView={false}
            onBack={
              handleBackToUpcomingEvents
            }
          />

        </div>
      </>
    );
  }


  return (
    <>
      <UiStyles />

      <div className="dashboard-container">

        {/* ============================= */}
        {/* DASHBOARD HEADER */}
        {/* ============================= */}

        <div className="dashboard-header">

          <div>

            <h1>
              {isOrganizer
                ? "Organizer Dashboard"
                : "Attendee Dashboard"}
            </h1>

            <p>
              Welcome,{" "}
              {userProfile?.name ||
                user.displayName ||
                user.email}
            </p>

          </div>


          <div className="role-badge">

            {isOrganizer
              ? "ORGANIZER"
              : "ATTENDEE"}

          </div>

        </div>


        {/* ============================= */}
        {/* ATTENDEE */}
        {/* ============================= */}

        {!isOrganizer && (
          <>

            <MyUpcomingEvents
              onViewDetails={
                handleViewUpcomingEvent
              }
            />


            <div className="dashboard-section">

              <div className="section-heading">

                <div>

                  <h2>
                    Discover Events
                  </h2>

                  <p>
                    Browse published events
                    and manage your RSVP.
                  </p>

                </div>

              </div>


              <EventList
                organizerView={false}
              />

            </div>

          </>
        )}


        {/* ============================= */}
        {/* ORGANIZER */}
        {/* ============================= */}

        {isOrganizer && (
          <div className="dashboard-section">

            <div className="section-heading">

              <div>

                <h2>
                  My Events
                </h2>

                <p>
                  Manage your events, RSVPs,
                  and announcements.
                </p>

              </div>

            </div>


            <EventList
              organizerView={true}
            />

          </div>
        )}

      </div>
    </>
  );
}


export default Dashboard;