import React from "react";
import "./Story.css";

function Story({
  business,
  onExplore,
}) {
  return (
    <section
      id="our-story"
      className="story-section"
    >

      <div className="story-container">

        <div className="story-label">
          <span>01</span>
          <div></div>
          OUR STORY
        </div>

        <div className="story-grid">

          <div className="story-heading">
            <span>THE TASTE OF</span>
            <h2>
              Home,
              <br />
              in every jar.
            </h2>
          </div>

          <div className="story-content">

            <p className="story-main">
              {business?.description ||
                "Our pickles are made the traditional way, using carefully selected ingredients and recipes passed down with love."}
            </p>

            <p>
              From the first ingredient to the final
              spoonful, every batch is prepared with
              patience and care. No shortcuts. Just
              honest homemade flavour.
            </p>

            <button
              className="story-button"
              onClick={onExplore}
            >
              Discover Our Pickles
              <span>→</span>
            </button>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Story;