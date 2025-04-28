import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../features/user/userSlice";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "12345" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const dispatch = useDispatch();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        form,
        { withCredentials: true }
      );
dispatch(addUser(response.data.data))
      if (response.status === 200) {
        navigate("/");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <Input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        label="Email"
        required
      />

      <Input
        type={showPassword ? "text" : "password"}
        name="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Enter your password"
        label="Password"
        required
        icon={showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        showPassword={showPassword}
        setShowPassword={setShowPassword}
      />

      <Button name="Login" />
    </form>
  );
};

export default LoginForm;
