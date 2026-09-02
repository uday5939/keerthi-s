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
    hero_image_url: "",
  });

  const [logoFile, setLogoFile] = useState(null);
  const [heroFile, setHeroFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadBusiness();
  }, []);

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
        hero_image_url: data.hero_image_url || "",
      });
    }

    setLoading(false);
  }

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function uploadFile(file, bucket) {

    if (!file) {
      return null;
    }

    const extension = file.name.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

    const filePath = fileName;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSave(e) {

    e.preventDefault();

    setSaving(true);
    setMessage("");

    try {

      let logoUrl = form.logo_url;
      let heroUrl = form.hero_image_url;

      if (logoFile) {
        logoUrl = await uploadFile(
          logoFile,
          "business-images"
        );
      }

      if (heroFile) {
        heroUrl = await uploadFile(
          heroFile,
          "business-images"
        );
      }

      const payload = {
        ...form,
        logo_url: logoUrl,
        hero_image_url: heroUrl,
        updated_at: new Date().toISOString(),
      };

      delete payload.logo_url_temp;
      delete payload.hero_image_url_temp;

      const { data: existing } = await supabase
        .from("business_details")
        .select("id")
        .limit(1)
        .maybeSingle();

      let error;

      if (existing) {

        const result = await supabase
          .from("business_details")
          .update(payload)
          .eq("id", existing.id);

        error = result.error;

      } else {

        const result = await supabase
          .from("business_details")
          .insert(payload);

        error = result.error;
      }

      if (error) {
        throw error;
      }

      setForm({
        ...form,
        logo_url: logoUrl,
        hero_image_url: heroUrl,
      });

      setLogoFile(null);
      setHeroFile(null);

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

  if (loading) {
    return (
      <div className="owner-page">
        <h1>Business Details</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="owner-page">

      <div className="owner-page-header">
        <div>
          <span>OWNER PANEL</span>
          <h1>Business Details</h1>
          <p>
            Manage the information displayed
            on your public website.
          </p>
        </div>
      </div>

      <form
        className="business-form"
        onSubmit={handleSave}
      >

        <section className="form-section">

          <h2>Basic Information</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Business Name</label>

              <input
                name="business_name"
                value={form.business_name}
                onChange={handleChange}
                placeholder="Keerthi's Pickles"
                required
              />
            </div>

            <div className="form-group">
              <label>Tagline</label>

              <input
                name="tagline"
                value={form.tagline}
                onChange={handleChange}
                placeholder="Homemade with love"
              />
            </div>

          </div>

          <div className="form-group">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows="5"
              placeholder="Tell customers about your homemade pickles..."
            />
          </div>

        </section>

        <section className="form-section">

          <h2>Contact Information</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Phone</label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
              />
            </div>

            <div className="form-group">
              <label>WhatsApp</label>

              <input
                name="whatsapp"
                value={form.whatsapp}
                onChange={handleChange}
                placeholder="919876543210"
              />
            </div>

            <div className="form-group">
              <label>Email</label>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
              />
            </div>

            <div className="form-group">
              <label>City</label>

              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Hyderabad"
              />
            </div>

          </div>

          <div className="form-group">
            <label>Address</label>

            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows="3"
              placeholder="Business address"
            />
          </div>

        </section>

        <section className="form-section">

          <h2>Social Media</h2>

          <div className="form-grid">

            <div className="form-group">
              <label>Instagram URL</label>

              <input
                name="instagram_url"
                value={form.instagram_url}
                onChange={handleChange}
                placeholder="Instagram profile URL"
              />
            </div>

            <div className="form-group">
              <label>Facebook URL</label>

              <input
                name="facebook_url"
                value={form.facebook_url}
                onChange={handleChange}
                placeholder="Facebook page URL"
              />
            </div>

          </div>

        </section>

        <section className="form-section">

          <h2>Business Images</h2>

          <div className="upload-grid">

            <div className="upload-box">

              <label>
                Logo
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setLogoFile(e.target.files[0])
                }
              />

              {form.logo_url && (
                <img
                  src={form.logo_url}
                  alt="Business logo"
                  className="preview-logo"
                />
              )}

            </div>

            <div className="upload-box">

              <label>
                Hero Image
              </label>

              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setHeroFile(e.target.files[0])
                }
              />

              {form.hero_image_url && (
                <img
                  src={form.hero_image_url}
                  alt="Hero"
                  className="preview-hero"
                />
              )}

            </div>

          </div>

        </section>

        {message && (
          <div className="save-message">
            {message}
          </div>
        )}

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