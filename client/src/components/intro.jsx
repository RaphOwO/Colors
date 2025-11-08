import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "../styles/intro.css";

function Intro({ onDone }) {
  const [clicked, setClicked] = useState(false);

  const handleClick = () => {
    setClicked(true);
  };

  return (
    <AnimatePresence>
      {!clicked && (
        <motion.div
          className="intro"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: { duration: 1, ease: "easeInOut" },
          }}
        >
          <motion.h1
            className="intro-text"
            data-text="COLORS"
            onClick={handleClick}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            whileHover={{ scale: 1.05 }}
          >
            COLORS
          </motion.h1>

          <motion.h2
            className="flicker"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.6, 1] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            Click the logo to Continue
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Intro;
