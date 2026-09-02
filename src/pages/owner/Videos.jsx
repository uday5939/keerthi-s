import React, { useEffect, useState } from "react";
import { supabase } from "../../services/supabase";
import "./Videos.css";

function Videos() {
  const [videos, setVideos] = useState([]);

  const [videoFile, setVideoFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    setLoadingList(true);

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      setMessage(error.message);
    } else {
      setVideos(data || []);
    }

    setLoadingList(false);
  }

  function handleVideoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    setVideoFile(file);

    setVideoPreview(URL.createObjectURL(file));
  }

  async function uploadVideo(file) {
    const extension = file.name.split(".").pop();

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2)}.${extension}`;

    const path = `videos/${fileName}`;

    const { error } = await supabase.storage
      .from("pickle-videos")
      .upload(path, file);

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("pickle-videos")
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!videoFile && !editingId) {
      setMessage("Please select a video.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let videoUrl = "";

      if (videoFile) {
        videoUrl = await uploadVideo(videoFile);
      }

      if (editingId) {
        const updateData = {};

        if (videoUrl) {
          updateData.video_url = videoUrl;
        }

        updateData.updated_at =
          new Date().toISOString();

        const { error } = await supabase
          .from("videos")
          .update(updateData)
          .eq("id", editingId);

        if (error) throw error;

        setMessage("Video updated successfully.");
      } else {
        const { error } = await supabase
          .from("videos")
          .insert([
            {
              video_url: videoUrl,
              is_active: true,
            },
          ]);

        if (error) throw error;

        setMessage("Video uploaded successfully.");
      }

      resetForm();
      loadVideos();

    } catch (error) {
      setMessage(
        error.message || "Unable to upload video."
      );
    }

    setLoading(false);
  }

  function editVideo(video) {
    setEditingId(video.id);

    setVideoFile(null);

    setVideoPreview(video.video_url || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteVideo(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this video?"
    );

    if (!confirmed) return;

    const { error } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Video deleted successfully.");

    loadVideos();
  }

  async function toggleVideo(video) {
    const { error } = await supabase
      .from("videos")
      .update({
        is_active: !video.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", video.id);

    if (error) {
      setMessage(error.message);
      return;
    }

    loadVideos();
  }

  function resetForm() {
    setEditingId(null);
    setVideoFile(null);
    setVideoPreview("");

    const input = document.getElementById("pickle-video");

    if (input) {
      input.value = "";
    }
  }

  return (
    <div className="video-page">

      <div className="video-container">

        {/* HEADER */}

        <div className="video-header">

          <span>VISUAL COLLECTION</span>

          <div className="video-gold-line"></div>

          <h1>
            Videos
          </h1>

          <p>
            Showcase the beauty and tradition behind
            Keerthi's homemade pickles.
          </p>

        </div>


        {/* UPLOAD CARD */}

        <div className="video-upload-card">

          <div className="video-section-heading">

            <span>
              {editingId
                ? "REPLACE VIDEO"
                : "NEW VIDEO"}
            </span>

            <h2>
              {editingId
                ? "Choose another video"
                : "Upload a video"}
            </h2>

          </div>


          <form onSubmit={handleSubmit}>

            <label
              htmlFor="pickle-video"
              className="video-dropzone"
            >

              {videoPreview ? (
                <video
                  src={videoPreview}
                  controls
                  muted
                  playsInline
                />
              ) : (
                <>
                  <div className="video-plus">
                    +
                  </div>

                  <strong>
                    Choose video
                  </strong>

                  <span>
                    MP4, MOV or WEBM
                  </span>
                </>
              )}

            </label>

            <input
              id="pickle-video"
              type="file"
              accept="video/mp4,video/webm,video/quicktime"
              onChange={handleVideoChange}
              hidden
            />


            <div className="video-form-actions">

              <button
                type="submit"
                className="video-gold-button"
                disabled={loading}
              >
                {loading
                  ? "Uploading..."
                  : editingId
                  ? "Replace Video"
                  : "Upload Video"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="video-cancel-button"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>


          {message && (
            <div className="video-message">
              {message}
            </div>
          )}

        </div>


        {/* VIDEOS */}

        <div className="video-list-section">

          <div className="video-list-heading">

            <div>
              <span>YOUR COLLECTION</span>

              <h2>
                Uploaded Videos
              </h2>
            </div>

            <span>
              {videos.length} videos
            </span>

          </div>


          {loadingList ? (
            <div className="video-empty">
              Loading videos...
            </div>
          ) : videos.length === 0 ? (
            <div className="video-empty">
              No videos uploaded yet.
            </div>
          ) : (

            <div className="video-grid">

              {videos.map((video) => (

                <div
                  className="video-card"
                  key={video.id}
                >

                  <div className="video-preview">

                    <video
                      src={video.video_url}
                      controls
                      muted
                      playsInline
                    />

                  </div>


                  <div className="video-card-footer">

                    <span
                      className={
                        video.is_active
                          ? "video-active"
                          : "video-hidden"
                      }
                    >
                      {video.is_active
                        ? "VISIBLE"
                        : "HIDDEN"}
                    </span>


                    <div className="video-card-actions">

                      <button
                        onClick={() =>
                          toggleVideo(video)
                        }
                      >
                        {video.is_active
                          ? "Hide"
                          : "Show"}
                      </button>

                      <button
                        onClick={() =>
                          editVideo(video)
                        }
                      >
                        Replace
                      </button>

                      <button
                        onClick={() =>
                          deleteVideo(video.id)
                        }
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

export default Videos;