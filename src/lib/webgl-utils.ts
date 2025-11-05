/**
 * WebGL Utility Functions
 *
 * Helper functions for WebGL shader implementation with design system integration.
 * Provides color conversion, feature detection, and shader program creation.
 */

/**
 * Converts hex color to RGB float array (0.0-1.0 range) for WebGL uniforms
 *
 * @param hex - Hex color string (e.g., "#10b981" or "10b981")
 * @returns RGB array with values 0.0-1.0 [r, g, b]
 *
 * @example
 * hexToRgb("#10b981") // [0.063, 0.725, 0.506]
 */
export function hexToRgb(hex: string): [number, number, number] {
  // Remove # if present
  const cleanHex = hex.replace(/^#/, '');

  // Validate hex format (3 or 6 characters)
  if (!/^[0-9a-fA-F]{3}$|^[0-9a-fA-F]{6}$/.test(cleanHex)) {
    console.warn(`Invalid hex color format: ${hex}. Using fallback.`);
    return [0.063, 0.725, 0.506]; // Fallback to emerald green
  }

  // Handle 3-character shorthand (e.g., #abc -> #aabbcc)
  const fullHex = cleanHex.length === 3
    ? cleanHex.split('').map(c => c + c).join('')
    : cleanHex;

  // Parse RGB components
  const r = parseInt(fullHex.slice(0, 2), 16) / 255;
  const g = parseInt(fullHex.slice(2, 4), 16) / 255;
  const b = parseInt(fullHex.slice(4, 6), 16) / 255;

  return [r, g, b];
}

/**
 * Reads computed CSS custom property value from document root
 *
 * @param property - CSS custom property name (with or without --)
 * @returns Computed property value (trimmed)
 *
 * @example
 * getCssColorValue("--brand-primary") // "#10b981"
 * getCssColorValue("brand-primary")   // "#10b981"
 */
export function getCssColorValue(property: string): string {
  if (typeof window === 'undefined') return '';

  const propertyName = property.startsWith('--') ? property : `--${property}`;
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(propertyName)
    .trim();

  return value;
}

/**
 * Feature detection for WebGL support
 *
 * @returns true if WebGL is supported, false otherwise
 *
 * @example
 * if (isWebGLSupported()) {
 *   // Render shader component
 * } else {
 *   // Render fallback
 * }
 */
export function isWebGLSupported(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return gl !== null;
  } catch {
    return false;
  }
}

/**
 * Creates and compiles a WebGL shader
 *
 * @param gl - WebGL rendering context
 * @param type - Shader type (gl.VERTEX_SHADER or gl.FRAGMENT_SHADER)
 * @param source - GLSL shader source code
 * @returns Compiled shader or null on error
 */
function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

/**
 * Creates and links a WebGL shader program from vertex and fragment shaders
 *
 * @param gl - WebGL rendering context
 * @param vertexSource - GLSL vertex shader source
 * @param fragmentSource - GLSL fragment shader source
 * @returns Linked shader program or null on error
 *
 * @example
 * const program = createShaderProgram(gl, vertexShaderCode, fragmentShaderCode);
 * if (program) {
 *   gl.useProgram(program);
 * }
 */
export function createShaderProgram(
  gl: WebGLRenderingContext,
  vertexSource: string,
  fragmentSource: string
): WebGLProgram | null {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) {
    // Clean up any successfully created shader before returning
    if (vertexShader) gl.deleteShader(vertexShader);
    if (fragmentShader) gl.deleteShader(fragmentShader);
    return null;
  }

  const program = gl.createProgram();
  if (!program) {
    // Clean up shaders if program creation fails
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  // Shaders can be deleted after linking - they remain attached to the program
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program linking error:', gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

/**
 * Creates WebGL buffer from data array
 *
 * @param gl - WebGL rendering context
 * @param data - Float32Array or number array
 * @param target - Buffer target (gl.ARRAY_BUFFER or gl.ELEMENT_ARRAY_BUFFER)
 * @returns WebGL buffer or null on error
 */
export function createBuffer(
  gl: WebGLRenderingContext,
  data: Float32Array | Uint16Array,
  target: number = WebGLRenderingContext.ARRAY_BUFFER
): WebGLBuffer | null {
  const buffer = gl.createBuffer();
  if (!buffer) return null;

  gl.bindBuffer(target, buffer);
  gl.bufferData(target, data, gl.STATIC_DRAW);

  return buffer;
}

/**
 * Gets RGB color values from CSS custom properties for shader uniforms
 * Designed to work with the 8-mode brightness system
 *
 * @param brandProperty - CSS custom property for brand color (default: "--brand-primary")
 * @param accentProperty - CSS custom property for accent color (default: "--accent-primary")
 * @returns Object with brand and accent RGB arrays
 *
 * @example
 * const colors = getShaderColors();
 * gl.uniform3f(uBrandColorLocation, ...colors.brand);
 * gl.uniform3f(uAccentColorLocation, ...colors.accent);
 */
export function getShaderColors(
  brandProperty: string = '--brand-primary',
  accentProperty: string = '--accent-primary'
): { brand: [number, number, number]; accent: [number, number, number] } {
  const brandHex = getCssColorValue(brandProperty);
  const accentHex = getCssColorValue(accentProperty);

  return {
    brand: brandHex ? hexToRgb(brandHex) : [0.063, 0.725, 0.506], // Fallback: emerald
    accent: accentHex ? hexToRgb(accentHex) : [0.145, 0.388, 0.922], // Fallback: blue
  };
}

/**
 * Sets up a fullscreen quad for shader rendering
 *
 * @param gl - WebGL rendering context
 * @returns Object with position and texture coordinate buffers
 */
export function createFullscreenQuad(gl: WebGLRenderingContext): {
  position: WebGLBuffer | null;
  textureCoord: WebGLBuffer | null;
  indices: WebGLBuffer | null;
} {
  // Fullscreen quad vertices (-1 to 1 in clip space)
  const positions = new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
     1.0,  1.0,
    -1.0,  1.0,
  ]);

  // Texture coordinates (0 to 1)
  const textureCoords = new Float32Array([
    0.0, 0.0,
    1.0, 0.0,
    1.0, 1.0,
    0.0, 1.0,
  ]);

  // Triangle indices
  const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

  return {
    position: createBuffer(gl, positions, gl.ARRAY_BUFFER),
    textureCoord: createBuffer(gl, textureCoords, gl.ARRAY_BUFFER),
    indices: createBuffer(gl, indices, gl.ELEMENT_ARRAY_BUFFER),
  };
}
