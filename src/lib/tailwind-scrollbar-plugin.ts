import plugin from 'tailwindcss/plugin';

/**
 * Custom Scrollbar Plugin for omerakben.com
 *
 * Generates 4 utility classes for custom scrollbars with gradient effects:
 * - .scrollbar-vertical-gradient: Chat sidebar (vertical emerald→blue)
 * - .scrollbar-horizontal-gradient: Main content (horizontal blue→emerald)
 * - .scrollbar-modal-gradient: Project cards/modals (vertical, subtle)
 * - .scrollbar-none: Hide scrollbar
 *
 * Features:
 * - Automatic brightness mode adaptation via CSS custom properties
 * - WebKit scrollbar styling (Chrome, Safari, Edge)
 * - Firefox fallback with scrollbar-color and scrollbar-width
 * - Respects prefers-reduced-motion for accessibility
 * - Zero runtime cost, pure CSS
 */
export default plugin(function ({ addUtilities }) {
  addUtilities({
    /**
     * Vertical Gradient Scrollbar
     * Used in: Chat sidebar messages, chat sidebar textarea
     * Direction: Top (brand-primary) → Bottom (accent-primary)
     */
    '.scrollbar-vertical-gradient': {
      /* Firefox fallback */
      'scrollbar-width': 'thin',
      'scrollbar-color': 'var(--brand-primary) transparent',

      /* WebKit browsers (Chrome, Safari, Edge) */
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'radial-gradient(circle at 50% 0%, var(--brand-primary), var(--accent-primary))',
        borderRadius: '3px',
        transition: 'background 0.3s ease',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'radial-gradient(circle at 50% 0%, var(--accent-primary), var(--brand-primary))',
      },

      /* Respect reduced motion preference */
      '@media (prefers-reduced-motion: reduce)': {
        '&::-webkit-scrollbar-thumb': {
          transition: 'none',
        },
      },
    },

    /**
     * Horizontal Gradient Scrollbar
     * Used in: Main page content, wide containers
     * Direction: Left (accent-primary) → Right (brand-primary)
     */
    '.scrollbar-horizontal-gradient': {
      /* Firefox fallback */
      'scrollbar-width': 'thin',
      'scrollbar-color': 'var(--accent-primary) transparent',

      /* WebKit browsers */
      '&::-webkit-scrollbar': {
        width: '6px',
        height: '6px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'radial-gradient(circle at 0% 50%, var(--accent-primary), var(--brand-primary))',
        borderRadius: '3px',
        transition: 'background 0.3s ease',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'radial-gradient(circle at 0% 50%, var(--brand-primary), var(--accent-primary))',
      },

      /* Respect reduced motion preference */
      '@media (prefers-reduced-motion: reduce)': {
        '&::-webkit-scrollbar-thumb': {
          transition: 'none',
        },
      },
    },

    /**
     * Modal/Card Gradient Scrollbar
     * Used in: Project modals, cards with overflow content
     * Direction: Vertical, more subtle (uses surf colors with brand accent)
     */
    '.scrollbar-modal-gradient': {
      /* Firefox fallback */
      'scrollbar-width': 'thin',
      'scrollbar-color': 'var(--border-line) transparent',

      /* WebKit browsers */
      '&::-webkit-scrollbar': {
        width: '4px',
        height: '4px',
      },
      '&::-webkit-scrollbar-track': {
        background: 'transparent',
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'linear-gradient(180deg, var(--brand-primary) 0%, var(--border-line) 100%)',
        borderRadius: '2px',
        transition: 'background 0.3s ease',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        background: 'var(--brand-primary)',
      },

      /* Respect reduced motion preference */
      '@media (prefers-reduced-motion: reduce)': {
        '&::-webkit-scrollbar-thumb': {
          transition: 'none',
        },
      },
    },

    /**
     * Hidden Scrollbar
     * Used when: Scrollbar should be functional but invisible
     */
    '.scrollbar-none': {
      /* Firefox */
      'scrollbar-width': 'none',

      /* WebKit browsers */
      '&::-webkit-scrollbar': {
        display: 'none',
      },

      /* IE/Edge legacy */
      '-ms-overflow-style': 'none',
    },
  });
});
