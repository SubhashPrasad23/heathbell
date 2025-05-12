import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import SignupForm from "../components/SignupForm"
import LoginForm from "../components/LoginForm"


const Auth = () => {
  const [activeIndex, setActiveIndex] = useState(1)

  const tabs = [
    { name: "Signup", component: <SignupForm setActiveIndex={setActiveIndex}/> },
    { name: "Login", component: <LoginForm  /> },
  ]

  return (
    <div className="lg:max-w-lg md:max-w-md w-full mx-auto border-x-2 min-h-screen bg-[rgb(236,242,248)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white p-6 lg:rounded-xl lg:shadow-lg"
      >
        <div className="flex bg-teal-700  rounded-full mb-6 items-center ">
          {tabs.map((tab, index) => (
            <button
              key={tab.name}
              onClick={() => setActiveIndex(index)}
              className={`w-1/2 py-3 text-sm font-semibold rounded-full transition-all duration-300 cursor-pointer ${activeIndex === index ? "bg-white text-teal-700 shadow" : "text-white hover:bg-white/10"
                }`}
            >
              {tab.name}
            </button>
          ))}
        </div>

        <div className=" min-h-[510px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, x: activeIndex === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: activeIndex === 0 ? 20 : -20 }}
              transition={{ duration: 0.3 }}
              className="  flex items-center justify-center w-full"
            >
              {tabs[activeIndex].component}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
export default Auth