import * as React from "react";
import * as ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import {
  createBrowserRouter,
  createHashRouter,
  RouterProvider,
} from "react-router-dom";
import Root, {
  loader as rootLoader,
  action as rootAction,
} from "./routes/root";
import ErrorPage from "./error-page";
import StadiumManage from "./routes/StadiumManagement/StadiumManagement";
import "./index.css";
import PlayersManagement from "./routes/PlayersManagement/PlayerManagement";
import LeaguageManagement from "./routes/LeaguageManagement/LeaguageManagement";
import MatchSchedule from "./routes/matchSchedule/MatchSchedule";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SceenManagement from "./routes/SceenManagement/ScreenManagement";
const router = createHashRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    loader: rootLoader,
    action: rootAction,
    children: [
      {
        path: "leaguage-manage",
        element: <LeaguageManagement />,
      },
      {
        path: "stadium-manage",
        element: <StadiumManage />,
      },
      {
        path: "players-manage",
        element: <PlayersManagement />,
      },
      // {
      //   path: "match-table",
      //   element: <MatchTable />,
      // },
      {
        path: "match-schedule",
        element: <MatchSchedule />,
      },
      {
        path: "screen-manage",
        element: <SceenManagement />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);
