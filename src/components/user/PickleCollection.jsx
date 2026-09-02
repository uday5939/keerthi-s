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
  // ==================================================
  // CATEGORIES
  // ==================================================

  const categories = [
    "All",
    "Veg Pickles",
    "Non-Veg Pickles",
    "Snacks",
  ];

  // ==================================================
  // SEARCH
  // ==================================================

  const [searchTerm, setSearchTerm] =
    useState("");

  // ==================================================
  // SHOW MORE
  // ==================================================

  const [visibleCount, setVisibleCount] =
    useState(6);

  // ==================================================
  // RESET SHOW MORE WHEN FILTER OR SEARCH CHANGES
  // ==================================================

  useEffect(() => {
    setVisibleCount(6);
  }, [
    activeCategory,
    searchTerm,
  ]);

  // ==================================================
  // SEARCH PRODUCTS
  //
  // Home already sends products filtered by category.
  //
  // So here we ONLY add name search.
  // ==================================================

  const searchedPickles = useMemo(() => {
    const search =
      searchTerm.trim().toLowerCase();

    // No search
    if (!search) {
      return pickles;
    }

    // Search by product name
    return pickles.filter((pickle) =>
      String(
        pickle?.name || ""
      )
        .toLowerCase()
        .includes(search)
    );
  }, [
    pickles,
    searchTerm,
  ]);

  // ==================================================
  // VISIBLE PRODUCTS
  // ==================================================

  const visiblePickles =
    searchedPickles.slice(
      0,
      visibleCount
    );

  // ==================================================
  // SHOW MORE
  // ==================================================

  const hasMore =
    visibleCount <
    searchedPickles.length;

  function handleShowMore() {
    setVisibleCount(
      (current) => current + 6
    );
  }

  // ==================================================
  // CLEAR SEARCH
  // ==================================================

  function clearSearch() {
    setSearchTerm("");
  }

  // ==================================================
  // PAGE
  // ==================================================

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
              <span>02</span>

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
              Explore our collection
              of homemade pickles
              and traditional snacks,
              prepared with authentic
              ingredients and generations
              of flavour.
            </p>

          </div>

        </div>

        {/* ==========================================
            SEARCH
        ========================================== */}

        <div className="collection-search">

          <div className="collection-search-box">

            {/* SEARCH ICON */}

            <span className="collection-search-icon">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="6.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                />

                <path
                  d="M16 16L21 21"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </span>

            {/* INPUT */}

            <input
              type="text"
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(
                  e.target.value
                )
              }
              placeholder="Search pickles..."
              aria-label="Search pickles"
            />

            {/* CLEAR */}

            {searchTerm && (
              <button
                type="button"
                className="collection-search-clear"
                onClick={clearSearch}
                aria-label="Clear search"
              >
                ×
              </button>
            )}

          </div>

        </div>

        {/* ==========================================
            FILTERS
        ========================================== */}

        <div className="collection-filters">

          {categories.map(
            (category) => (
              <button
                key={category}
                type="button"
                className={
                  activeCategory ===
                  category
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

        {searchedPickles.length === 0 ? (

          <div className="collection-empty">

            <div className="collection-empty-icon">
              ⌕
            </div>

            {searchTerm.trim() ? (
              <>
                <h3>
                  No pickles found
                </h3>

                <p>
                  We couldn't find a pickle
                  matching "
                  {searchTerm}
                  ".
                </p>

                <button
                  type="button"
                  className="collection-clear-search"
                  onClick={clearSearch}
                >
                  Clear Search
                </button>
              </>
            ) : (
              <>
                <h3>
                  No products available
                </h3>

                <p>
                  Please check back soon
                  for our homemade
                  collection.
                </p>
              </>
            )}

          </div>

        ) : (

          <>

            {/* PRODUCT GRID */}

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
                  onClick={
                    handleShowMore
                  }
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
                  {searchedPickles.length}
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