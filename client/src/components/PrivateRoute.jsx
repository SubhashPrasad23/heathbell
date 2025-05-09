import { Navigate } from "react-router-dom";
import useAuth from "../hook/useAuth";

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();

    const isAuthenticated = user && Object.keys(user).length > 0;

    if (loading) return null; // or show a spinner

    return isAuthenticated ? children : <Navigate to="/auth" replace />;
};

export default PrivateRoute;
