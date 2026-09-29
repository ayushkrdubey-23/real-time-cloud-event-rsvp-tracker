import { useState } from "react";

import { useAuth } from "../context/AuthContext";
import { logoutUser } from "../services/authService";


function Navbar() {
  const { user, userProfile } = useAuth();

  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);


  async function handleLogout() {
    try {
      setLoggingOut(true);

      await logoutUser();

      setMenuOpen(false);

    } catch (error) {
      console.error(
        "LOGOUT ERROR:",
        error
      );

      alert(
        "Unable to logout. Please try again."
      );

    } finally {
      setLoggingOut(false);
    }
  }


  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    setMenuOpen(false);
  }


  return (
    <nav className="app-navbar">

      <div className="navbar-container">

        {/* ============================= */}
        {/* BRAND */}
        {/* ============================= */}

        <button
          type="button"
          className="navbar-brand"
          onClick={scrollToTop}
        >
          <span className="navbar-brand-icon">
            ☁
          </span>

          <span>
            EventCloud
          </span>
        </button>


        {/* ============================= */}
        {/* DESKTOP NAVIGATION */}
        {/* ============================= */}

        <div className="navbar-links">

          <button
            type="button"
            className="navbar-link active"
            onClick={scrollToTop}
          >
            Home
          </button>


          {user && (
            <button
              type="button"
              className="navbar-link active"
              onClick={scrollToTop}
            >
              Dashboard
            </button>
          )}

        </div>


        {/* ============================= */}
        {/* DESKTOP USER AREA */}
        {/* ============================= */}

        <div className="navbar-user-area">

          {user && (
            <>

              <div className="navbar-user-info">

                <span className="navbar-user-name">
                  {userProfile?.name ||
                    user.email}
                </span>

                <span className="navbar-user-role">
                  {userProfile?.role ||
                    "USER"}
                </span>

              </div>


              <button
                type="button"
                className="navbar-logout-button"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut
                  ? "Logging out..."
                  : "Logout"}
              </button>

            </>
          )}

        </div>


        {/* ============================= */}
        {/* MOBILE MENU BUTTON */}
        {/* ============================= */}

        <button
          type="button"
          className="navbar-menu-button"
          onClick={() =>
            setMenuOpen(
              (previous) => !previous
            )
          }
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

      </div>


      {/* ============================= */}
      {/* MOBILE MENU */}
      {/* ============================= */}

      {menuOpen && (
        <div className="navbar-mobile-menu">

          <button
            type="button"
            className="navbar-mobile-link active"
            onClick={scrollToTop}
          >
            🏠 Home
          </button>


          {user && (
            <button
              type="button"
              className="navbar-mobile-link active"
              onClick={scrollToTop}
            >
              📊 Dashboard
            </button>
          )}


          {user && (
            <div className="navbar-mobile-user">

              <div>

                <strong>
                  {userProfile?.name ||
                    user.email}
                </strong>

                <small>
                  {userProfile?.role ||
                    "USER"}
                </small>

              </div>


              <button
                type="button"
                className="navbar-mobile-logout"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                {loggingOut
                  ? "Logging out..."
                  : "🚪 Logout"}
              </button>

            </div>
          )}

        </div>
      )}

    </nav>
  );
}


export default Navbar;