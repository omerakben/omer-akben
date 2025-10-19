/**
 * Icon Manifest - Lightweight icon registry
 *
 * This file provides access to the generated icon manifest which contains
 * only the icons we actually use (42 icons vs 3000+), reducing bundle size
 * from 2.3MB to ~126KB.
 *
 * Icons are generated at build time from simple-icons SVG files.
 * Run `npm run generate:icons` to regenerate.
 */

import {
  getIconBySlug as getGeneratedIcon,
  getAvailableIcons as getGeneratedIcons,
  type SimpleIcon
} from './icon-manifest-generated';

/**
 * Type-safe icon lookup function
 * Returns icon data with SVG and path information
 */
export function getIconBySlug(slug: string): SimpleIcon | null {
  return getGeneratedIcon(slug);
}

/**
 * Get all available icon slugs
 */
export function getAvailableIcons(): string[] {
  return getGeneratedIcons();
}
