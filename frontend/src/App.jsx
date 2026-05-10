import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/AppRoutes";
import { checkAuthStatus } from "./store/HrSlices/auth/loginSlice";

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  return <RouterProvider router={router} />;
}
