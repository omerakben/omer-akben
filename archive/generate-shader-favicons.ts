/**
 * Generate Favicon Script
 *
 * Creates static favicon files from shader blob screenshots.
 * Generates both light and dark theme variants using brightness modes.
 *
 * Output:
 * - public/favicon_light/ - Bright favicons (brightness +2)
 * - public/favicon_dark/ - Dark favicons (brightness -2)
 *
 * Sizes: 16x16, 32x32, 180x180 (apple), 192x192, 512x512, favicon.ico
 */

import { chromium } from '@playwright/test';
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import pngToIco from 'png-to-ico';

const DEV_SERVER_URL = process.env.DEV_SERVER_URL || 'http://localhost:3001';
const OUTPUT_DIR = join(process.cwd(), 'public');

// Favicon size configurations
const SIZES = {
  icon16: 16,
  icon32: 32,
  appleTouch: 180,
  android192: 192,
  android512: 512,
} as const;

// Brightness modes for light/dark favicons
const BRIGHTNESS_MODES = {
  light: '+2',  // Brighter for light theme
  dark: '-2',   // Darker for dark theme
} as const;

async function captureShaderBlob(
  url: string,
  brightness: string,
  size: number
): Promise<Buffer> {
  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: size, height: size },
  });

  try {
    // Navigate to page
    await page.goto(url, { waitUntil: 'networkidle' });

    // Set brightness mode
    await page.evaluate((mode) => {
      document.documentElement.setAttribute('data-brightness', mode);
    }, brightness);

    // Wait for shader to initialize and stabilize
    await page.waitForTimeout(2000);

    // Find shader blob (try navbar first since it's smaller, or use hero)
    const selector = 'header canvas, section canvas';
    const canvas = page.locator(selector).first();

    if (!(await canvas.isVisible())) {
      throw new Error('Shader blob canvas not found');
    }

    // Take screenshot of just the canvas element
    const screenshot = await canvas.screenshot({ type: 'png' });

    return screenshot;
  } finally {
    await browser.close();
  }
}

async function generateFavicon(
  screenshot: Buffer,
  size: number,
  outputPath: string
) {
  // Resize and optimize screenshot to target size
  await sharp(screenshot)
    .resize(size, size, {
      fit: 'cover',
      position: 'center',
    })
    .png({
      quality: 95,
      compressionLevel: 9,
    })
    .toFile(outputPath);

  console.log(`✓ Generated ${outputPath.split('/').pop()} (${size}x${size})`);
}

async function generateFaviconIco(
  screenshot: Buffer,
  outputPath: string
) {
  // Create multi-size ICO file (16x16, 32x32, 48x48)
  const sizes = [16, 32, 48];
  const buffers = await Promise.all(
    sizes.map((size) =>
      sharp(screenshot)
        .resize(size, size, { fit: 'cover', position: 'center' })
        .png()
        .toBuffer()
    )
  );

  // Generate true multi-size ICO file using png-to-ico
  const icoBuffer = await pngToIco(buffers);
  writeFileSync(outputPath, icoBuffer);

  console.log(`✓ Generated ${outputPath.split('/').pop()} (multi-size ICO: 16x16, 32x32, 48x48)`);
}

async function generateManifest(theme: 'light' | 'dark', outputPath: string) {
  const manifest = {
    name: 'Omer Akben Portfolio',
    short_name: 'OA Portfolio',
    icons: [
      {
        src: `/favicon_${theme}/android-chrome-192x192.png`,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: `/favicon_${theme}/android-chrome-512x512.png`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    theme_color: theme === 'light' ? '#ffffff' : '#000000',
    background_color: theme === 'light' ? '#ffffff' : '#000000',
    display: 'standalone',
  };

  writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
  console.log(`✓ Generated ${outputPath.split('/').pop()}`);
}

async function main() {
  console.log('🎨 Generating shader blob favicons...\n');

  // Check if dev server is running
  try {
    const response = await fetch(DEV_SERVER_URL);
    if (!response.ok) {
      throw new Error('Dev server not responding');
    }
  } catch (error) {
    console.error('❌ Dev server not running. Please start it with: npm run dev');
    process.exit(1);
  }

  // Generate favicons for both themes
  for (const [theme, brightness] of Object.entries(BRIGHTNESS_MODES)) {
    console.log(`\n📁 Generating ${theme} theme favicons (brightness ${brightness})...\n`);

    const outputThemeDir = join(OUTPUT_DIR, `favicon_${theme}`);
    mkdirSync(outputThemeDir, { recursive: true });

    // Capture base screenshot at high resolution
    const baseScreenshot = await captureShaderBlob(
      DEV_SERVER_URL,
      brightness,
      SIZES.android512
    );

    // Generate all favicon sizes
    await generateFavicon(
      baseScreenshot,
      SIZES.icon16,
      join(outputThemeDir, 'favicon-16x16.png')
    );

    await generateFavicon(
      baseScreenshot,
      SIZES.icon32,
      join(outputThemeDir, 'favicon-32x32.png')
    );

    await generateFavicon(
      baseScreenshot,
      SIZES.appleTouch,
      join(outputThemeDir, 'apple-touch-icon.png')
    );

    await generateFavicon(
      baseScreenshot,
      SIZES.android192,
      join(outputThemeDir, 'android-chrome-192x192.png')
    );

    await generateFavicon(
      baseScreenshot,
      SIZES.android512,
      join(outputThemeDir, 'android-chrome-512x512.png')
    );

    await generateFaviconIco(
      baseScreenshot,
      join(outputThemeDir, 'favicon.ico')
    );

    await generateManifest(
      theme as 'light' | 'dark',
      join(outputThemeDir, 'site.webmanifest')
    );
  }

  console.log('\n✅ All favicons generated successfully!');
  console.log('\n📝 Next steps:');
  console.log('  1. Verify favicons in public/favicon_light/ and public/favicon_dark/');
  console.log('  2. Test in browser (clear cache if needed)');
  console.log('  3. Check light/dark theme switching');
}

main().catch((error) => {
  console.error('❌ Error generating favicons:', error);
  process.exit(1);
});
