import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import PickleCard from "./PickleCard";

import "./PickleCollection.css";

function PickleCollection({
  pickles,
  activeCategory,
  setActiveCategory,
  onOrder,
}) {
  const categories = [
    "All",
    "Veg Pickles",
    "Non-Veg Pickles",
    "Snacks",
  ];

  const [visibleCount, setVisibleCount] =
    useState(6);

  // ==================================================
  // RESET WHEN CATEGORY CHANGES
  // ==================================================

  useEffect(() => {
    setVisibleCount(6);
  }, [activeCategory]);

  // ==================================================
  // VISIBLE PRODUCTS
  // ==================================================

  const visiblePickles = useMemo(() => {
    return pickles.slice(
      0,
      visibleCount
    );
  }, [pickles, visibleCount]);

  const hasMore =
    visibleCount < pickles.length;

  // ==================================================
  // SHOW MORE
  // ==================================================

  function handleShowMore() {
    setVisibleCount(
      (current) => current + 6
    );
  }

  return (
    <section
      className="collection-section"
      id="pickles"
    >
      <div className="collection-container">

        {/* ==========================================
            HEADER
        ========================================== */}

        <div className="collection-header">

          <div className="collection-heading">

            <div className="section-label">

              <span>
                02
              </span>

              <i></i>

              <span>
                OUR COLLECTION
              </span>

            </div>

            <h2>
              Pickles made
              <br />
              <em>
                with tradition.
              </em>
            </h2>

          </div>

          <div className="collection-intro">

            <p>
              Explore our collection of homemade
              pickles and traditional snacks,
              prepared with authentic ingredients
              and generations of flavour.
            </p>

          </div>

        </div>

        {/* ==========================================
            CATEGORY FILTERS
        ========================================== */}

        <div className="collection-filters">

          {categories.map(
            (category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory === category
                    ? "collection-filter active"
                    : "collection-filter"
                }
                onClick={() =>
                  setActiveCategory(
                    category
                  )
                }
              >
                {category}
              </button>
            )
          )}

        </div>

        {/* ==========================================
            PRODUCTS
        ========================================== */}

        {pickles.length === 0 ? (
          <div className="collection-empty">

            <h3>
              No products available
            </h3>

            <p>
              Please check back soon for our
              homemade collection.
            </p>

          </div>
        ) : (

          <>

            <div className="collection-grid">

              {visiblePickles.map(
                (pickle) => (
                  <PickleCard
                    key={pickle.id}
                    pickle={pickle}
                    onOrder={onOrder}
                  />
                )
              )}

            </div>

            {/* ======================================
                SHOW MORE
            ====================================== */}

            {hasMore && (
              <div className="show-more-wrapper">

                <button
                  type="button"
                  className="show-more-button"
                  onClick={handleShowMore}
                >
                  Show More
                  <span>
                    +
                  </span>
                </button>

                <p className="show-more-count">
                  Showing{" "}
                  {visiblePickles.length}{" "}
                  of{" "}
                  {pickles.length}
                </p>

              </div>
            )}

          </>
        )}

      </div>
    </section>
  );
}

export default PickleCollection;