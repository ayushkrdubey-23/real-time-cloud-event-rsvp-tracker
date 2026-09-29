import { useEffect, useState } from "react";
import { auth, db } from "./firebase";

function App() {
  const [firebaseStatus, setFirebaseStatus] = useState("Checking...");

  useEffect(() => {
    try {
      if (auth && db) {
        setFirebaseStatus("Firebase connected successfully");
      }
    } catch (error) {
      console.error("Firebase connection error:", error);
      setFirebaseStatus("Firebase connection failed");
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>Real-Time Cloud Event RSVP Tracker</h1>

        <p>{firebaseStatus}</p>
      </div>
    </div>
  );
}

export default App;