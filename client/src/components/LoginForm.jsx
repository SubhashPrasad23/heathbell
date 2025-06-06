import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "./Input";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../features/user/userSlice";
import { motion } from "framer-motion"
import { Toast } from '@capacitor/toast';


const LoginForm = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const dispatch = useDispatch();

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: "", password: "" }

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

    setErrors(newErrors)
    return isValid
  }

  const navigate = useNavigate();
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
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        form,
        { withCredentials: true }
      );
      dispatch(addUser(response.data.data))
      if (response.status === 200) {
         await Toast.show({
                  text: "Login successfully",
                  duration: 'short',
                })
        navigate("/");
      }
    } catch (error) {
      console.error(error);
      setLoginError(
        error?.response?.data || "Invalid email or password"
      );
    } finally {
      setIsLoading(false)
    }
  };

  return (

    <form onSubmit={handleSubmit} className="space-y-5 w-full ">
      {loginError && <motion.p
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="text-red-500  text-center tracking-wider"
      >
        {loginError}
      </motion.p>}

      <Input
        type="email"
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Enter your email"
        label="Email"
        required
        error={errors.email}

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
        error={errors.password}

      />

      <Button name="Login" rounded={true} />
    </form>
  );
};

export default LoginForm;
