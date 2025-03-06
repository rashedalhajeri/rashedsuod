
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "@/hooks/use-auth-state";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo,
}) => {
  const { loading, authenticated } = useAuthState();

  if (loading) {
    return <div>Loading...</div>;
  }

  return authenticated ? (
    children
  ) : (
    <Navigate to={redirectTo} replace={true} />
  );
};

export default ProtectedRoute;
