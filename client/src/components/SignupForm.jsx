import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";

const SignupForm = () => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    console.log(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 w-full">
      <Input
        type="text"
        name="fullName"
        value={form.fullName}
        onChange={handleChange}
        placeholder="Enter your full name"
        label="Full name"
      />

      <Input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        label="Email"
      />

      <Input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        label="Password"
        placeholder="Create a password"
      />

      <Input
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        label="Confirm Password"
        placeholder="Confirm your password"
      />

      <Button name="Sign Up" />
    </form>
  );
};

export default SignupForm;
