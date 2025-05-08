import React from "react";
import { motion } from "framer-motion";

const NoFound = ({ message, onClose, description,buttonText }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="flex h-full flex-1 items-center justify-center "
    >
      <motion.div variants={item} className="p-6 max-w-md w-full text-center">
        <p className="text-gray-600 md:text-xl  font-semibold">
          {message}
        </p>

        <p className="text-sm text-gray-600">
         {description}
        </p>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onClose}
          className="mt-5 w-full py-3 px-4 bg-teal-600 text-white rounded-lg flex items-center justify-center font-medium hover:bg-teal-700 transition-colors cursor-pointer"
        >
          {buttonText}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default NoFound;
