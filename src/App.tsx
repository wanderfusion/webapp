import { createBrowserRouter, RouterProvider } from "react-router-dom";

import React, { useEffect } from "react";
import { Home } from "@/pages/home/home";
import { Login } from "@/pages/login/login";
import { Register } from "@/pages/register/register";
import { NotFound } from "@/pages/errors/notfound";
import { LOCAL_STORAGE_KEYS, PATHS } from "@/commons/constants";
import Layout from "@/pages/layout/layout";
import { UpdateProfile } from "@/pages/updateprofile/updateprofile";
import CalendarPicker from "@/pages/calendar/picker";
import { Dashboard } from "./pages/dashboard/dashboard";
import { CreateGroup } from "./pages/createGroup/createGroup";
import { useAppDispatch } from "./store/hooks";
import { setUserFromJwt } from "./store/userSlice";
import { authEventEmitter } from "./auth/authEventEmitter";

const routes = [
  { path: PATHS.HOME, component: Home },
  { path: PATHS.LOGIN, component: Login },
  { path: PATHS.REGISTER, component: Register },
  { path: PATHS.DASHBOARD, component: Dashboard },
  { path: PATHS.UPDATE_PROFILE, component: UpdateProfile },
  { path: PATHS.CREATE_GROUP, component: CreateGroup },
  { path: PATHS.UPDATE_CALENDAR, component: CalendarPicker },
];

const router = createBrowserRouter([
  ...routes.map(({ path, component }) => ({
    path,
    element: <Layout>{React.createElement(component)}</Layout>,
  })),
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  const dispatch = useAppDispatch();
  // const refreshToken = useReadLocalStorage(LOCAL_STORAGE_KEYS.REFRESH_TOKEN);
  // <LoginOverlay />;

  const existingAuthToken = localStorage.getItem(LOCAL_STORAGE_KEYS.AUTH_TOKEN);
  if (existingAuthToken) {
    dispatch(setUserFromJwt(existingAuthToken));
  }

  useEffect(() => {
    // newToken is explicitly typed as string because the type of the event
    const handleTokenUpdate = (newToken) => {
      if (typeof newToken !== "string") {
        throw new Error(`Expected string, got ${typeof newToken}`);
      }
      dispatch(setUserFromJwt(newToken));
    };

    authEventEmitter.on("authTokenUpdated", handleTokenUpdate);

    return () => {
      authEventEmitter.off("authTokenUpdated", handleTokenUpdate);
    };
  }, [dispatch]);
  return (
    <div className="app">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
