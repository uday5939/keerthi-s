import React, { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import "./Videos.css";

function OurKitchen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadKitchenImages();
  }, []);

  async function loadKitchenImages() {
    setLoading(true);

    const { data, error } = await supabase
      .from("kitchen_images")
      .select("id, image_url, display_order")
      .eq("is_active", true)
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error(
        "Unable to load kitchen images:",
        error
      );

      setImages([]);
      setLoading(false);

      return;
    }

    setImages(data || []);
    setLoading(false);
  }

  return (
    <section
      className="our-kitchen-section"
      id="kitchen"
    >
      <div className="our-kitchen-container">

        {/* HEADER */}

        <div className="our-kitchen-header">

          <div className="our-kitchen-heading">

            <div className="our-kitchen-label">
              <span>03</span>
              <i></i>
              <span>OUR KITCHEN</span>
            </div>

            <h2>
              Made with care,
              <br />
              <em>made at home.</em>
            </h2>

          </div>

          <div className="our-kitchen-intro">
            <p>
              A glimpse into the kitchen
              where every jar of Keerthi's
              homemade pickles is prepared
              with care and tradition.
            </p>
          </div>

        </div>

      </div>

      {/* IMAGE STRIP */}

      {loading ? (
        <div className="our-kitchen-status">
          Loading our kitchen...
        </div>
      ) : images.length === 0 ? (
        <div className="our-kitchen-status">
          Our kitchen images will appear here soon.
        </div>
      ) : (
        <div className="kitchen-marquee">

          <div className="kitchen-marquee-track">

            {/* FIRST SET */}

            {images.map((image) => (
              <div
                className="kitchen-image-card"
                key={`first-${image.id}`}
              >
                <img
                  src={image.image_url}
                  alt="Keerthi's Kitchen"
                  loading="lazy"
                />
              </div>
            ))}

            {/* DUPLICATE SET FOR SEAMLESS LOOP */}

            {images.map((image) => (
              <div
                className="kitchen-image-card"
                key={`second-${image.id}`}
                aria-hidden="true"
              >
                <img
                  src={image.image_url}
                  alt=""
                  loading="lazy"
                />
              </div>
            ))}

          </div>

        </div>
      )}

    </section>
  );
}

export default OurKitchen;