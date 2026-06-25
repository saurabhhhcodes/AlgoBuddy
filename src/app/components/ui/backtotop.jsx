"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const BackToTop = () => {
  const [visible, setVisible] = useState(false);
  const [isNearBottom, setIsNearBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || window.pageYOffset || 0;
      const viewportHeight = window.innerHeight || 0;
      const documentHeight = document.documentElement.scrollHeight || 0;
      const maxScroll = Math.max(documentHeight - viewportHeight, 0);
      const nearBottom = maxScroll > 0 && scrollTop >= maxScroll - 300;

      setVisible(scrollTop > 300 || nearBottom);
      setIsNearBottom(nearBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  const handleClick = () => {
    const viewportHeight = window.innerHeight || 0;
    const documentHeight = document.documentElement.scrollHeight || 0;
    const maxScroll = Math.max(documentHeight - viewportHeight, 0);

    window.scrollTo({
      top: isNearBottom ? 0 : maxScroll,
      behavior: "smooth",
    });
  };

  const label = isNearBottom ? "Scroll to top" : "Scroll to bottom";

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={handleClick}
          aria-label={label}
          style={{ position: "fixed", bottom: "96px", right: "20px" }}
          className="group z-[9990] flex h-10 w-10 items-center justify-center rounded-full bg-[#a435f0] text-white shadow-lg transition-colors hover:bg-[#8f2cd6] sm:h-12 sm:w-12"
        >
          <div className="absolute bottom-full mb-2 hidden whitespace-nowrap rounded bg-gray-800 px-2 py-1 text-xs font-medium text-white group-hover:block">
            {label}
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:-translate-y-0.5 ${
              isNearBottom ? "" : "rotate-180 group-hover:translate-y-0.5"
            }`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
        </motion.button>
      )}
    </AnimatePresence>
  );
};

export default BackToTop;
