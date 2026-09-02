import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import "./PickleList.css";

function PickleList({
  isOpen,
  items,
  allPickles,
  customer,
  onCustomerChange,
  onIncrease,
  onDecrease,
  onRemove,
  onAddToList,
  onSendWhatsApp,
  onPreferToCall,
  onClose,
}) {
  // ==================================================
  // SELECTED PRODUCT
  // ==================================================

  const [selectedPickleId, setSelectedPickleId] =
    useState("");

  // ==================================================
  // SELECTED PORTION
  // ==================================================

  const [selectedPortion, setSelectedPortion] =
    useState("");

  // ==================================================
  // SELECTED PRODUCT OBJECT
  // ==================================================

  const selectedPickle =
    allPickles?.find(
      (pickle) =>
        String(pickle.id) ===
        String(selectedPickleId)
    ) || null;

  // ==================================================
  // BUILD PORTIONS DIRECTLY FROM PICKLES TABLE
  //
  // available_units:
  // ["100g", "250g", "500g", "1kg"]
  //
  // prices:
  // price_100g
  // price_250g
  // price_500g
  // price_1kg
  // ==================================================

  const availablePortions = useMemo(() => {
    if (!selectedPickle) {
      return [];
    }

    const units = Array.isArray(
      selectedPickle.available_units
    )
      ? selectedPickle.available_units
      : [];

    const priceMap = {
      "100g": selectedPickle.price_100g,
      "250g": selectedPickle.price_250g,
      "500g": selectedPickle.price_500g,
      "750g": selectedPickle.price_750g,
      "1kg": selectedPickle.price_1kg,
      "1.5kg": selectedPickle["price_1.5kg"],
      "2kg": selectedPickle.price_2kg,
      "5kg": selectedPickle.price_5kg,
    };

    return units
      .map((unit) => {
        const cleanUnit =
          String(unit)
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");

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
      .filter(
        (portion) =>
          portion &&
          Number.isFinite(
            portion.price
          )
      );
  }, [selectedPickle]);

  // ==================================================
  // SELECTED PORTION DATA
  // ==================================================

  const selectedPortionData =
    availablePortions.find(
      (portion) =>
        portion.portion ===
        selectedPortion
    ) || null;

  // ==================================================
  // RESET PORTION WHEN PRODUCT CHANGES
  // ==================================================

  useEffect(() => {
    setSelectedPortion("");
  }, [selectedPickleId]);

  // ==================================================
  // CLOSE ON ESCAPE
  // ==================================================

  useEffect(() => {
    function handleEscape(event) {
      if (
        event.key === "Escape" &&
        isOpen
      ) {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, [
    isOpen,
    onClose,
  ]);

  // ==================================================
  // ADD ANOTHER PICKLE
  // ==================================================

  function handleAddAnother() {
    if (!selectedPickle) {
      alert(
        "Please select a pickle."
      );

      return;
    }

    if (!selectedPortionData) {
      alert(
        "Please select a portion."
      );

      return;
    }

    onAddToList(
      selectedPickle,
      selectedPortionData
    );

    // Reset selection
    setSelectedPickleId("");
    setSelectedPortion("");
  }

  // ==================================================
  // TOTAL
  // ==================================================

  const total =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.price || 0
        ) *
          Number(
            item.quantity || 0
          ),
      0
    );

  // ==================================================
  // TOTAL QUANTITY
  // ==================================================

  const totalItems =
    items.reduce(
      (sum, item) =>
        sum +
        Number(
          item.quantity || 0
        ),
      0
    );

  // ==================================================
  // DON'T RENDER WHEN CLOSED
  // ==================================================

  if (!isOpen) {
    return null;
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="order-overlay">

      {/* ============================================
          BACKDROP
          ============================================ */}

      <button
        type="button"
        className="order-backdrop"
        onClick={onClose}
        aria-label="Close order"
      />

      {/* ============================================
          ORDER PANEL
          ============================================ */}

      <aside className="order-panel">

        {/* ==========================================
            HEADER
            ========================================== */}

        <div className="order-header">

          <div>

            <span className="order-eyebrow">
              YOUR ORDER
            </span>

            <h2>
              Your Pickle List
            </h2>

            <p>
              Review your selection before
              placing your order.
            </p>

          </div>

          <button
            type="button"
            className="order-close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

        </div>

        {/* ==========================================
            BODY
            ========================================== */}

        <div className="order-body">

          {/* ========================================
              EMPTY ORDER
              ======================================== */}

          {items.length === 0 ? (

            <div className="order-empty">

              <div className="order-empty-icon">
                ✦
              </div>

              <h3>
                Your list is empty
              </h3>

              <p>
                Select a pickle and portion
                to add it to your order.
              </p>

            </div>

          ) : (

            /* ======================================
               SELECTED ITEMS
               ====================================== */

            <div className="order-items">

              <div className="order-items-heading">

                <span>
                  SELECTED ITEMS
                </span>

                <span>
                  {totalItems}{" "}
                  {totalItems === 1
                    ? "item"
                    : "items"}
                </span>

              </div>

              {items.map(
                (item) => {

                  const itemTotal =
                    Number(
                      item.price || 0
                    ) *
                    Number(
                      item.quantity || 0
                    );

                  return (
                    <div
                      className="order-item"
                      key={item.id}
                    >

                      {/* IMAGE */}

                      <div className="order-item-image">

                        {item.image_url ? (

                          <img
                            src={
                              item.image_url
                            }
                            alt={
                              item.name
                            }
                          />

                        ) : (

                          <span>
                            KP
                          </span>

                        )}

                      </div>

                      {/* DETAILS */}

                      <div className="order-item-details">

                        <h3>
                          {item.name}
                        </h3>

                        <span className="order-item-portion">
                          {item.unit}
                        </span>

                        <div className="order-item-price">
                          ₹
                          {Number(
                            item.price ||
                              0
                          ).toFixed(0)}
                        </div>

                        {/* QUANTITY */}

                        <div className="order-quantity">

                          <button
                            type="button"
                            onClick={() =>
                              onDecrease(
                                item.id
                              )
                            }
                          >
                            −
                          </button>

                          <span>
                            {
                              item.quantity
                            }
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              onIncrease(
                                item.id
                              )
                            }
                          >
                            +
                          </button>

                        </div>

                      </div>

                      {/* RIGHT */}

                      <div className="order-item-right">

                        <strong>
                          ₹
                          {itemTotal.toFixed(
                            0
                          )}
                        </strong>

                        <button
                          type="button"
                          className="order-remove"
                          onClick={() =>
                            onRemove(
                              item.id
                            )
                          }
                        >
                          Remove
                        </button>

                      </div>

                    </div>
                  );
                }
              )}

            </div>
          )}

          {/* ========================================
              ADD ANOTHER PICKLE
              ======================================== */}

          <div className="add-another-section">

            <div className="order-section-label">
              ADD ANOTHER PICKLE
            </div>

            <div className="add-product-box">

              {/* ==================================
                  PICKLE SELECT
                  ================================== */}

              <div className="order-field">

                <label>
                  Pickle
                </label>

                <select
                  value={
                    selectedPickleId
                  }
                  onChange={(event) => {
                    setSelectedPickleId(
                      event.target.value
                    );

                    setSelectedPortion(
                      ""
                    );
                  }}
                >

                  <option value="">
                    Select a pickle
                  </option>

                  {allPickles?.map(
                    (pickle) => (
                      <option
                        key={
                          pickle.id
                        }
                        value={
                          pickle.id
                        }
                      >
                        {
                          pickle.name
                        }
                      </option>
                    )
                  )}

                </select>

              </div>

              {/* ==================================
                  PORTION SELECT
                  ================================== */}

              {selectedPickle && (

                <div className="order-field">

                  <label>
                    Portion
                  </label>

                  <select
                    value={
                      selectedPortion
                    }
                    onChange={(event) =>
                      setSelectedPortion(
                        event.target.value
                      )
                    }
                  >

                    <option value="">
                      Select portion
                    </option>

                    {availablePortions.map(
                      (portion) => (

                        <option
                          key={
                            portion.portion
                          }
                          value={
                            portion.portion
                          }
                        >
                          {
                            portion.portion
                          }
                          {" — ₹"}
                          {Number(
                            portion.price
                          ).toFixed(0)}
                        </option>

                      )
                    )}

                  </select>

                </div>

              )}

              {/* ==================================
                  SELECTED PRICE
                  ================================== */}

              {selectedPortionData && (

                <div className="selected-portion-price">

                  <span>
                    Price
                  </span>

                  <strong>
                    ₹
                    {Number(
                      selectedPortionData.price
                    ).toFixed(0)}
                  </strong>

                </div>

              )}

              {/* ==================================
                  ADD BUTTON
                  ================================== */}

              <button
                type="button"
                className="add-product-button"
                onClick={
                  handleAddAnother
                }
              >
                Add to List
                <span>
                  +
                </span>
              </button>

            </div>

          </div>

          {/* ========================================
              CUSTOMER DETAILS
              ======================================== */}

          <div className="customer-section">

            <div className="order-section-label">
              TELL US ABOUT YOU
            </div>

            <p className="customer-intro">
              Please provide your details so
              we can confirm your order and
              delivery.
            </p>

            {/* NAME */}

            <div className="order-field">

              <label>
                Name *
              </label>

              <input
                type="text"
                value={
                  customer.name
                }
                onChange={(event) =>
                  onCustomerChange(
                    "name",
                    event.target.value
                  )
                }
                placeholder="Your name"
              />

            </div>

            {/* PHONE */}

            <div className="order-field">

              <label>
                Phone *
              </label>

              <input
                type="tel"
                value={
                  customer.phone
                }
                onChange={(event) =>
                  onCustomerChange(
                    "phone",
                    event.target.value
                  )
                }
                placeholder="Your phone number"
              />

            </div>

            {/* ADDRESS */}

            <div className="order-field">

              <label>
                Delivery Address *
              </label>

              <textarea
                value={
                  customer.address
                }
                onChange={(event) =>
                  onCustomerChange(
                    "address",
                    event.target.value
                  )
                }
                placeholder="Enter your complete delivery address"
                rows="3"
              />

            </div>

          </div>

        </div>

        {/* ==========================================
            FOOTER
            ========================================== */}

        <div className="order-footer">

          <div className="order-total">

            <span>
              Estimated Total
            </span>

            <strong>
              ₹
              {total.toFixed(0)}
            </strong>

          </div>

          {/* WHATSAPP */}

          <button
            type="button"
            className="whatsapp-order-button"
            onClick={
              onSendWhatsApp
            }
          >
            <span>
              Order Through WhatsApp
            </span>

            <span>
              →
            </span>

          </button>

          {/* CALL */}

          <button
            type="button"
            className="call-order-button"
            onClick={
              onPreferToCall
            }
          >
            Prefer to Call
          </button>

          <p className="order-footer-note">
            Your order is sent directly to
            Keerthi's Pickles for confirmation.
          </p>

        </div>

      </aside>

    </div>
  );
}

export default PickleList;