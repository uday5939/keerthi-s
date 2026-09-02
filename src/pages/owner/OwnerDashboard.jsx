import React from "react";
import { Link } from "react-router-dom";
import "./OwnerDashboard.css";

function OwnerDashboard() {
  return (
    <div className="luxury-owner">

      {/* SIDEBAR */}
      <aside className="luxury-sidebar">

        <div className="sidebar-brand">
          <div className="brand-circle">KP</div>

          <div>
            <h2>Keerthi's</h2>
            <span>HOMEMADE PICKLES</span>
          </div>
        </div>

        <div className="sidebar-line"></div>

        <nav className="luxury-menu">

          <Link to="/owner/business">
            <span className="menu-number">01</span>
            <span>Business Details</span>
          </Link>

          <Link to="/owner/pickles">
            <span className="menu-number">02</span>
            <span>Pickles</span>
          </Link>

          <Link to="/owner/videos">
            <span className="menu-number">03</span>
            <span>Videos</span>
          </Link>

        </nav>

        <div className="sidebar-bottom">
          <div className="gold-line"></div>
          <p>Homemade with love</p>
        </div>

      </aside>


      {/* MAIN */}
      <main className="luxury-main">

        <div className="luxury-heading">

          <span className="eyebrow">
            OWNER PANEL
          </span>

          <div className="heading-line"></div>

          <h1>
            Keerthi's Pickles
          </h1>

          <p>
            Manage your homemade pickle collection,
            business details and brand videos.
          </p>

        </div>


        {/* THREE SECTIONS */}

        <div className="management-grid">

          <Link
            to="/owner/business"
            className="management-card"
          >
            <div className="card-number">01</div>

            <div className="card-icon">
              ✦
            </div>

            <h2>
              Business Details
            </h2>

            <p>
              Manage your brand information, contact details,
              logo and main website imagery.
            </p>

            <div className="card-action">
              Manage <span>→</span>
            </div>
          </Link>


          <Link
            to="/owner/pickles"
            className="management-card"
          >
            <div className="card-number">02</div>

            <div className="card-icon">
              ✦
            </div>

            <h2>
              Pickles
            </h2>

            <p>
              Add and manage your homemade pickle varieties,
              prices, sizes and product images.
            </p>

            <div className="card-action">
              Manage <span>→</span>
            </div>
          </Link>


          <Link
            to="/owner/videos"
            className="management-card"
          >
            <div className="card-number">03</div>

            <div className="card-icon">
              ✦
            </div>

            <h2>
              Videos
            </h2>

            <p>
              Upload beautiful videos that showcase your
              homemade pickle preparation and products.
            </p>

            <div className="card-action">
              Manage <span>→</span>
            </div>
          </Link>

        </div>

      </main>

    </div>
  );
}

export default OwnerDashboard;