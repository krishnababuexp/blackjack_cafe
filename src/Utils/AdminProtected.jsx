import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../Hooks/UseAuth";

const AdminProtected = () => {
  const { user } = useAuth();

  // Check if user exists and is an admin
  if (user && user.user_is_admin) {
    return <Outlet />;
  } else {
    // Redirect to homepage if user is not an admin or user is not logged in
    return <Navigate to="/" replace={true} />;
  }
};

export default AdminProtected;
