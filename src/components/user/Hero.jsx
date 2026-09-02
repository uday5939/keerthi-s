import React from "react";
import "./Hero.css";

function Hero({
  business,
  onExplore,
  onKitchen,
}) {
  const heroImage =
    business?.hero_image_url ||
    business?.logo_url;

  const tagline =
    business?.tagline ||
    "Homemade with love";

  const description =
    business?.description ||
    "Traditional homemade pickles prepared with care, authentic ingredients and unforgettable flavour.";

  return (
    <section className="hero-section">

      <div
        className="hero-background"
        style={
          heroImage
            ? {
                backgroundImage: `linear-gradient(
                  rgba(23, 53, 42, 0.72),
                  rgba(23, 53, 42, 0.78)
                ), url("${heroImage}")`,
              }
            : undefined
        }
      >

        <div className="hero-pattern"></div>

        <div className="hero-content">

          <span className="hero-eyebrow">
            HOMEMADE • TRADITIONAL • AUTHENTIC
          </span>

          <div className="hero-line"></div>

          <h1>
            {business?.business_name ||
              "Keerthi's Pickles"}
          </h1>

          <h2>{tagline}</h2>

          <p>{description}</p>

          <div className="hero-actions">

            <button
              className="hero-primary"
              onClick={onExplore}
            >
              Explore Pickles
              <span>→</span>
            </button>

            <button
              className="hero-secondary"
              onClick={onKitchen}
            >
              Our Kitchen
            </button>

          </div>

        </div>

        <div className="hero-bottom">
          <span>EST. HOMEMADE</span>
          <span>✦</span>
          <span>MADE WITH CARE</span>
        </div>

      </div>

    </section>
  );
}

export default Hero;