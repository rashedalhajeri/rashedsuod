
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface AuthLinksProps {
  storeDomain: string;
}

const AuthLinks: React.FC<AuthLinksProps> = ({ storeDomain }) => {
  return (
    <div className="hidden md:flex items-center gap-4">
      <Link to={`/store/${storeDomain}/login`} className="text-gray-700 hover:text-primary transition-colors font-medium">
        تسجيل دخول
      </Link>
      <Link to={`/store/${storeDomain}/register`}>
        <Button className="bg-primary hover:bg-primary/90 transition-colors">
          تسجيل حساب
        </Button>
      </Link>
    </div>
  );
};

export default AuthLinks;
