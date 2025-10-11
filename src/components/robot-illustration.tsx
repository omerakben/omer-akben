"use client";

import { motion } from "framer-motion";

export function RobotIllustration() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Gradient circles */}
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-br from-brand-primary/20 to-transparent rounded-full blur-2xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-48 h-48 bg-gradient-to-br from-accent-primary/20 to-transparent rounded-full blur-2xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.5, 0.3, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
      />

      {/* Robot SVG */}
      <motion.svg
        width="300"
        height="300"
        viewBox="0 0 300 300"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        {/* Robot Head */}
        <motion.rect
          x="100"
          y="80"
          width="100"
          height="80"
          rx="10"
          fill="url(#gradient1)"
          animate={{ y: [80, 75, 80] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Antenna */}
        <line
          x1="150"
          y1="78"
          x2="150"
          y2="58"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle
          cx="150"
          cy="53"
          r="5"
          fill="url(#gradient2)"
        />

        {/* Eyes */}
        <motion.circle
          cx="125"
          cy="110"
          r="8"
          fill="#10B981"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.circle
          cx="175"
          cy="110"
          r="8"
          fill="#10B981"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Mouth */}
        <motion.path
          d="M 130 135 Q 150 145 170 135"
          stroke="#10B981"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Body */}
        <motion.rect
          x="90"
          y="170"
          width="120"
          height="100"
          rx="15"
          fill="url(#gradient1)"
          animate={{ y: [170, 165, 170] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />

        {/* Arms */}
        <motion.rect
          x="60"
          y="180"
          width="25"
          height="70"
          rx="12"
          fill="url(#gradient2)"
          animate={{ rotate: [-5, 5, -5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "72px 180px" }}
        />
        <motion.rect
          x="215"
          y="180"
          width="25"
          height="70"
          rx="12"
          fill="url(#gradient2)"
          animate={{ rotate: [5, -5, 5] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: "228px 180px" }}
        />

        {/* Legs */}
        <rect x="110" y="275" width="30" height="15" rx="7" fill="url(#gradient2)" />
        <rect x="160" y="275" width="30" height="15" rx="7" fill="url(#gradient2)" />

        {/* Gradients */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.6" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Floating code elements */}
      <motion.div
        className="absolute top-10 right-10 text-brand-primary text-2xl font-mono"
        animate={{ y: [0, -10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        &lt;/&gt;
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-10 text-accent-primary text-xl font-mono"
        animate={{ y: [0, 10, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        {"{ }"}
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-5 text-brand-primary text-lg font-mono"
        animate={{ x: [0, 5, 0], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        [ ]
      </motion.div>
    </div>
  );
}
