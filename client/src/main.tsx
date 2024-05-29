import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "@/pages/Root";
import ErrorPage from "@/pages/Error";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "@/redux/store";
import { Route } from "@/types/routes";
import "@/index.css";

const router = createBrowserRouter([
  { path: Route.Root, element: <Root />, errorElement: <ErrorPage /> },
  { path: Route.Login, element: <Login /> },
  { path: Route.Register, element: <Register /> },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode>
);
