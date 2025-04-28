import { useState } from "react";
import LoginForm from "../components/LoginForm";
import SignupForm from "../components/SignupForm";
import { motion } from "framer-motion";

const Auth = () => {
  const [activeIndex, setActiveIndex] = useState(1);

  const tabs = [
    { name: "Signup", component: <SignupForm /> },
    { name: "Login", component: <LoginForm /> },
  ];

  return (
    <div className="lg:w-2/6 md:w-2/4 w-full mx-auto border-x-2 min-h-screen bg-[rgb(236,242,248)] flex items-center justify-center px-4 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-6 lg:rounded-xl lg:shadow-lg"
      >
        <div className="flex bg-teal-700 p-1 rounded-full mb-6 items-center gap-3">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setActiveIndex(index)}
              className={`w-1/2 py-2 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === index
                  ? "bg-white text-teal-700 shadow"
                  : "text-white hover:bg-white hover:text-teal-700"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className="min-h-[320px] flex items-center justify-center">
          {tabs[activeIndex].component}
        </div>
      </motion.div>
    </div>
  );
};
export default Auth;
