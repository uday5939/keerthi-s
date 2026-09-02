import React from "react";
import "./Videos.css";

function Videos({ videos = [], loading = false }) {
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
            <p>
              Loading our kitchen...
            </p>
          </div>

        ) : videos.length === 0 ? (

          /* ========================================
             NO VIDEOS
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

            {videos
              .filter(
                (video) =>
                  video &&
                  video.video_url
              )
              .map((video) => (

                <article
                  className="public-video-card"
                  key={video.id}
                >

                  <div className="public-video-wrapper">

                    <video
                      src={video.video_url}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      disablePictureInPicture
                      controlsList="nodownload nofullscreen noremoteplayback"
                    />

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