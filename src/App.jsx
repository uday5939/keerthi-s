import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import OwnerDashboard
  from "./pages/owner/OwnerDashboard";

import BusinessDetails
  from "./pages/owner/BusinessDetails";

import Pickles
  from "./pages/owner/Pickles";

import Videos
  from "./pages/owner/Videos";

import Home
  from "./pages/user/Home";

import "./App.css";

function App() {

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/owner"
          element={<OwnerDashboard />}
        />

        <Route
          path="/owner/business"
          element={<BusinessDetails />}
        />

        <Route
          path="/owner/pickles"
          element={<Pickles />}
        />

        <Route
          path="/owner/videos"
          element={<Videos />}
        />

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;