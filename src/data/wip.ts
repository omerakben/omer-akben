export const WIP_STATUS_ROUTE = "/status";

export const wipBannerCopy = {
  neutral: {
    prefix: "Site under active development.",
    main: "Some features are still being built.",
  },
  playful: {
    prefix: "Still cooking.",
    main: "Some features are in the pan.",
  },
} as const;

export type WipCopyVariant = keyof typeof wipBannerCopy;
