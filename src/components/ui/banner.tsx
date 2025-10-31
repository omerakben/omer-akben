import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

const bannerVariants = cva(
  "relative w-full border-b px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-text-1 [&>svg~*]:pl-7",
  {
    variants: {
      variant: {
        default: "bg-surf-1 text-text-1 border-border-line",
        info: "bg-brand-primary/10 text-text-1 border-brand-primary/30",
        warning:
          "bg-yellow-500/10 text-text-1 border-yellow-500/30 dark:bg-yellow-400/10 dark:border-yellow-400/30",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  onDismiss?: () => void;
  showDismiss?: boolean;
}

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    { className, variant, onDismiss, showDismiss = true, children, ...props },
    ref
  ) => (
    <div
      ref={ref}
      role="banner"
      className={cn(bannerVariants({ variant }), className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">{children}</div>
        {showDismiss && onDismiss && (
          <button
            onClick={onDismiss}
            className="shrink-0 rounded-sm opacity-70 ring-offset-surf-0 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            aria-label="Dismiss banner"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
);
Banner.displayName = "Banner";

const BannerTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-1 font-medium leading-none tracking-tight", className)}
    {...props}
  />
));
BannerTitle.displayName = "BannerTitle";

const BannerDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
));
BannerDescription.displayName = "BannerDescription";

export { Banner, BannerDescription, BannerTitle };
