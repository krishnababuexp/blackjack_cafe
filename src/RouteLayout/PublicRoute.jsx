import React from "react";

import { Outlet } from "react-router-dom";

const PublicRoute = () => {
  return (
    <div className="w-full">
      <Outlet />
    </div>
  );
};

export default PublicRoute;
