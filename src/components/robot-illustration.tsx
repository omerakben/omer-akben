"use client";

import { useChatSidebar } from "@/lib/chat-sidebar-context";
import { motion, useReducedMotion } from "framer-motion";
import { Brain, Code2, Rocket, TestTube } from "lucide-react";
import { useEffect, useState } from "react";

export function RobotIllustration() {
  const prefersReducedMotion = useReducedMotion();
  const [animationCycle, setAnimationCycle] = useState(0);
  const { openSidebar } = useChatSidebar();

  // Trigger animation cycle every 12 seconds
  useEffect(() => {
    if (prefersReducedMotion) return;

    const timer = setInterval(() => {
      setAnimationCycle((prev) => prev + 1);
    }, 12000);

    return () => clearInterval(timer);
  }, [prefersReducedMotion]);

  const handleRobotClick = () => {
    openSidebar();
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Reduced glow intensity (from 0.3-0.5 to 0.25-0.4) */}
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-br from-brand-primary/20 to-transparent rounded-full blur-2xl"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1, 1.2, 1],
                opacity: [0.25, 0.4, 0.25],
              }
        }
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute w-48 h-48 bg-gradient-to-br from-accent-primary/20 to-transparent rounded-full blur-2xl"
        animate={
          prefersReducedMotion
            ? {}
            : {
                scale: [1.2, 1, 1.2],
                opacity: [0.4, 0.25, 0.4],
              }
        }
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
        className="relative z-10 cursor-pointer hover:scale-105 transition-transform duration-200"
        onClick={handleRobotClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleRobotClick();
          }
        }}
        aria-label="Open chat with Ozzy"
      >
        {/* Robot Head */}
        <motion.rect
          x="100"
          y="80"
          width="100"
          height="80"
          rx="12"
          fill="url(#gradient1)"
          animate={prefersReducedMotion ? {} : { y: [80, 76, 80] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Antenna with pulse during test */}
        <motion.line
          x1="150"
          y1="78"
          x2="150"
          y2="58"
          stroke="url(#gradient1)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <motion.circle
          key={`antenna-${animationCycle}`}
          cx="150"
          cy="53"
          r="5"
          fill="url(#gradient2)"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  scale: [1, 1.3, 1],
                  opacity: [1, 0.6, 1],
                }
          }
          transition={{
            duration: 0.8,
            repeat: 3,
            ease: "easeInOut",
            delay: 2.5,
          }}
        />

        {/* Eyes with blink and tracking */}
        <motion.g key={`eyes-${animationCycle}`}>
          <motion.circle
            cx="125"
            cy="110"
            r="8"
            fill="#10B981"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scaleY: [1, 1, 0.1, 1, 1],
                    opacity: [1, 1, 1, 1, 1],
                  }
            }
            transition={{
              duration: 0.3,
              times: [0, 0.4, 0.5, 0.6, 1],
              repeat: 0,
              delay: 7.5,
            }}
          />
          <motion.circle
            cx="175"
            cy="110"
            r="8"
            fill="#10B981"
            animate={
              prefersReducedMotion
                ? {}
                : {
                    scaleY: [1, 1, 0.1, 1, 1],
                    opacity: [1, 1, 1, 1, 1],
                  }
            }
            transition={{
              duration: 0.3,
              times: [0, 0.4, 0.5, 0.6, 1],
              repeat: 0,
              delay: 7.5,
            }}
          />
        </motion.g>

        {/* Mouth - changes to approval smile at end */}
        <motion.path
          key={`mouth-${animationCycle}`}
          d="M 130 135 Q 150 145 170 135"
          stroke="#10B981"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  d: [
                    "M 130 135 Q 150 145 170 135",
                    "M 130 135 Q 150 145 170 135",
                    "M 130 132 Q 150 142 170 132",
                  ],
                }
          }
          transition={{
            duration: 0.3,
            times: [0, 0.8, 1],
            delay: 7,
          }}
        />

        {/* Body with subtle pulse during testing */}
        <motion.rect
          key={`body-${animationCycle}`}
          x="90"
          y="170"
          width="120"
          height="100"
          rx="15"
          fill="url(#gradient1)"
          animate={
            prefersReducedMotion
              ? {}
              : {
                  y: [170, 166, 170],
                  opacity: [1, 0.9, 1],
                }
          }
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.1,
          }}
        />

        {/* Arms */}
        <motion.rect
          x="60"
          y="180"
          width="25"
          height="70"
          rx="12"
          fill="url(#gradient2)"
          animate={prefersReducedMotion ? {} : { rotate: [-5, 5, -5] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "72px 180px" }}
        />
        <motion.rect
          x="215"
          y="180"
          width="25"
          height="70"
          rx="12"
          fill="url(#gradient2)"
          animate={prefersReducedMotion ? {} : { rotate: [5, -5, 5] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformOrigin: "228px 180px" }}
        />

        {/* Legs */}
        <rect
          x="110"
          y="275"
          width="30"
          height="15"
          rx="7"
          fill="url(#gradient2)"
        />
        <rect
          x="160"
          y="275"
          width="30"
          height="15"
          rx="7"
          fill="url(#gradient2)"
        />

        {/* Gradients - refined to match brand exactly */}
        <defs>
          <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.7" />
          </linearGradient>
        </defs>
      </motion.svg>

      {/* Workflow Pipeline - appears during animation cycle */}
      <WorkflowPipeline
        animationCycle={animationCycle}
        prefersReducedMotion={prefersReducedMotion}
      />

      {/* Floating code elements with reduced opacity */}
      <motion.div
        className="absolute bottom-8 right-10 text-brand-primary/40 text-2xl font-mono"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, 8, 0],
                opacity: [0.3, 0.4, 0.3],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        &lt;/&gt;
      </motion.div>
      <motion.div
        className="absolute bottom-20 left-10 text-accent-primary/40 text-xl font-mono"
        animate={
          prefersReducedMotion
            ? {}
            : {
                y: [0, 10, 0],
                opacity: [0.3, 0.4, 0.3],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
      >
        {"{ }"}
      </motion.div>
      <motion.div
        className="absolute top-1/2 right-5 text-brand-primary/40 text-lg font-mono"
        animate={
          prefersReducedMotion
            ? {}
            : {
                x: [0, 5, 0],
                opacity: [0.3, 0.4, 0.3],
              }
        }
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 4,
        }}
      >
        [ ]
      </motion.div>
    </div>
  );
}

