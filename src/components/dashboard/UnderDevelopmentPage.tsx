
import React from "react";
import NotFound from "@/pages/NotFound";

interface UnderDevelopmentPageProps {
  message: string;
}

const UnderDevelopmentPage: React.FC<UnderDevelopmentPageProps> = ({ message }) => {
  return <NotFound message={message} />;
};

export default UnderDevelopmentPage;
