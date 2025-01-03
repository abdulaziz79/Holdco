import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerError, setRegisterError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setRegisterError(null);
    setSuccessMessage(null);

    try {
      const response = await axios.post("http://localhost:8000/api/method/holdo_task.api.auth.register", {
        username,
        password,
      });

      setSuccessMessage("Registration successful! You can now log in.");
      setUsername("");
      setPassword("");
      navigate('/login')
    } catch (error) {
      setRegisterError(error.response?.data?.message || "An error occurred.");
      console.log(error.message)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-sm w-full p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Register</h2>
        {registerError && (
          <div className="text-red-500 text-sm mb-4">{registerError}</div>
        )}
        {successMessage && (
          <div className="text-green-500 text-sm mb-4">{successMessage}</div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Register
          </button>
          already have an account? <Link to="/login" className="text-blue-600">login</Link>
        </form>
      </div>
    </div>
  );
};

export default Register;
