import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Spinner from "./Spinner/Spinner";


export default function ProtectedRoute({ children, allowedRoles }) {

    const { currentUser, loading } = useContext(AuthContext);

    if (loading) return <Spinner />

    if (!currentUser) {
        return <Navigate to="/login" replace />
    }

    if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
        return <Navigate to="/" replace />
    }

    return children;

}

