import React, { useMemo, useState } from "react";

import "./PickleCard.css";

function PickleCard({
  pickle,
  onOrder,
}) {
  // ==================================================
  // GET PORTIONS DIRECTLY FROM PICKLES TABLE
  // ==================================================

  const portions = useMemo(() => {
    if (!pickle) {
      return [];
    }

    const units = Array.isArray(
      pickle.available_units
    )
      ? pickle.available_units
      : [];

    const priceMap = {
      "100g": pickle.price_100g,
      "250g": pickle.price_250g,
      "500g": pickle.price_500g,
      "750g": pickle.price_750g,
      "1kg": pickle.price_1kg,
      "1.5kg": pickle["price_1.5kg"],
      "2kg": pickle.price_2kg,
      "5kg": pickle.price_5kg,
    };

    return units
      .map((unit) => {
        const cleanUnit =
          String(unit).trim();

        const price =
          priceMap[cleanUnit];

        if (
          price === null ||
          price === undefined ||
          price === ""
        ) {
          return null;
        }

        return {
          portion: cleanUnit,
          price: Number(price),
        };
      })
      .filter(Boolean);
  }, [pickle]);

  // ==================================================
  // SELECTED PORTION
  // ==================================================

  const [
    selectedPortion,
    setSelectedPortion,
  ] = useState(
    portions[0] || null
  );

  // ==================================================
  // IF DATA CHANGES
  // ==================================================

  React.useEffect(() => {
    setSelectedPortion(
      portions[0] || null
    );
  }, [
    pickle?.id,
    portions,
  ]);

  // ==================================================
  // CHANGE PORTION
  // ==================================================

  function handlePortionChange(
    event
  ) {
    const selectedUnit =
      event.target.value;

    const found =
      portions.find(
        (item) =>
          item.portion ===
          selectedUnit
      );

    setSelectedPortion(
      found || null
    );
  }

  // ==================================================
  // ORDER NOW
  // ==================================================

  function handleOrder() {
    if (!selectedPortion) {
      alert(
        "Please select a portion first."
      );

      return;
    }

    onOrder(
      pickle,
      selectedPortion
    );
  }

  // ==================================================
  // CARD
  // ==================================================

  return (
    <article className="pickle-card">

      {/* ============================================
          IMAGE
          ============================================ */}

      <div className="pickle-image-wrap">

        <div className="pickle-image-inner">

          {pickle?.image_url ? (
            <img
              src={pickle.image_url}
              alt={pickle.name}
              className="pickle-image"
            />
          ) : (
            <div className="pickle-image-placeholder">
              KP
            </div>
          )}

          {pickle?.category && (
            <span className="pickle-category">
              {pickle.category}
            </span>
          )}

        </div>

      </div>

      {/* ============================================
          CONTENT
          ============================================ */}

      <div className="pickle-card-content">

        <h3 className="pickle-name">
          {pickle?.name}
        </h3>

        {pickle?.description && (
          <p className="pickle-description">
            {pickle.description}
          </p>
        )}

        {/* ==========================================
            PORTION + PRICE
            ========================================== */}

        {portions.length > 0 ? (
          <div className="pickle-selection-row">

            <select
              className="pickle-portion-select"
              value={
                selectedPortion?.portion ||
                ""
              }
              onChange={
                handlePortionChange
              }
            >
              {portions.map(
                (item) => (
                  <option
                    key={item.portion}
                    value={
                      item.portion
                    }
                  >
                    {item.portion}
                  </option>
                )
              )}
            </select>

            <span className="pickle-selected-price">
              ₹
              {Number(
                selectedPortion?.price ||
                  0
              ).toFixed(0)}
            </span>

          </div>
        ) : (
          <div className="pickle-no-portions">
            Portions unavailable
          </div>
        )}

        {/* ==========================================
            ORDER BUTTON
            ========================================== */}

        <button
          type="button"
          className="pickle-order-button"
          onClick={handleOrder}
          disabled={
            portions.length === 0
          }
        >
          Order Now
          <span>→</span>
        </button>

      </div>

    </article>
  );
}

export default PickleCard;