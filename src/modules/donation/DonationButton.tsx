"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const PAYPAL_URL = "https://www.paypal.com/ncp/payment/X2BF6EEGHCW2U";

export default function DonationButton() {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.a
      href={PAYPAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-pill font-mono font-semibold text-xs text-white overflow-hidden"
      style={{ background: "#e8399a", boxShadow: "0 4px 20px rgba(232, 57, 154, 0.45)" }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
    >
      <div className="flex items-center gap-2 px-4 py-3">
        <motion.span
          animate={{ scale: hovered ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 0.4, repeat: hovered ? Infinity : 0 }}
          style={{ display: "inline-block" }}
        >
          🩷
        </motion.span>
        <AnimatePresence>
          {hovered && (
            <motion.span
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "auto", opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="whitespace-nowrap overflow-hidden"
            >
              Support this project
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </motion.a>
  );
}
