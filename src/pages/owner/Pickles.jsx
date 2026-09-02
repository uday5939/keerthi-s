import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";

import "./Pickles.css";

const portionOptions = [
  "100g",
  "250g",
  "500g",
  "750g",
  "1kg",
  "1.5kg",
  "2kg",
  "5kg",
];

const emptyForm = {
  name: "",
  category: "",
  description: "",
  price: "",
  available_units: [],
  image_url: "",
  is_active: true,

  price_100g: "",
  price_250g: "",
  price_500g: "",
  price_750g: "",
  price_1kg: "",
  price_1_5kg: "",
  price_2kg: "",
  price_5kg: "",
};

function Pickles() {
  const [pickles, setPickles] = useState([]);

  const [form, setForm] = useState(emptyForm);

  const [imageFile, setImageFile] = useState(null);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    loadPickles();
  }, []);

  async function loadPickles() {
    setFetching(true);

    const { data, error } = await supabase
      .from("pickles")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);

      alert("Unable to load pickles.");
    } else {
      setPickles(data || []);
    }

    setFetching(false);
  }

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  }

  function getPriceColumn(portion) {
    const priceColumns = {
      "100g": "price_100g",
      "250g": "price_250g",
      "500g": "price_500g",
      "750g": "price_750g",
      "1kg": "price_1kg",
      "1.5kg": "price_1_5kg",
      "2kg": "price_2kg",
      "5kg": "price_5kg",
    };

    return priceColumns[portion];
  }

  function handlePortionChange(portion) {
    setForm((current) => {
      const exists =
        current.available_units.includes(
          portion
        );

      return {
        ...current,

        available_units: exists
          ? current.available_units.filter(
              (item) => item !== portion
            )
          : [
              ...current.available_units,
              portion,
            ],
      };
    });
  }

  function handlePriceChange(portion, value) {
    const column = getPriceColumn(portion);

    if (!column) return;

    setForm((current) => ({
      ...current,
      [column]: value,
    }));
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    setImageFile(file);
  }

  async function uploadImage() {
    if (!imageFile) {
      return form.image_url || null;
    }

    const extension =
      imageFile.name
        .split(".")
        .pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

    const filePath =
      `pickles/${fileName}`;

    const { error } =
      await supabase.storage
        .from("pickle-images")
        .upload(
          filePath,
          imageFile,
          {
            upsert: false,
          }
        );

    if (error) {
      console.error(error);

      throw new Error(
        "Unable to upload image."
      );
    }

    const {
      data,
    } = supabase.storage
      .from("pickle-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  function validatePortionPrices() {
    for (
      const portion of form.available_units
    ) {
      const column =
        getPriceColumn(portion);

      const price = form[column];

      if (
        price === "" ||
        price === null ||
        price === undefined ||
        Number(price) <= 0
      ) {
        alert(
          `Please enter a valid price for ${portion}.`
        );

        return false;
      }
    }

    return true;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      alert(
        "Please enter pickle name."
      );

      return;
    }

    if (!form.category) {
      alert(
        "Please select a category."
      );

      return;
    }

    if (
      form.available_units.length === 0
    ) {
      alert(
        "Please select at least one available portion."
      );

      return;
    }

    if (!validatePortionPrices()) {
      return;
    }

    setLoading(true);

    try {
      const imageUrl =
        await uploadImage();

      /*
       * The old price column is kept for
       * compatibility with the existing table.
       *
       * We use the first selected portion's
       * price as the main/default price.
       */
      const firstPortion =
        form.available_units[0];

      const firstPriceColumn =
        getPriceColumn(firstPortion);

      const mainPrice =
        Number(
          form[firstPriceColumn]
        );

      const payload = {
        name: form.name.trim(),

        category: form.category,

        description:
          form.description.trim(),

        price: mainPrice,

        unit: firstPortion,

        available_units:
          form.available_units,

        price_100g:
          form.price_100g === ""
            ? null
            : Number(form.price_100g),

        price_250g:
          form.price_250g === ""
            ? null
            : Number(form.price_250g),

        price_500g:
          form.price_500g === ""
            ? null
            : Number(form.price_500g),

        price_750g:
          form.price_750g === ""
            ? null
            : Number(form.price_750g),

        price_1kg:
          form.price_1kg === ""
            ? null
            : Number(form.price_1kg),

        price_1_5kg:
          form.price_1_5kg === ""
            ? null
            : Number(form.price_1_5kg),

        price_2kg:
          form.price_2kg === ""
            ? null
            : Number(form.price_2kg),

        price_5kg:
          form.price_5kg === ""
            ? null
            : Number(form.price_5kg),

        image_url: imageUrl,

        is_active:
          form.is_active,
      };

      let error;

      if (editingId) {
        const response =
          await supabase
            .from("pickles")
            .update(payload)
            .eq(
              "id",
              editingId
            );

        error =
          response.error;
      } else {
        const response =
          await supabase
            .from("pickles")
            .insert([
              payload,
            ]);

        error =
          response.error;
      }

      if (error) {
        console.error(error);

        alert(
          `Unable to save pickle: ${error.message}`
        );

        return;
      }

      alert(
        editingId
          ? "Pickle updated successfully."
          : "Pickle added successfully."
      );

      resetForm();

      await loadPickles();

    } catch (error) {
      console.error(error);

      alert(
        error.message ||
          "Something went wrong."
      );

    } finally {
      setLoading(false);
    }
  }

  function startEdit(pickle) {
    setEditingId(
      pickle.id
    );

    setForm({
      name:
        pickle.name || "",

      category:
        pickle.category || "",

      description:
        pickle.description || "",

      price:
        pickle.price ?? "",

      available_units:
        pickle.available_units?.length
          ? pickle.available_units
          : pickle.unit
          ? [pickle.unit]
          : [],

      image_url:
        pickle.image_url || "",

      is_active:
        pickle.is_active !== false,

      price_100g:
        pickle.price_100g ?? "",

      price_250g:
        pickle.price_250g ?? "",

      price_500g:
        pickle.price_500g ?? "",

      price_750g:
        pickle.price_750g ?? "",

      price_1kg:
        pickle.price_1kg ?? "",

      price_1_5kg:
        pickle.price_1_5kg ?? "",

      price_2kg:
        pickle.price_2kg ?? "",

      price_5kg:
        pickle.price_5kg ?? "",
    });

    setImageFile(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function resetForm() {
    setForm({
      ...emptyForm,
    });

    setImageFile(null);

    setEditingId(null);
  }

  async function deletePickle(id) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this pickle?"
      );

    if (!confirmed) {
      return;
    }

    const { error } =
      await supabase
        .from("pickles")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(error);

      alert(
        "Unable to delete pickle."
      );

      return;
    }

    await loadPickles();
  }

  async function toggleActive(pickle) {
    const { error } =
      await supabase
        .from("pickles")
        .update({
          is_active:
            !pickle.is_active,
        })
        .eq(
          "id",
          pickle.id
        );

    if (error) {
      console.error(error);

      alert(
        "Unable to update status."
      );

      return;
    }

    await loadPickles();
  }

  function renderPriceInput(portion) {
    const column =
      getPriceColumn(portion);

    return (
      <div
        className="portion-price-row"
        key={portion}
      >
        <div className="portion-name">
          {portion}
        </div>

        <div className="portion-price-input">
          <span>₹</span>

          <input
            type="number"
            min="0"
            step="0.01"
            value={form[column]}
            onChange={(event) =>
              handlePriceChange(
                portion,
                event.target.value
              )
            }
            placeholder="Enter price"
          />
        </div>
      </div>
    );
  }

  function getAvailableUnits(pickle) {
    if (
      Array.isArray(
        pickle.available_units
      )
    ) {
      return pickle.available_units;
    }

    if (
      pickle.unit
    ) {
      return [pickle.unit];
    }

    return [];
  }

  function getPortionPrice(pickle, portion) {
    const column =
      getPriceColumn(portion);

    if (!column) return null;

    return pickle[column];
  }

  return (
    <div className="owner-page">

      <div className="owner-page-header">

        <div>
          <span>
            OWNER PANEL
          </span>

          <h1>
            Pickles
          </h1>

          <p>
            Manage your homemade
            pickle collection.
          </p>
        </div>

      </div>

      <div className="pickle-management">

        {/* =====================================
            FORM
        ===================================== */}

        <section className="pickle-form-card">

          <div className="form-heading">

            <span>
              {editingId
                ? "EDIT PICKLE"
                : "ADD NEW PICKLE"}
            </span>

            <h2>
              {editingId
                ? "Update Pickle"
                : "Create Pickle"}
            </h2>

          </div>

          <form
            onSubmit={handleSubmit}
          >

            {/* NAME */}

            <div className="form-group">

              <label>
                Pickle Name
              </label>

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={
                  handleChange
                }
                placeholder="Mango Pickle"
              />

            </div>

            {/* CATEGORY */}

            <div className="form-group">

              <label>
                Category
              </label>

              <select
                name="category"
                value={
                  form.category
                }
                onChange={
                  handleChange
                }
              >


                <option value="All">
                  All
                </option>

                <option value="Veg Pickles">
                  Veg Pickles
                </option>

                <option value="Non-Veg Pickles">
                  Non-Veg Pickles
                </option>

                <option value="Snacks">
                  Snacks
                </option>

              </select>

            </div>

            {/* DESCRIPTION */}

            <div className="form-group">

              <label>
                Description
              </label>

              <textarea
                name="description"
                value={
                  form.description
                }
                onChange={
                  handleChange
                }
                rows="4"
                placeholder="Traditional homemade mango pickle..."
              />

            </div>

            {/* PORTIONS */}

            <div className="form-group">

              <label>
                Available Portions
              </label>

              <p className="portion-description">
                Select the portions customers
                can choose from, then enter
                the price for each portion.
              </p>

              <div className="portion-grid">

                {portionOptions.map(
                  (portion) => {

                    const selected =
                      form.available_units.includes(
                        portion
                      );

                    return (
                      <button
                        type="button"
                        key={portion}
                        className={
                          selected
                            ? "portion-option selected"
                            : "portion-option"
                        }
                        onClick={() =>
                          handlePortionChange(
                            portion
                          )
                        }
                      >

                        <span>
                          {selected
                            ? "✓"
                            : "+"}
                        </span>

                        {portion}

                      </button>
                    );
                  }
                )}

              </div>

            </div>

            {/* PORTION PRICES */}

            {form.available_units.length >
              0 && (

              <div className="form-group">

                <label>
                  Portion Prices
                </label>

                <div className="portion-price-list">

                  {form.available_units.map(
                    (portion) =>
                      renderPriceInput(
                        portion
                      )
                  )}

                </div>

              </div>
            )}

            {/* IMAGE */}

            <div className="form-group">

              <label>
                Pickle Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleImageChange
                }
              />

              {imageFile && (
                <small className="selected-file">
                  Selected:{" "}
                  {imageFile.name}
                </small>
              )}

              {form.image_url &&
                !imageFile && (

                <div className="existing-image">

                  <img
                    src={
                      form.image_url
                    }
                    alt="Current pickle"
                  />

                  <span>
                    Current image
                  </span>

                </div>
              )}

            </div>

            {/* ACTIVE */}

            <label className="active-checkbox">

              <input
                type="checkbox"
                name="is_active"
                checked={
                  form.is_active
                }
                onChange={
                  handleChange
                }
              />

              <span>
                Show this pickle on website
              </span>

            </label>

            {/* ACTIONS */}

            <div className="form-actions">

              <button
                type="submit"
                disabled={loading}
                className="save-pickle-button"
              >

                {loading
                  ? "Saving..."
                  : editingId
                  ? "Update Pickle"
                  : "Add Pickle"}

              </button>

              {editingId && (

                <button
                  type="button"
                  className="cancel-pickle-button"
                  onClick={
                    resetForm
                  }
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </section>

        {/* =====================================
            LIST
        ===================================== */}

        <section className="pickle-list-card">

          <div className="form-heading">

            <span>
              COLLECTION
            </span>

            <h2>
              Your Pickles
            </h2>

          </div>

          {fetching ? (

            <div className="pickle-empty">
              Loading pickles...
            </div>

          ) : pickles.length === 0 ? (

            <div className="pickle-empty">
              No pickles added yet.
            </div>

          ) : (

            <div className="owner-pickle-list">

              {pickles.map(
                (pickle) => {

                  const units =
                    getAvailableUnits(
                      pickle
                    );

                  return (

                    <article
                      className="owner-pickle-item"
                      key={pickle.id}
                    >

                      {/* IMAGE */}

                      <div className="owner-pickle-image">

                        {pickle.image_url ? (

                          <img
                            src={
                              pickle.image_url
                            }
                            alt={
                              pickle.name
                            }
                          />

                        ) : (

                          <span>
                            KP
                          </span>

                        )}

                      </div>

                      {/* INFO */}

                      <div className="owner-pickle-info">

                        <div className="owner-pickle-title">

                          <h3>
                            {pickle.name}
                          </h3>

                          <span
                            className={
                              pickle.is_active
                                ? "status-active"
                                : "status-hidden"
                            }
                          >
                            {pickle.is_active
                              ? "Active"
                              : "Hidden"}
                          </span>

                        </div>

                        <small>
                          {
                            pickle.category
                          }
                        </small>

                        {pickle.description && (
                          <p>
                            {
                              pickle.description
                            }
                          </p>
                        )}

                        <div className="owner-portions">

                          <span>
                            Available Portions
                          </span>

                          <div>

                            {units.map(
                              (unit) => {

                                const price =
                                  getPortionPrice(
                                    pickle,
                                    unit
                                  );

                                return (
                                  <b
                                    key={unit}
                                  >
                                    {unit}

                                    {price !==
                                      null &&
                                      price !==
                                        undefined && (
                                        <>
                                          {" "}
                                          · ₹
                                          {Number(
                                            price
                                          ).toFixed(
                                            2
                                          )}
                                        </>
                                      )}
                                  </b>
                                );
                              }
                            )}

                          </div>

                        </div>

                        <strong className="owner-pickle-price">

                          From ₹
                          {units.length > 0
                            ? Number(
                                getPortionPrice(
                                  pickle,
                                  units[0]
                                ) ||
                                  pickle.price ||
                                  0
                              ).toFixed(2)
                            : Number(
                                pickle.price ||
                                  0
                              ).toFixed(2)}

                        </strong>

                      </div>

                      {/* ACTIONS */}

                      <div className="owner-pickle-actions">

                        <button
                          type="button"
                          onClick={() =>
                            startEdit(
                              pickle
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            toggleActive(
                              pickle
                            )
                          }
                        >
                          {pickle.is_active
                            ? "Hide"
                            : "Show"}
                        </button>

                        <button
                          type="button"
                          className="delete-button"
                          onClick={() =>
                            deletePickle(
                              pickle.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </article>
                  );
                }
              )}

            </div>

          )}

        </section>

      </div>

    </div>
  );
}

export default Pickles;