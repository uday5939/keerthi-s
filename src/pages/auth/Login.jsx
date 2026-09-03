import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../services/supabase";
import "./Auth.css";

function Login() {
  const navigate = useNavigate();

  const [business, setBusiness] = useState(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loadingBusiness, setLoadingBusiness] =
    useState(true);

  const [loggingIn, setLoggingIn] =
    useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    loadBusiness();
    checkExistingSession();
  }, []);

  async function loadBusiness() {
    const { data, error } = await supabase
      .from("business_details")
      .select("business_name, logo_url")
      .limit(1)
      .maybeSingle();

    if (!error && data) {
      setBusiness(data);
    }

    setLoadingBusiness(false);
  }

  async function checkExistingSession() {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session) {
      navigate("/owner", { replace: true });
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    setError("");

    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }

    setLoggingIn(true);

    const { error } =
      await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Invalid email or password."
          : error.message
      );

      setLoggingIn(false);
      return;
    }

    navigate("/owner", { replace: true });

    setLoggingIn(false);
  }

  if (loadingBusiness) {
    return (
      <div className="login-page">
        <div className="login-loading">
          Loading...
        </div>
      </div>
    );
  }

  const businessName =
    business?.business_name ||
    "Keerthi's Pickles";

  return (
    <div className="login-page">

      <div className="login-card">

        {/* LOGO */}

        <div className="login-logo-wrapper">

          {business?.logo_url ? (
            <img
              src={business.logo_url}
              alt={businessName}
              className="login-logo"
            />
          ) : (
            <div className="login-logo-placeholder">
              KP
            </div>
          )}

        </div>

        {/* BUSINESS NAME */}

        <div className="login-brand">

          <h1>
            {businessName}
          </h1>

          <span>
            HOMEMADE
          </span>

        </div>

        {/* HEADING */}

        <div className="login-heading">

          <span>
            OWNER ACCESS
          </span>

          <h2>
            Welcome back.
          </h2>

          <p>
            Sign in to manage your pickle
            collection and website.
          </p>

        </div>

        {/* FORM */}

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          <div className="login-field">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              autoComplete="email"
              disabled={loggingIn}
            />

          </div>

          <div className="login-field">

            <label>
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter your password"
              autoComplete="current-password"
              disabled={loggingIn}
            />

          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loggingIn}
          >
            {loggingIn
              ? "Signing in..."
              : "Sign In"}

            {!loggingIn && (
              <span>
                →
              </span>
            )}
          </button>

        </form>

        <div className="login-footer">
          <span>
            OWNER PANEL
          </span>

          <i></i>

          <span>
            {businessName}
          </span>
        </div>

      </div>

    </div>
  );
}

export default Login;