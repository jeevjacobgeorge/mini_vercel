import Signup from './Components/signup.jsx';
import Login from './Components/login.jsx';
import Dashboard from './Components/Dashboard.jsx';
import './index.css';
import * as React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link
} from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/student/signup",
    element: <Signup />,
  },
  {
    path: "/student/login",
    element: <Login />
  },
  {
    path: "student/dashboard",
    element: <Dashboard />
  },

]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
