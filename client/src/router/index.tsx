import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import ListPage from "../pages/ListPage/ListPage";
import ItemPage from "../pages/ItemPage/ItemPage";
import StatsPage from "../pages/StatsPage/StatsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "/", element: <ListPage /> },
      { path: "/list", element: <ListPage /> },
      { path: "/item/:id", element: <ItemPage /> },
      { path: "/stats", element: <StatsPage /> },
    ],
  },
]);

export default router;
