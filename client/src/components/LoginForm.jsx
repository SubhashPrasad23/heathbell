import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  const handleClick = () => {
    navigate("/");
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

      <Button name="Login" onClick={handleClick} />
    </form>
  );
};

export default LoginForm;
