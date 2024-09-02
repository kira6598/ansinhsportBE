
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root, { loader as rootLoader,action as rootAction } from "./routes/root";
import ErrorPage from "./error-page";
import Contact, {
  loader as contactLoader,
} from "./routes/contact";
import StadiumManage from "./routes/StadiumManagement/StadiumManagement";
import "./index.css";
import LeaguageManagement from "./routes/LeaguageManagement/LeaguageManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element:<Root/>,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children:[
      {
        path: "contacts/:contactId",
        element: <Contact />,
      },
      {
        path: "stadium-manage",
        element: <StadiumManage />,
      },
      {
        path: "leaguage-manage",
        element: <LeaguageManagement />,
      },
    ]
  },
  
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);