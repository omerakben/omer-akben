"use client";

import { motion, useInView, useMotionValue, useSpring } from "framer-motion";
import { GraduationCap, Award, Briefcase } from "lucide-react";
import { useEffect, useRef } from "react";
import { DURATION } from "@/lib/animations";

interface StatCardProps {
  icon: React.ElementType;
  value: number;
  label: string;
  suffix?: string;
  delay: number;
}

function AnimatedCounter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px 0px -100px 0px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [motionValue, isInView, value]);

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toString();
      }
    });

    return () => unsubscribe();
  }, [springValue]);

  return <span ref={ref}>0</span>;
}

function StatCard({ icon: Icon, value, label, suffix = "", delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -100px 0px" }}
      transition={{ duration: 0.6, delay }}
      className="group relative"
    >
      {/* Glassmorphism card */}
      <div className="relative bg-surf-1/80 backdrop-blur-sm border border-border-line rounded-[24px] p-8 hover:border-brand-primary/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-xl hover:shadow-brand-primary/10">
        {/* Background gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-accent-primary/5 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className="mb-4 inline-flex p-3 rounded-2xl bg-brand-primary/10 text-brand-primary group-hover:scale-110 transition-transform duration-500">
            <Icon className="w-6 h-6" />
          </div>

          {/* Value */}
          <div className="text-4xl md:text-5xl font-bold text-text-1 mb-2">
            <AnimatedCounter value={value} />
            {suffix && <span className="text-brand-primary">{suffix}</span>}
          </div>

          {/* Label */}
          <p className="text-text-2 font-medium">{label}</p>
        </div>

        {/* Decorative corner accent */}
        <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-primary/20 group-hover:bg-brand-primary/40 transition-colors duration-500" />
      </div>
    </motion.div>
  );
}

export function CredentialsHero() {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: DURATION.normal, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-sm font-medium mb-6"
          >
            <GraduationCap className="w-4 h-4" />
            Professional Credentials
          </motion.div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-text-1 mb-6">
            Education & Certifications
          </h1>

          <p className="text-lg md:text-xl text-text-2 max-w-3xl mx-auto">
            Formal education, professional certifications, and continuous learning—
            <br className="hidden md:block" />
            building expertise through rigorous training and real-world application.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          <StatCard
            icon={GraduationCap}
            value={3}
            label="Educational Programs"
            suffix=""
            delay={0.2}
          />
          <StatCard
            icon={Award}
            value={4}
            label="Professional Certifications"
            suffix="+"
            delay={0.3}
          />
          <StatCard
            icon={Briefcase}
            value={25}
            label="Skills Validated"
            suffix="+"
            delay={0.4}
          />
        </div>

        {/* Timeline indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        >
          <div className="inline-flex flex-col items-center">
            <p className="text-sm text-text-3 mb-4">Scroll to explore my credentials</p>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="w-6 h-10 border-2 border-border-line rounded-full flex justify-center pt-2"
            >
              <div className="w-1.5 h-2 bg-brand-primary rounded-full" />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
