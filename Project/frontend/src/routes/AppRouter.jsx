import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login, {loginAction} from "../pages/Login.jsx";
import Dashboard, {loadDashboardData} from "../pages/Dashboard.jsx";
import Projects, {loadProjectsData} from "../pages/Projects.jsx";
import ProjectDetails, {loadProjectDetailsData} from "../pages/ProjectDetails.jsx";
import Inventory, {loadInventoryData} from "../pages/Inventory.jsx";
import Users, {loadUsersData} from "../pages/Users.jsx";
import Settings, {loadSettingsData} from "../pages/Settings.jsx";
import AppLayout, { loadAppLayout } from "../layouts/AppLayout.jsx";

let router = createBrowserRouter([
  
  {
    path:"/login",
    Component: Login,
    action: loginAction,
  },
  {
    Component: AppLayout,
    loader: loadAppLayout,
    children: [
        {
            path: "/dashboard",
            Component: Dashboard,
            loader: loadDashboardData,
        },
        {
            path:"/projects",
            Component: Projects,
            loader: loadProjectsData,
        },
        {
            path:"/projects/:projectId",
            Component: ProjectDetails,
            loader: loadProjectDetailsData,
        },
        {
            path:"/inventory",
            Component: Inventory,
            loader: loadInventoryData,
        },
        {
            path:"/users",
            Component: Users,
            loader: loadUsersData,
        },
        {
            path:"/settings",
            Component: Settings,
            loader: loadSettingsData,
        }
    ]
  }, 
]);

export default router;