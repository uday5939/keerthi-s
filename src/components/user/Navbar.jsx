import React, { useState } from "react";
import "./Navbar.css";

function Navbar({
  business,
  onOpenOrder,
  onScrollToKitchen,
  onScrollToCollection,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const businessName =
    business?.business_name || "Keerthi's Pickles";

  const logoUrl = business?.logo_url || "";

  function closeMenu() {
    setMenuOpen(false);
  }

  function goHome() {
    closeMenu();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  return (
    <header className="user-navbar">
      <div className="navbar-inner">

        {/* ==========================================
            BRAND
        ========================================== */}

        <button
          type="button"
          className="navbar-brand"
          onClick={goHome}
        >

          <span className="navbar-logo">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={businessName}
              />
            ) : (
              <span className="navbar-logo-fallback">
                KP
              </span>
            )}
          </span>

          <span className="navbar-brand-text">
            <strong>
              {businessName}
            </strong>

            <small>
              HOMEMADE
            </small>
          </span>

        </button>

        {/* ==========================================
            MOBILE MENU BUTTON
        ========================================== */}

        <button
          type="button"
          className={`mobile-menu-button ${
            menuOpen ? "active" : ""
          }`}
          onClick={() =>
            setMenuOpen((value) => !value)
          }
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* ==========================================
            NAVIGATION
        ========================================== */}

        <nav
          className={`navbar-links ${
            menuOpen ? "open" : ""
          }`}
        >

          <button
            type="button"
            onClick={goHome}
          >
            Home
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              onScrollToCollection();
            }}
          >
            Pickles
          </button>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              onScrollToKitchen();
            }}
          >
            Our Kitchen
          </button>

          <button
            type="button"
            className="navbar-order-button"
            onClick={() => {
              closeMenu();
              onOpenOrder();
            }}
          >
            Order Now
          </button>

        </nav>

      </div>
    </header>
  );
}

export default Navbar;