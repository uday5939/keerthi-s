import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import "./BusinessDetails.css";

function BusinessDetails() {
  const [form, setForm] = useState({
    business_name: "",
    tagline: "",
    description: "",
    phone: "",
    whatsapp: "",
    email: "",
    address: "",
    city: "",
    instagram_url: "",
    facebook_url: "",
    logo_url: "",
  });

  const [logoFile, setLogoFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBusiness();
  }, []);

  // ==================================================
  // LOAD BUSINESS DETAILS
  // ==================================================

  async function loadBusiness() {
    const { data, error } = await supabase
      .from("business_details")
      .select("*")
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      setMessage("Unable to load business details.");
      setLoading(false);
      return;
    }

    if (data) {
      setForm({
        business_name: data.business_name || "",
        tagline: data.tagline || "",
        description: data.description || "",
        phone: data.phone || "",
        whatsapp: data.whatsapp || "",
        email: data.email || "",
        address: data.address || "",
        city: data.city || "",
        instagram_url: data.instagram_url || "",
        facebook_url: data.facebook_url || "",
        logo_url: data.logo_url || "",
      });
    }

    setLoading(false);
  }

  // ==================================================
  // HANDLE TEXT CHANGE
  // ==================================================

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // ==================================================
  // UPLOAD LOGO
  // ==================================================

  async function uploadLogo(file) {
    if (!file) {
      return null;
    }

    const extension = file.name.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

    const { error } = await supabase.storage
      .from("business-images")
      .upload(fileName, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("business-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // ==================================================
  // SAVE BUSINESS DETAILS
  // ==================================================

  async function handleSave(e) {
    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {
      let logoUrl = form.logo_url;

      // Upload new logo if selected
      if (logoFile) {
        logoUrl = await uploadLogo(logoFile);
      }

      const payload = {
        business_name: form.business_name,
        tagline: form.tagline,
        description: form.description,
        phone: form.phone,
        whatsapp: form.whatsapp,
        email: form.email,
        address: form.address,
        city: form.city,
        instagram_url: form.instagram_url,
        facebook_url: form.facebook_url,
        logo_url: logoUrl,
        updated_at: new Date().toISOString(),
      };

      // ==================================================
      // CHECK EXISTING BUSINESS RECORD
      // ==================================================

      const { data: existing, error: existingError } =
        await supabase
          .from("business_details")
          .select("id")
          .limit(1)
          .maybeSingle();

      if (existingError) {
        throw existingError;
      }

      // ==================================================
      // UPDATE EXISTING
      // ==================================================

      if (existing) {
        const { error } = await supabase
          .from("business_details")
          .update(payload)
          .eq("id", existing.id);

        if (error) {
          throw error;
        }
      }

      // ==================================================
      // INSERT NEW
      // ==================================================

      else {
        const { error } = await supabase
          .from("business_details")
          .insert(payload);

        if (error) {
          throw error;
        }
      }

      // ==================================================
      // UPDATE LOCAL FORM
      // ==================================================

      setForm({
        ...form,
        logo_url: logoUrl,
      });

      setLogoFile(null);

      // Clear file input
      const input =
        document.getElementById("business-logo");

      if (input) {
        input.value = "";
      }

      setMessage(
        "Business details saved successfully."
      );
    } catch (error) {
      console.error(error);

      setMessage(
        error.message ||
          "Unable to save business details."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==================================================
  // LOADING
  // ==================================================

  if (loading) {
    return (
      <div className="owner-page">
        <h1>Business Details</h1>
        <p>Loading...</p>
      </div>
    );
  }

  // ==================================================
  // PAGE
  // ==================================================

  return (
    <div className="owner-page">

      {/* ==========================================
          HEADER
          ========================================== */}

      <div className="owner-page-header">
        <div>
          <span>OWNER PANEL</span>

          <h1>
            Business Details
          </h1>

          <p>
            Manage the information displayed
            on your public website.
          </p>
        </div>
      </div>

      {/* ==========================================
          FORM
          ========================================== */}

      <form
        className="business-form"
        onSubmit={handleSave}
      >

        {/* ========================================
            BASIC INFORMATION
            ======================================== */}

        <section className="form-section">

          <h2>
            Basic Information
          </h2>

          <div className="form-grid">

            {/* BUSINESS NAME */}

            <div className="form-group">

              <label>
                Business Name
              </label>

              <input
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                placeholder="Keerthi's Pickles"
                required
              />

            </div>

            {/* TAGLINE */}

            <div className="form-group">

              <label>
                Tagline
              </label>

              <input
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Homemade with love"
              />

            </div>

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Tell customers about your homemade pickles..."
            />

          </div>

        </section>

        {/* ========================================
            CONTACT INFORMATION
            ======================================== */}

        <section className="form-section">

          <h2>
            Contact Information
          </h2>

          <div className="form-grid">

            {/* PHONE */}

            <div className="form-group">

              <label>
                Phone
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />

            </div>

            {/* WHATSAPP */}

            <div className="form-group">

              <label>
                WhatsApp
              </label>

              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="919876543210"
              />

            </div>

            {/* EMAIL */}

            <div className="form-group">

              <label>
                Email
              </label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />

            </div>

            {/* CITY */}

            <div className="form-group">

              <label>
                City
              </label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Hyderabad"
              />

            </div>

          </div>

          {/* ADDRESS */}

          <div className="form-group">

            <label>
              Address
            </label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              placeholder="Business address"
            />

          </div>

        </section>

        {/* ========================================
            SOCIAL MEDIA
            ======================================== */}

        <section className="form-section">

          <h2>
            Social Media
          </h2>

          <div className="form-grid">

            {/* INSTAGRAM */}

            <div className="form-group">

              <label>
                Instagram URL
              </label>

              <input
                name="instagram_url"
                value={form.instagram_url}
                onChange={handleChange}
                placeholder="Instagram profile URL"
              />

            </div>

            {/* FACEBOOK */}

            <div className="form-group">

              <label>
                Facebook URL
              </label>

              <input
                name="facebook_url"
                value={form.facebook_url}
                onChange={handleChange}
                placeholder="Facebook page URL"
              />

            </div>

          </div>

        </section>

        {/* ========================================
            BUSINESS LOGO
            ======================================== */}

        <section className="form-section">

          <h2>
            Business Logo
          </h2>

          <div className="upload-grid">

            <div className="upload-box">

              <label>
                Logo
              </label>

              <input
                id="business-logo"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setLogoFile(
                    e.target.files?.[0] || null
                  )
                }
              />

              {/* CURRENT LOGO */}

              {form.logo_url && (
                <img
                  src={form.logo_url}
                  alt="Business logo"
                  className="preview-logo"
                />
              )}

            </div>

          </div>

        </section>

        {/* ========================================
            MESSAGE
            ======================================== */}

        {message && (
          <div className="save-message">
            {message}
          </div>
        )}

        {/* ========================================
            SAVE
            ======================================== */}

        <button
          type="submit"
          className="save-button"
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Business Details"}
        </button>

      </form>

    </div>
  );
}

export default BusinessDetails;