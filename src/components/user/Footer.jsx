import React from "react";

import "./Footer.css";

function Footer({
  business,
  onExplore,
  onOrder,
}) {
  const businessName =
    business?.business_name ||
    "Keerthi's Pickles";

  const whatsapp =
    business?.whatsapp ||
    business?.phone;

  return (
    <footer className="user-footer">

      <div className="footer-container">

        <div className="footer-main">

          <div className="footer-brand">

            <div className="footer-logo">
              KP
            </div>

            <h2>
              {businessName}
            </h2>

            <p>
              {business?.tagline ||
                "Homemade with love"}
            </p>

          </div>

          <div className="footer-links">

            <div>
              <span>
                EXPLORE
              </span>

              <button
                onClick={() =>
                  window.scrollTo({
                    top: 0,
                    behavior:
                      "smooth",
                  })
                }
              >
                Home
              </button>

              <button
                onClick={
                  onExplore
                }
              >
                Explore Pickles
              </button>

              <button
                onClick={onOrder}
              >
                Order Now
              </button>
            </div>

            <div>
              <span>
                CONTACT
              </span>

              {business?.phone && (
                <a
                  href={`tel:${business.phone}`}
                >
                  {business.phone}
                </a>
              )}

              {whatsapp && (
                <a
                  href={`https://wa.me/${whatsapp.replace(
                    /\D/g,
                    ""
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp
                </a>
              )}

              {business?.email && (
                <a
                  href={`mailto:${business.email}`}
                >
                  {business.email}
                </a>
              )}
            </div>

            <div>
              <span>
                VISIT
              </span>

              {business?.address && (
                <p>
                  {business.address}

                  {business.city
                    ? `, ${business.city}`
                    : ""}
                </p>
              )}
            </div>

          </div>

        </div>

        <div className="footer-bottom">

          <span>
            ©{" "}
            {new Date().getFullYear()}{" "}
            {businessName}
          </span>

          <span>
            HOMEMADE • AUTHENTIC • TRADITIONAL
          </span>

        </div>

      </div>

    </footer>
  );
}

export default Footer;