import React from "react";

import { NavLink, useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate("/");
  };

  return (
    <div className="full-errorpage-container flex flex-col gap-[2rem] items-center justify-center bg-white min-h-[55vh]">
      <h1 className="Error-header text-gray-700 text-6xl m-0">404 Error</h1>
      <h4 className="Error-content text-gray-700 text-2xl"> You're Lost </h4>
      <button
        onClick={goBack}
        className="bg-blue-500 min-h-12 px-5 py-3 rounded text-white"
      >
        GO BACK TO HOME
      </button>
    </div>
  );
};

export default ErrorPage;
