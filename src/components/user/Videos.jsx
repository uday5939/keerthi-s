import React from "react";
import "./Videos.css";

function Videos({ videos = [], loading = false }) {
  const activeVideos = videos.filter(
    (video) => video && video.video_url
  );

  return (
    <section
      className="videos-section"
      id="our-kitchen"
    >
      <div className="videos-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="videos-header">

          <div className="videos-heading">

            <div className="videos-section-label">
              <span>03</span>
              <i></i>
              <span>OUR KITCHEN</span>
            </div>

            <h2>
              Made with care.
              <br />
              <em>Shared with love.</em>
            </h2>

          </div>

          <div className="videos-intro">

            <p>
              Take a glimpse into the care,
              tradition and homemade goodness
              behind Keerthi's Pickles.
            </p>

          </div>

        </div>


        {/* ==========================================
            LOADING
        ========================================== */}

        {loading ? (

          <div className="videos-empty">

            <div className="videos-empty-mark">
              ✦
            </div>

            <p>
              Loading our kitchen...
            </p>

          </div>

        ) : activeVideos.length === 0 ? (

          /* ========================================
             EMPTY
          ======================================== */

          <div className="videos-empty">

            <div className="videos-empty-mark">
              ✦
            </div>

            <h3>
              Our kitchen is getting ready.
            </h3>

            <p>
              New glimpses from our kitchen
              will appear here soon.
            </p>

          </div>

        ) : (

          /* ========================================
             VIDEO GRID
          ======================================== */

          <div className="videos-grid">

            {activeVideos.map((video, index) => (

              <article
                className="public-video-card"
                key={video.id || index}
              >

                {/* VIDEO */}

                <div className="public-video-wrapper">

                  <video
                    src={video.video_url}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    disablePictureInPicture
                    controls={false}
                    controlsList="nodownload nofullscreen noremoteplayback"
                  />

                  {/* SUBTLE OVERLAY */}

                  <div className="video-overlay">
                    <span>
                      KEERTHI'S PICKLES
                    </span>
                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </div>
    </section>
  );
}

export default Videos;