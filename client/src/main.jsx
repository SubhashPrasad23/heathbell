import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Auth from "./pages/Auth.jsx";
import Home from "./pages/Home.jsx";
import AddMedicine from "./pages/AddMedicine.jsx";
import Search from "./pages/Search.jsx";
import Account from "./pages/Account.jsx";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import PatientsList from "./components/PatientsList.jsx";
import AddPatient from "./components/AddPatient.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <Home /> },
      { path: "add_medicine", element: <AddMedicine /> },
      {
        path: "account",
        element: <Account />,
      },
      {
        path: "/account/list-of-patients",
        element: <PatientsList />,
      },
      {
        path: "/account/add-patient",
        element: <AddPatient />,
      },
      { path: "search", element: <Search /> },
    ],
  },
  { path: "/auth", element: <Auth /> },
]);

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
