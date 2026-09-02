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

  // ==================================================
  // LOAD VIDEOS
  // ==================================================

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    setLoadingList(true);

    const { data, error } = await supabase
      .from("videos")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      setMessage(error.message);
    } else {
      setVideos(data || []);
    }

    setLoadingList(false);
  }

  // ==================================================
  // VIDEO SELECT
  // ==================================================

  function handleVideoChange(e) {
    const file = e.target.files?.[0];

    if (!file) return;

    // Clean previous preview
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
    }

    setVideoFile(file);

    const previewUrl =
      URL.createObjectURL(file);

    setVideoPreview(previewUrl);
  }

  // ==================================================
  // REMOVE AUDIO FROM VIDEO
  //
  // This creates a new video containing ONLY
  // the video track.
  // ==================================================

  async function removeAudioFromVideo(file) {
    return new Promise(
      (resolve, reject) => {
        const inputUrl =
          URL.createObjectURL(file);

        const video =
          document.createElement("video");

        video.muted = true;
        video.playsInline = true;
        video.preload = "auto";

        video.src = inputUrl;

        video.onloadedmetadata = async () => {
          try {
            // ----------------------------------------
            // Check browser support
            // ----------------------------------------

            if (
              typeof video.captureStream !==
              "function"
            ) {
              URL.revokeObjectURL(
                inputUrl
              );

              reject(
                new Error(
                  "Your browser does not support automatic audio removal. Please use Chrome or Edge."
                )
              );

              return;
            }

            // ----------------------------------------
            // Capture video stream
            // ----------------------------------------

            const stream =
              video.captureStream();

            // ----------------------------------------
            // REMOVE ALL AUDIO TRACKS
            // ----------------------------------------

            stream
              .getAudioTracks()
              .forEach(
                (track) => {
                  track.stop();
                  stream.removeTrack(
                    track
                  );
                }
              );

            // ----------------------------------------
            // Get video tracks only
            // ----------------------------------------

            const videoTracks =
              stream.getVideoTracks();

            if (
              videoTracks.length === 0
            ) {
              URL.revokeObjectURL(
                inputUrl
              );

              reject(
                new Error(
                  "Unable to read the video track."
                )
              );

              return;
            }

            const silentStream =
              new MediaStream(
                videoTracks
              );

            // ----------------------------------------
            // Choose output format
            // ----------------------------------------

            let mimeType =
              "video/webm;codecs=vp9";

            if (
              !MediaRecorder.isTypeSupported(
                mimeType
              )
            ) {
              mimeType =
                "video/webm;codecs=vp8";
            }

            if (
              !MediaRecorder.isTypeSupported(
                mimeType
              )
            ) {
              mimeType = "video/webm";
            }

            // ----------------------------------------
            // Record silent video
            // ----------------------------------------

            const recorder =
              new MediaRecorder(
                silentStream,
                {
                  mimeType,
                }
              );

            const chunks = [];

            recorder.ondataavailable = (
              event
            ) => {
              if (
                event.data &&
                event.data.size > 0
              ) {
                chunks.push(
                  event.data
                );
              }
            };

            recorder.onerror = (
              event
            ) => {
              URL.revokeObjectURL(
                inputUrl
              );

              reject(
                event.error ||
                  new Error(
                    "Unable to process video."
                  )
              );
            };

            recorder.onstop = () => {
              URL.revokeObjectURL(
                inputUrl
              );

              const blob =
                new Blob(
                  chunks,
                  {
                    type: mimeType,
                  }
                );

              // --------------------------------------
              // Convert Blob to File
              // --------------------------------------

              const silentFile =
                new File(
                  [blob],
                  `${file.name.replace(
                    /\.[^/.]+$/,
                    ""
                  )}.webm`,
                  {
                    type: mimeType,
                  }
                );

              resolve(
                silentFile
              );
            };

            // ----------------------------------------
            // Start recording
            // ----------------------------------------

            recorder.start();

            // ----------------------------------------
            // Play video
            // ----------------------------------------

            try {
              await video.play();
            } catch (error) {
              recorder.stop();

              URL.revokeObjectURL(
                inputUrl
              );

              reject(
                new Error(
                  "Unable to process the selected video."
                )
              );

              return;
            }

            // ----------------------------------------
            // Stop when video ends
            // ----------------------------------------

            video.onended = () => {
              if (
                recorder.state !==
                "inactive"
              ) {
                recorder.stop();
              }
            };
          } catch (error) {
            URL.revokeObjectURL(
              inputUrl
            );

            reject(error);
          }
        };

        video.onerror = () => {
          URL.revokeObjectURL(
            inputUrl
          );

          reject(
            new Error(
              "Unable to read the selected video."
            )
          );
        };

        video.load();
      }
    );
  }

  // ==================================================
  // UPLOAD VIDEO
  // ==================================================

  async function uploadVideo(file) {
    // ----------------------------------------------
    // REMOVE AUDIO FIRST
    // ----------------------------------------------

    setMessage(
      "Removing audio from video..."
    );

    const silentVideo =
      await removeAudioFromVideo(
        file
      );

    // ----------------------------------------------
    // CREATE UNIQUE FILE NAME
    // ----------------------------------------------

    const fileName =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.webm`;

    const path =
      `videos/${fileName}`;

    // ----------------------------------------------
    // UPLOAD SILENT VIDEO
    // ----------------------------------------------

    setMessage(
      "Uploading silent video..."
    );

    const {
      error,
    } = await supabase.storage
      .from("pickle-videos")
      .upload(
        path,
        silentVideo,
        {
          contentType:
            "video/webm",
          upsert: false,
        }
      );

    if (error) {
      throw error;
    }

    // ----------------------------------------------
    // PUBLIC URL
    // ----------------------------------------------

    const {
      data,
    } = supabase.storage
      .from("pickle-videos")
      .getPublicUrl(
        path
      );

    return data.publicUrl;
  }

  // ==================================================
  // SUBMIT
  // ==================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (
      !videoFile &&
      !editingId
    ) {
      setMessage(
        "Please select a video."
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      let videoUrl = "";

      // --------------------------------------------
      // PROCESS + UPLOAD
      // --------------------------------------------

      if (videoFile) {
        videoUrl =
          await uploadVideo(
            videoFile
          );
      }

      // --------------------------------------------
      // REPLACE EXISTING VIDEO
      // --------------------------------------------

      if (editingId) {
        const updateData = {};

        if (videoUrl) {
          updateData.video_url =
            videoUrl;
        }

        updateData.updated_at =
          new Date().toISOString();

        const {
          error,
        } = await supabase
          .from("videos")
          .update(
            updateData
          )
          .eq(
            "id",
            editingId
          );

        if (error) {
          throw error;
        }

        setMessage(
          "Video replaced successfully."
        );
      }

      // --------------------------------------------
      // NEW VIDEO
      // --------------------------------------------

      else {
        const {
          error,
        } = await supabase
          .from("videos")
          .insert([
            {
              video_url:
                videoUrl,
              is_active:
                true,
            },
          ]);

        if (error) {
          throw error;
        }

        setMessage(
          "Video uploaded successfully."
        );
      }

      resetForm();

      await loadVideos();
    } catch (error) {
      console.error(
        "Video upload error:",
        error
      );

      setMessage(
        error.message ||
          "Unable to upload video."
      );
    }

    setLoading(false);
  }

  // ==================================================
  // EDIT
  // ==================================================

  function editVideo(video) {
    setEditingId(video.id);

    setVideoFile(null);

    if (videoPreview) {
      URL.revokeObjectURL(
        videoPreview
      );
    }

    setVideoPreview(
      video.video_url || ""
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ==================================================
  // DELETE
  // ==================================================

  async function deleteVideo(id) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this video?"
      );

    if (!confirmed) {
      return;
    }

    const {
      error,
    } = await supabase
      .from("videos")
      .delete()
      .eq("id", id);

    if (error) {
      setMessage(
        error.message
      );

      return;
    }

    setMessage(
      "Video deleted successfully."
    );

    loadVideos();
  }

  // ==================================================
  // SHOW / HIDE
  // ==================================================

  async function toggleVideo(video) {
    const {
      error,
    } = await supabase
      .from("videos")
      .update({
        is_active:
          !video.is_active,
        updated_at:
          new Date().toISOString(),
      })
      .eq(
        "id",
        video.id
      );

    if (error) {
      setMessage(
        error.message
      );

      return;
    }

    loadVideos();
  }

  // ==================================================
  // RESET
  // ==================================================

  function resetForm() {
    setEditingId(null);
    setVideoFile(null);

    if (videoPreview) {
      URL.revokeObjectURL(
        videoPreview
      );
    }

    setVideoPreview("");

    const input =
      document.getElementById(
        "pickle-video"
      );

    if (input) {
      input.value = "";
    }
  }

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="video-page">

      <div className="video-container">

        {/* HEADER */}

        <div className="video-header">

          <span>
            VISUAL COLLECTION
          </span>

          <div className="video-gold-line"></div>

          <h1>
            Videos
          </h1>

          <p>
            Showcase the beauty and tradition
            behind Keerthi's homemade pickles.
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

          <form
            onSubmit={
              handleSubmit
            }
          >

            <label
              htmlFor="pickle-video"
              className="video-dropzone"
            >

              {videoPreview ? (

                <video
                  src={
                    videoPreview
                  }
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
              onChange={
                handleVideoChange
              }
              hidden
            />

            <div className="video-form-actions">

              <button
                type="submit"
                className="video-gold-button"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : editingId
                  ? "Replace Video"
                  : "Upload Video"}
              </button>

              {editingId && (

                <button
                  type="button"
                  className="video-cancel-button"
                  onClick={
                    resetForm
                  }
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

              <span>
                YOUR COLLECTION
              </span>

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

              {videos.map(
                (video) => (

                  <div
                    className="video-card"
                    key={video.id}
                  >

                    <div className="video-preview">

                      <video
                        src={
                          video.video_url
                        }
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
                            toggleVideo(
                              video
                            )
                          }
                        >
                          {video.is_active
                            ? "Hide"
                            : "Show"}
                        </button>

                        <button
                          onClick={() =>
                            editVideo(
                              video
                            )
                          }
                        >
                          Replace
                        </button>

                        <button
                          onClick={() =>
                            deleteVideo(
                              video.id
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>

                    </div>

                  </div>

                )
              )}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Videos;