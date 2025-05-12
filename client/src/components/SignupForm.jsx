import React, { useState } from "react";
import Button from "./Button";
import Input from "./Input";
import axios from "axios";
import { Toast } from '@capacitor/toast';


const SignupForm = ({ setActiveIndex }) => {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({ fullName: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);



  const validateForm = () => {
    let isValid = true
    const newErrors = { fullName: "", email: "", password: "" }

    if (!form.fullName) {
      newErrors.fullName = "Full name is required"
      isValid = false

    }


    if (!form.email) {
      newErrors.email = "Email is required"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid"
      isValid = false
    }

    if (!form.password) {
      newErrors.password = "Password is required"
      isValid = false
    }
    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    if (!validateForm()) {
      setIsLoading(false);
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/signup`,

        form
        ,
        { withCredentials: true }
      );
      console.log(response);
      if(response.status==201){
        await Toast.show({
          text: "You're successfully registered with HealthBell.",
          duration: 'short',
        });
        setActiveIndex(1)
      }
    } catch (error) {
      console.log(error);
      await Toast.show({
        text: 'Signup failed. Try again.',
        duration: 'short',
      });
    } finally {
      setIsLoading(false)

    }
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
        error={errors.fullName}

      />

      <Input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        label="Email"
        error={errors.email}

      />

      <Input
        type="password"
        name="password"
        value={form.password}
        onChange={handleChange}
        label="Password"
        placeholder="Create a password"
        error={errors.password}

      />

      <Input
        type="password"
        name="confirmPassword"
        value={form.confirmPassword}
        onChange={handleChange}
        label="Confirm Password"
        placeholder="Confirm your password"
        error={errors.confirmPassword}

      />

      <Button name="Sign Up" rounded={true} />
    </form>

  );
};

export default SignupForm;
