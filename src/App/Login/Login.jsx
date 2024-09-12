import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { useAuth } from "../../Hooks/UseAuth";
import axios from "../../api/axios";
// import photo1 from "../../Image/file1.png";
function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const [error, setError] = useState({
    email: null,
    password: null,
    admin: null,
    teacher: null,
    student: null,
    api: null,
  });

  // from useauth

  const handlemail = (e) => {
    setError({ ...error, email: null });
    setEmail(e.target.value);
  };

  const handlePassword = (e) => {
    setError({ ...error, password: null });
    setPassword(e.target.value);
  };

  const handleAPIError = (error) => {
    let errormessage = error?.response?.data?.message;
    setError({ ...error, api: errormessage });
    toast.error(errormessage);
    alert(errormessage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const localValidationOk = handleValidation();
    if (localValidationOk === false) {
      setLoading(false);
      return;
    }
    setError({ api: null, email: null, password: null });
    try {
      await login(email, password);
    } catch (error) {
      handleAPIError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleValidation = () => {
    let allOk = true;
    if (email.length < 1) {
      setError({ ...error, email: "Email is required." });
      allOk = false;
    }
    if (password.length < 1) {
      setError({ ...error, password: "Password is required." });
      allOk = false;
    }

    return allOk;
  };

  return (
    <div className="bg-blue-200 h-screen flex justify-center items-center">
      <div className="bg-white rounded-2xl p-4">
        <div className="flex items-center justify-center">
          <h2 className="font-semibold text-[#2d2e8c] text-[32px]">
            BLACK<span className="text-[#eb1d22]">JACK</span>
          </h2>
        </div>
        {/* <div className="flex items-center justify-center">
          <img src={photo1} className="scale-75 h-[6rem] " />
        </div> */}
        <form
          onSubmit={handleSubmit}
          className=" flex flex-col justify-center items-center p-4 space-y-4"
        >
          <div className="space-y-4 flex justify-center items-center flex-col">
            <div className="space-y-1 flex flex-col text-left">
              <label htmlFor="email">Email</label>
              <input
                name="email"
                type="text"
                placeholder="Email"
                value={email}
                onChange={handlemail}
                className="p-1 md:w-72 rounded border border-1 border-gray-500"
              />
              {error?.email && <p className="text-red-300">{error?.email}</p>}
            </div>

            <div className="space-y-1 flex flex-col text-left">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                placeholder="**********"
                value={password}
                onChange={handlePassword}
                className="p-1 md:w-72 rounded border border-1 border-gray-500"
              />
              {error?.password && (
                <p className="text-red-300">{error?.password}</p>
              )}
            </div>

            <div className="flex justify-center items-center">
              {error?.selectedOption && (
                <p className="text-red-300">{error?.selectedOption}</p>
              )}
            </div>
            {/* for button */}
            <div>
              <button
                disabled={loading}
                className="p-2 px-4 bg-[#2d2e8c] hover:bg-emerald-700 rounded text-gray-100"
              >
                {loading ? "Logging In..." : "Login"}
              </button>
            </div>
          </div>

          <Link to="reset-password" className="text-blue-600">
            Forgot Password?
          </Link>
          <div className="">
            <span>I don't have an account.</span>
            <NavLink to="/register">
              <span className="text-blue-600 cursor-pointer">Create One</span>
            </NavLink>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
