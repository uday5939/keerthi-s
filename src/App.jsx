import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login";

import OwnerRoute from "./components/auth/OwnerRoute";

import OwnerDashboard from "./pages/owner/OwnerDashboard";
import BusinessDetails from "./pages/owner/BusinessDetails";
import Pickles from "./pages/owner/Pickles";
import Images from "./pages/owner/Images";

import Home from "./pages/user/Home";

import "./App.css";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==========================================
            PUBLIC WEBSITE
        ========================================== */}

        <Route
          path="/"
          element={<Home />}
        />


        {/* ==========================================
            OWNER LOGIN
        ========================================== */}

        <Route
          path="/owner/login"
          element={<Login />}
        />


        {/* ==========================================
            PROTECTED OWNER AREA
        ========================================== */}

        <Route
          path="/owner"
          element={<OwnerRoute />}
        >

          {/* /owner */}

          <Route
            index
            element={<OwnerDashboard />}
          />

          {/* /owner/business */}

          <Route
            path="business"
            element={<BusinessDetails />}
          />

          {/* /owner/pickles */}

          <Route
            path="pickles"
            element={<Pickles />}
          />

          {/* /owner/images */}

          <Route
            path="images"
            element={<Images />}
          />

        </Route>


        {/* ==========================================
            UNKNOWN ROUTES
        ========================================== */}

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