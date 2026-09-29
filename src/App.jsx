import { useState } from "react";

import { useAuth } from "./context/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Navbar from "./components/Navbar";


function App() {
  const { user, loading } = useAuth();

  const [showRegister, setShowRegister] =
    useState(false);


  if (loading) {
    return (
      <div style={{ padding: "40px" }}>
        Loading application...
      </div>
    );
  }


  return (
    <>

      {/* ============================= */}
      {/* NAVBAR */}
      {/* ============================= */}

      <Navbar />


      {/* ============================= */}
      {/* AUTHENTICATED USER */}
      {/* ============================= */}

      {user ? (
        <Dashboard />
      ) : showRegister ? (

        <>
          <Register />

          <div
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "30px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setShowRegister(false)
              }
            >
              Already have an account? Login
            </button>
          </div>
        </>

      ) : (

        <>
          <Login />

          <div
            style={{
              textAlign: "center",
              marginTop: "10px",
              marginBottom: "30px",
            }}
          >
            <button
              type="button"
              onClick={() =>
                setShowRegister(true)
              }
            >
              Create a new account
            </button>
          </div>
        </>

      )}

    </>
  );
}


export default App;