function WorkflowPipeline({
  animationCycle,
  prefersReducedMotion,
}: {
  animationCycle: number;
  prefersReducedMotion: boolean | null;
}) {
  const conversations = [
    {
      id: 1,
      text: "Writing code",
      icon: Code2,
      delay: 0.8,
      duration: 1.8,
      position: "left",
    },
    {
      id: 2,
      text: "AI enhanced",
      icon: Brain,
      delay: 2.8,
      duration: 1.8,
      position: "right",
    },
    {
      id: 3,
      text: "Running tests",
      icon: TestTube,
      delay: 4.8,
      duration: 1.8,
      position: "left",
    },
    {
      id: 4,
      text: "Deployed! 90% coverage",
      icon: Rocket,
      delay: 6.8,
      duration: 2.2,
      position: "right",
    },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {/* Speech Balloons */}
      <div className="relative w-full h-full">
        {conversations.map((message) => {
          const Icon = message.icon;
          return (
            <motion.div
              key={`${animationCycle}-msg-${message.id}`}
              className={`absolute ${
                message.position === "left" ? "left-4 top-12" : "right-4 top-12"
              } max-w-[200px] hidden lg:block`}
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : {
                      opacity: [0, 1, 1, 0],
                      scale: [0.8, 1.02, 1, 0.95],
                      y: [10, 0, 0, 5],
                    }
              }
              transition={{
                duration: prefersReducedMotion ? 0 : message.duration,
                times: prefersReducedMotion ? undefined : [0, 0.2, 0.88, 1],
                delay: prefersReducedMotion ? 0 : message.delay,
                ease: "easeOut",
              }}
            >
              {/* Speech Balloon */}
              <div className="relative">
                {/* Balloon Background */}
                <div className="relative px-3 py-2 rounded-xl bg-surf-1 border border-brand-primary/50 shadow-md backdrop-blur-sm">
                  {/* Content with Icon */}
                  <div className="flex items-center gap-2">
                    <Icon
                      className="w-4 h-4 text-brand-primary flex-shrink-0"
                      strokeWidth={2}
                    />
                    <p className="text-xs font-medium text-text-1">
                      {message.text}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
