import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import AddMedicine from "./pages/AddMedicine.jsx";
import AddPatient from "./pages/AddPatient.jsx";
import Search from "./pages/Search.jsx";


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "add_medicine", element: <AddMedicine /> },
      { path: "add_patient", element: <AddPatient /> },
      { path: "search", element: <Search /> },

    ],
  },
  { path: "/auth", element: <Auth /> },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
