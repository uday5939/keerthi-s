import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import "./OwnerDashboard.css";

function OwnerDashboard() {
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);
  const [loadingBusiness, setLoadingBusiness] = useState(true);

  useEffect(() => {
    loadBusinessDetails();
  }, []);

  async function loadBusinessDetails() {
    setLoadingBusiness(true);

    const { data, error } = await supabase
      .from("business_details")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Unable to load business details:",
        error
      );

      setBusiness(null);
      setLoadingBusiness(false);

      return;
    }

    setBusiness(data || null);
    setLoadingBusiness(false);
  }


  /* ==================================================
     BUSINESS VALUES
     ================================================== */

  const businessName =
    business?.business_name ||
    "Keerthi's Pickles";

  const businessTagline =
    business?.tagline ||
    "HOMEMADE PICKLES";

  const logoUrl =
    business?.logo_url ||
    null;


  /* ==================================================
     LOGOUT
     ================================================== */

  async function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      alert(error.message);
      return;
    }

    navigate("/owner/login", {
      replace: true,
    });
  }


  return (
    <div className="luxury-owner">


      {/* ==================================================
          SIDEBAR
          ================================================== */}

      <aside className="luxury-sidebar">


        {/* ==================================================
            BRAND
            ================================================== */}

        <div className="sidebar-brand">

          <div className="brand-circle">

            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${businessName} logo`}
              />
            ) : (
              <span>
                KP
              </span>
            )}

          </div>


          <div className="sidebar-brand-text">

            <h2>
              {loadingBusiness
                ? "Keerthi's"
                : businessName}
            </h2>

            <span>
              {loadingBusiness
                ? "HOMEMADE PICKLES"
                : businessTagline}
            </span>

          </div>

        </div>


        <div className="sidebar-line"></div>


        {/* ==================================================
            MENU
            ================================================== */}

        <nav className="luxury-menu">


          {/* BUSINESS */}

          <Link to="/owner/business">

            <span className="menu-number">
              01
            </span>

            <span>
              Business Details
            </span>

          </Link>


          {/* PICKLES */}

          <Link to="/owner/pickles">

            <span className="menu-number">
              02
            </span>

            <span>
              Pickles
            </span>

          </Link>


          {/* OUR KITCHEN */}

          <Link to="/owner/images">

            <span className="menu-number">
              03
            </span>

            <span>
              Our Kitchen
            </span>

          </Link>

        </nav>


        {/* ==================================================
            SIDEBAR BOTTOM
            ================================================== */}

        <div className="sidebar-bottom">

          <div className="gold-line"></div>

          <p>
            {business?.tagline ||
              "Homemade with love"}
          </p>


          {/* LOGOUT */}

          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
          >

            <span>
              Logout
            </span>

            <span>
              ↗
            </span>

          </button>

        </div>

      </aside>


      {/* ==================================================
          MAIN
          ================================================== */}

      <main className="luxury-main">


        {/* ==================================================
            HEADING
            ================================================== */}

        <div className="luxury-heading">

          <span className="eyebrow">
            OWNER PANEL
          </span>

          <div className="heading-line"></div>

          <h1>
            {loadingBusiness
              ? "Keerthi's Pickles"
              : businessName}
          </h1>

          <p>
            Manage your homemade pickle collection,
            business details and kitchen images.
          </p>

        </div>


        {/* ==================================================
            MANAGEMENT GRID
            ================================================== */}

        <div className="management-grid">


          {/* ==================================================
              BUSINESS
              ================================================== */}

          <Link
            to="/owner/business"
            className="management-card"
          >

            <div className="card-number">
              01
            </div>

            <div className="card-icon">
              ✦
            </div>

            <h2>
              Business Details
            </h2>

            <p>
              Manage your brand information,
              contact details, logo and
              website information.
            </p>

            <div className="card-action">

              Manage

              <span>
                →
              </span>

            </div>

          </Link>


          {/* ==================================================
              PICKLES
              ================================================== */}

          <Link
            to="/owner/pickles"
            className="management-card"
          >

            <div className="card-number">
              02
            </div>

            <div className="card-icon">
              ✦
            </div>

            <h2>
              Pickles
            </h2>

            <p>
              Add and manage your homemade
              pickle varieties, prices, sizes
              and product images.
            </p>

            <div className="card-action">

              Manage

              <span>
                →
              </span>

            </div>

          </Link>


          {/* ==================================================
              OUR KITCHEN
              ================================================== */}

          <Link
            to="/owner/images"
            className="management-card"
          >

            <div className="card-number">
              03
            </div>

            <div className="card-icon">
              ✦
            </div>

            <h2>
              Our Kitchen
            </h2>

            <p>
              Upload and manage beautiful
              images that showcase your
              homemade pickle preparation.
            </p>

            <div className="card-action">

              Manage

              <span>
                →
              </span>

            </div>

          </Link>

        </div>


        {/* ==================================================
            MOBILE LOGOUT
            ================================================== */}

        <button
          type="button"
          className="mobile-logout"
          onClick={handleLogout}
        >

          Logout

          <span>
            →
          </span>

        </button>

      </main>

    </div>
  );
}

export default OwnerDashboard;