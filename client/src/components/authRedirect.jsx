import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const AuthRedirect = () => {
    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return isAuthenticated ? (
        <Navigate to={from} replace />
    ) : (
        <Outlet />
    );
};

export default AuthRedirect;