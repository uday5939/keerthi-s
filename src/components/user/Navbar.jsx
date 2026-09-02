import React, { useState } from "react";
import "./Navbar.css";

function Navbar({
  business,
  onOpenOrder,
  onScrollToStory,
  onScrollToKitchen,
  onScrollToCollection,
}) {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const businessName =
    business?.business_name ||
    "Keerthi's Pickles";

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className="user-navbar">

      <div className="navbar-inner">

        <button
          className="navbar-brand"
          onClick={() => {
            closeMenu();

            window.scrollTo({
              top: 0,
              behavior: "smooth",
            });
          }}
        >
          <span className="navbar-logo">
            KP
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

        <button
          className={`mobile-menu-button ${
            menuOpen
              ? "active"
              : ""
          }`}
          onClick={() =>
            setMenuOpen(
              (value) => !value
            )
          }
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <nav
          className={`navbar-links ${
            menuOpen ? "open" : ""
          }`}
        >

          <button
            onClick={() => {
              closeMenu();

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          >
            Home
          </button>

          <button
            onClick={() => {
              closeMenu();
              onScrollToCollection();
            }}
          >
            Pickles
          </button>

          <button
            onClick={() => {
              closeMenu();
              onScrollToKitchen();
            }}
          >
            Our Kitchen
          </button>

          <button
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