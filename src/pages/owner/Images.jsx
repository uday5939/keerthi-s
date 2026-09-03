import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import "./Images.css";

function Images() {
  const [images, setImages] = useState([]);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);

  const [message, setMessage] = useState("");

  // ==================================================
  // LOAD IMAGES
  // ==================================================

  useEffect(() => {
    loadImages();
  }, []);

  async function loadImages() {
    setLoadingList(true);
    setMessage("");

    const { data, error } = await supabase
      .from("kitchen_images")
      .select("*")
      .order("display_order", {
        ascending: true,
      })
      .order("created_at", {
        ascending: true,
      });

    if (error) {
      console.error("Load images error:", error);

      setMessage("Unable to load images.");
      setLoadingList(false);

      return;
    }

    setImages(data || []);
    setLoadingList(false);
  }

  // ==================================================
  // IMAGE SELECT
  // ==================================================

  function handleImageChange(e) {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select a valid image.");
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);

    setMessage("");
  }

  // ==================================================
  // UPLOAD IMAGE TO STORAGE
  // ==================================================

  async function uploadImage(file) {
    if (!file) {
      throw new Error("Please select an image.");
    }

    setMessage("Uploading image...");

    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 10)}.${extension}`;

    const path = `gallery/${fileName}`;

    const { error } = await supabase.storage
      .from("kitchen-images")
      .upload(path, file, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("kitchen-images")
      .getPublicUrl(path);

    if (!data?.publicUrl) {
      throw new Error("Unable to generate image URL.");
    }

    return {
      url: data.publicUrl,
      path,
    };
  }

  // ==================================================
  // DELETE STORAGE FILE
  // ==================================================

  async function deleteStorageImage(imageUrl) {
    if (!imageUrl) {
      return;
    }

    try {
      const url = new URL(imageUrl);

      const marker =
        "/storage/v1/object/public/kitchen-images/";

      const index =
        url.pathname.indexOf(marker);

      if (index === -1) {
        return;
      }

      const path =
        url.pathname.substring(
          index + marker.length
        );

      if (!path) {
        return;
      }

      const { error } = await supabase.storage
        .from("kitchen-images")
        .remove([path]);

      if (error) {
        console.error(
          "Storage delete error:",
          error
        );
      }
    } catch (error) {
      console.error(
        "Unable to remove storage image:",
        error
      );
    }
  }

  // ==================================================
  // SUBMIT
  // ==================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (!imageFile) {
      setMessage("Please select an image.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const uploaded =
        await uploadImage(imageFile);

      // ==============================================
      // REPLACE EXISTING IMAGE
      // ==============================================

      if (editingId) {
        const existingImage =
          images.find(
            (image) =>
              String(image.id) ===
              String(editingId)
          );

        const { data, error } =
          await supabase
            .from("kitchen_images")
            .update({
              image_url: uploaded.url,
              updated_at:
                new Date().toISOString(),
            })
            .eq("id", editingId)
            .select()
            .single();

        if (error) {
          // Remove newly uploaded file if DB update fails
          await deleteStorageImage(
            uploaded.url
          );

          throw error;
        }

        // Remove old storage file
        if (
          existingImage?.image_url &&
          existingImage.image_url !== uploaded.url
        ) {
          await deleteStorageImage(
            existingImage.image_url
          );
        }

        setImages((current) =>
          current.map((image) =>
            String(image.id) ===
            String(editingId)
              ? data
              : image
          )
        );

        setMessage(
          "Image replaced successfully."
        );
      }

      // ==============================================
      // NEW IMAGE
      // ==============================================

      else {
        const nextDisplayOrder =
          images.length > 0
            ? Math.max(
                ...images.map(
                  (image) =>
                    Number(
                      image.display_order || 0
                    )
                )
              ) + 1
            : 1;

        const { data, error } =
          await supabase
            .from("kitchen_images")
            .insert({
              image_url: uploaded.url,
              display_order:
                nextDisplayOrder,
              is_active: true,
            })
            .select()
            .single();

        if (error) {
          // Remove uploaded file if DB insert fails
          await deleteStorageImage(
            uploaded.url
          );

          throw error;
        }

        setImages((current) => [
          ...current,
          data,
        ]);

        setMessage(
          "Image uploaded successfully."
        );
      }

      resetForm();
    } catch (error) {
      console.error(
        "Image upload error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to upload image."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // EDIT
  // ==================================================

  function editImage(image) {
    setEditingId(image.id);

    setImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview(
      image.image_url || ""
    );

    setMessage("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==================================================
  // DELETE
  // ==================================================

  async function deleteImage(id) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this image?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const imageToDelete =
        images.find(
          (image) =>
            String(image.id) ===
            String(id)
        );

      if (!imageToDelete) {
        throw new Error(
          "Image not found."
        );
      }

      const { error } =
        await supabase
          .from("kitchen_images")
          .delete()
          .eq("id", id);

      if (error) {
        throw error;
      }

      // Delete actual file from Storage
      await deleteStorageImage(
        imageToDelete.image_url
      );

      setImages((current) =>
        current.filter(
          (image) =>
            String(image.id) !==
            String(id)
        )
      );

      setMessage(
        "Image deleted successfully."
      );

      if (
        String(editingId) ===
        String(id)
      ) {
        resetForm();
      }
    } catch (error) {
      console.error(
        "Delete image error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to delete image."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // SHOW / HIDE
  // ==================================================

  async function toggleImage(image) {
    try {
      setLoading(true);
      setMessage("");

      const newStatus =
        !image.is_active;

      const { data, error } =
        await supabase
          .from("kitchen_images")
          .update({
            is_active: newStatus,
            updated_at:
              new Date().toISOString(),
          })
          .eq("id", image.id)
          .select()
          .single();

      if (error) {
        throw error;
      }

      setImages((current) =>
        current.map((item) =>
          String(item.id) ===
          String(image.id)
            ? data
            : item
        )
      );

      setMessage(
        newStatus
          ? "Image is now visible."
          : "Image hidden successfully."
      );
    } catch (error) {
      console.error(
        "Toggle image error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to update image."
      );
    } finally {
      setLoading(false);
    }
  }

  // ==================================================
  // RESET
  // ==================================================

  function resetForm() {
    setEditingId(null);
    setImageFile(null);

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setImagePreview("");

    const input =
      document.getElementById(
        "kitchen-image"
      );

    if (input) {
      input.value = "";
    }
  }

  // ==================================================
  // CLEAN PREVIEW URL
  // ==================================================

  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="image-page">
      <div className="image-container">

        {/* HEADER */}

        <div className="image-header">
          <span>VISUAL COLLECTION</span>

          <div className="image-gold-line"></div>

          <h1>Our Kitchen</h1>

          <p>
            Share beautiful moments from
            your kitchen and the making of
            Keerthi's homemade pickles.
          </p>
        </div>

        {/* UPLOAD CARD */}

        <div className="image-upload-card">

          <div className="image-section-heading">
            <span>
              {editingId
                ? "REPLACE IMAGE"
                : "NEW IMAGE"}
            </span>

            <h2>
              {editingId
                ? "Choose another image"
                : "Upload an image"}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>

            <label
              htmlFor="kitchen-image"
              className="image-dropzone"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                />
              ) : (
                <>
                  <div className="image-plus">
                    +
                  </div>

                  <strong>
                    Choose image
                  </strong>

                  <span>
                    JPG, PNG, WEBP or GIF
                  </span>
                </>
              )}
            </label>

            <input
              id="kitchen-image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              hidden
            />

            <div className="image-form-actions">

              <button
                type="submit"
                className="image-gold-button"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : editingId
                  ? "Replace Image"
                  : "Upload Image"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="image-cancel-button"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
              )}

            </div>
          </form>

          {message && (
            <div className="image-message">
              {message}
            </div>
          )}
        </div>

        {/* COLLECTION */}

        <div className="image-list-section">

          <div className="image-list-heading">

            <div>
              <span>
                YOUR COLLECTION
              </span>

              <h2>
                Uploaded Images
              </h2>
            </div>

            <span>
              {images.length}{" "}
              {images.length === 1
                ? "image"
                : "images"}
            </span>

          </div>

          {loadingList ? (
            <div className="image-empty">
              Loading images...
            </div>
          ) : images.length === 0 ? (
            <div className="image-empty">
              No images uploaded yet.
            </div>
          ) : (
            <div className="image-grid">

              {images.map((image) => (
                <div
                  className="image-card"
                  key={image.id}
                >

                  <div className="image-preview">
                    <img
                      src={image.image_url}
                      alt="Kitchen"
                    />
                  </div>

                  <div className="image-card-footer">

                    <span
                      className={
                        image.is_active
                          ? "image-active"
                          : "image-hidden"
                      }
                    >
                      {image.is_active
                        ? "VISIBLE"
                        : "HIDDEN"}
                    </span>

                    <div className="image-card-actions">

                      <button
                        type="button"
                        onClick={() =>
                          toggleImage(image)
                        }
                        disabled={loading}
                      >
                        {image.is_active
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          editImage(image)
                        }
                        disabled={loading}
                      >
                        Replace
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteImage(image.id)
                        }
                        disabled={loading}
                      >
                        Delete
                      </button>

                    </div>
                  </div>
                </div>
              ))}

            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Images;