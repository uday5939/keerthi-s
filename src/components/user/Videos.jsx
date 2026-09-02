import React from "react";

import "./Videos.css";

function Videos({
  videos,
  loading,
}) {
  return (
    <section className="videos-section" id="our-kitchen">

      <div className="videos-container">

        <div className="videos-header">

          <div className="videos-label">
            <span>03</span>
            <div></div>
            FROM OUR KITCHEN
          </div>

          <h2>
            Made by hand.
            <br />
            <em>Made with love.</em>
          </h2>

        </div>

        {loading ? (
          <div className="videos-loading">
            Loading videos...
          </div>
        ) : videos.length === 0 ? (
          <div className="videos-empty">
            <span>✦</span>
            <p>
              Our kitchen stories are coming soon.
            </p>
          </div>
        ) : (
          <div className="videos-grid">

            {videos.map((video) => (
              <div
                className="video-card"
                key={video.id}
              >

                <video
                  src={video.video_url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  preload="metadata"
                />

                <div className="video-overlay">
                  <span>
                    KEERTHI'S PICKLES
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </section>
  );
}

export default Videos;