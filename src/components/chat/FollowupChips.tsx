'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface FollowupChipsProps {
  /**
   * Array of follow-up question strings to display
   */
  followups: string[];
  /**
   * Callback to send the selected question
   */
  onSend: (question: string) => void;
  /**
   * Optional className for container styling
   */
  className?: string;
}

/**
 * FollowupChips Component
 *
 * Displays 2 dynamic follow-up questions after each assistant message.
 * Features:
 * - Auto-send on click
 * - Framer Motion entrance animation
 * - Full keyboard navigation support
 * - ARIA compliant for screen readers
 */
export function FollowupChips({ followups, onSend, className = '' }: FollowupChipsProps) {
  if (!followups || followups.length === 0) {
    return null;
  }

  const handleClick = (question: string) => {
    onSend(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, question: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSend(question);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex flex-col gap-2 ${className}`}
      role="group"
      aria-label="Suggested follow-up questions"
    >
      {/* Header */}
      <div className="flex items-center gap-1.5 text-text-2 text-xs">
        <Sparkles className="w-3.5 h-3.5" />
        <span>Continue the conversation:</span>
      </div>

      {/* Chips */}
      <div className="flex flex-col gap-2">
        {followups.map((question, index) => (
          <motion.button
            key={`${question}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.2,
              delay: index * 0.1,
              ease: 'easeOut'
            }}
            onClick={() => handleClick(question)}
            onKeyDown={(e) => handleKeyDown(e, question)}
            className="group relative flex items-start gap-2 px-4 py-3 rounded-lg
                     bg-surf-1 hover:bg-surf-2
                     border border-border-line hover:border-brand-primary/50
                     text-text-1 text-sm text-left
                     transition-all duration-200
                     focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 focus:ring-offset-surf-0"
            aria-label={`Send follow-up question: ${question}`}
            type="button"
          >
            {/* Chip number indicator */}
            <span className="flex-shrink-0 mt-0.5 w-5 h-5 flex items-center justify-center
                           rounded-full bg-brand-primary/10 text-brand-primary text-xs font-medium
                           group-hover:bg-brand-primary group-hover:text-surf-0
                           transition-colors duration-200">
              {index + 1}
            </span>

            {/* Question text */}
            <span className="flex-1 leading-relaxed">
              {question}
            </span>

            {/* Hover indicator */}
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-brand-primary opacity-0 group-hover:opacity-20 pointer-events-none"
              initial={false}
              transition={{ duration: 0.2 }}
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}
