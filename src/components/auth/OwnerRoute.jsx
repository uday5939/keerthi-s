import React, {
  useEffect,
  useState,
} from "react";

import {
  Navigate,
  Outlet,
} from "react-router-dom";

import { supabase } from "../../services/supabase";

function OwnerRoute() {
  const [session, setSession] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {

    let mounted = true;

    async function getSession() {

      const {
        data: { session },
      } =
        await supabase.auth.getSession();

      if (mounted) {
        setSession(session);
        setLoading(false);
      }
    }

    getSession();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {

          if (mounted) {
            setSession(session);
          }

        }
      );

    return () => {

      mounted = false;

      subscription.unsubscribe();

    };

  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f0e5",
          color: "#17352a",
          fontFamily: "Georgia, serif",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate
        to="/owner/login"
        replace
      />
    );
  }

  return <Outlet />;
}

export default OwnerRoute;