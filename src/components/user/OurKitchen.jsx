import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import "./OurKitchen.css";

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
      .select("id, image_url, display_order, created_at")
      .eq("is_active", true)
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error("Unable to load kitchen images:", error);
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
      id="our-kitchen"
    >
      {/* ==================================================
          DECORATIVE BACKGROUND
      ================================================== */}

      <div className="kitchen-bg-circle kitchen-bg-circle-one"></div>
      <div className="kitchen-bg-circle kitchen-bg-circle-two"></div>

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="our-kitchen-container">

        <div className="our-kitchen-top">

          <div className="our-kitchen-number">
            03
          </div>

          <div className="our-kitchen-line"></div>

          <span>
            OUR KITCHEN
          </span>

        </div>


        <div className="our-kitchen-header">

          <div className="our-kitchen-heading">

            <span className="kitchen-small-label">
              A GLIMPSE BEHIND THE JAR
            </span>

            <h2>
              Made with care,
              <br />
              <em>made at home.</em>
            </h2>

          </div>


          <div className="our-kitchen-intro">

            <div className="kitchen-intro-mark">
              ✦
            </div>

            <p>
              A glimpse into the kitchen where every jar
              of Keerthi's homemade pickles is prepared
              with care, tradition and a whole lot of love.
            </p>

          </div>

        </div>


        {/* ==================================================
            DECORATIVE DIVIDER
        ================================================== */}

        <div className="kitchen-divider">

          <span></span>

          <div>
            <span>HANDMADE</span>
            <b>✦</b>
            <span>HOMEMADE</span>
            <b>✦</b>
            <span>HEARTMADE</span>
          </div>

          <span></span>

        </div>

      </div>


      {/* ==================================================
          IMAGE GALLERY
      ================================================== */}

      {loading ? (

        <div className="our-kitchen-status">

          <div className="kitchen-loader"></div>

          <span>
            Preparing our kitchen...
          </span>

        </div>

      ) : images.length === 0 ? (

        <div className="our-kitchen-status">

          <div className="empty-kitchen-icon">
            ✦
          </div>

          <span>
            Our kitchen images will appear here soon.
          </span>

        </div>

      ) : (

        <div className="kitchen-gallery-wrapper">

          {/* LEFT FADE */}

          <div className="kitchen-gallery-fade kitchen-gallery-fade-left"></div>

          {/* RIGHT FADE */}

          <div className="kitchen-gallery-fade kitchen-gallery-fade-right"></div>


          <div className="kitchen-marquee">

            <div className="kitchen-marquee-track">

              {/* FIRST SET */}

              {images.map((image, index) => (

                <div
                  className={`kitchen-image-card kitchen-card-${index % 3}`}
                  key={`first-${image.id}`}
                >

                  <div className="kitchen-image-inner">

                    <img
                      src={image.image_url}
                      alt="Keerthi's Kitchen"
                      loading="lazy"
                    />

                    <div className="kitchen-image-overlay">

                      <span>
                        KEERTHI'S KITCHEN
                      </span>

                      <i>
                        ✦
                      </i>

                    </div>

                  </div>

                </div>

              ))}


              {/* DUPLICATE SET FOR LOOP */}

              {images.map((image, index) => (

                <div
                  className={`kitchen-image-card kitchen-card-${index % 3}`}
                  key={`second-${image.id}`}
                  aria-hidden="true"
                >

                  <div className="kitchen-image-inner">

                    <img
                      src={image.image_url}
                      alt=""
                      loading="lazy"
                    />

                    <div className="kitchen-image-overlay">

                      <span>
                        KEERTHI'S KITCHEN
                      </span>

                      <i>
                        ✦
                      </i>

                    </div>

                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      )}


      {/* ==================================================
          BOTTOM NOTE
      ================================================== */}

      {!loading && images.length > 0 && (

        <div className="our-kitchen-bottom">

          <div className="kitchen-bottom-line"></div>

          <div className="kitchen-bottom-content">

            <span>
              FROM OUR KITCHEN
            </span>

            <div className="kitchen-bottom-dot">
              ✦
            </div>

            <span>
              WITH LOVE
            </span>

          </div>

          <div className="kitchen-bottom-line"></div>

        </div>

      )}

    </section>
  );
}

export default OurKitchen;