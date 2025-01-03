import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import TodoPage from "../pages/Home";

const Router: React.FC = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path= "/" element = {<TodoPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default Router;
