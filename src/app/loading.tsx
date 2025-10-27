/**
 * Loading Component
 *
 * Displays a loading state while pages are being server-rendered.
 * Uses brand colors and brightness-aware styling.
 */
export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="space-y-6 text-center">
        {/* Animated spinner */}
        <div className="relative w-16 h-16 mx-auto">
          <div className="absolute inset-0 border-4 border-border-line rounded-full" />
          <div className="absolute inset-0 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>

        {/* Loading text */}
        <div className="space-y-2">
          <p className="text-lg font-semibold text-text-1">Loading...</p>
          <p className="text-sm text-text-3">Please wait a moment</p>
        </div>
      </div>
    </div>
  );
}
