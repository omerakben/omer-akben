/**
 * Shader Blob Component
 *
 * WebGL-powered animated blob using ray marching technique (Ether shader).
 * Integrates with 8-mode brightness system via CSS custom properties.
 * Colors dynamically update based on --brand-primary and --accent-primary tokens.
 *
 * Based on "Ether" by nimitz (https://www.shadertoy.com/view/MsjSW3)
 * License: CC BY-NC-SA 3.0
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import {
  createShaderProgram,
  createFullscreenQuad,
  getShaderColors,
} from '@/lib/webgl-utils';

interface ShaderBlobProps {
  /** Size of the canvas in pixels */
  size?: number;
  /** Click handler for interaction */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Disable center dimming effect */
  disableCenterDimming?: boolean;
}

// Vertex shader - standard fullscreen quad
const VERTEX_SHADER = `
  attribute vec4 aVertexPosition;
  attribute vec2 aTextureCoord;
  varying vec2 vTextureCoord;

  void main() {
    gl_Position = aVertexPosition;
    vTextureCoord = aTextureCoord;
  }
`;

// Fragment shader - Ether effect with dynamic color uniforms
const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform vec2 iMouse;
  uniform vec3 uBrandColor;
  uniform vec3 uAccentColor;
  uniform bool disableCenterDimming;
  varying vec2 vTextureCoord;

  #define t iTime
  mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}

  float map(vec3 p){
      p.xz*= m(t*0.4);p.xy*= m(t*0.3);
      vec3 q = p*2.+t;
      return length(p+vec3(sin(t*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
  }

  void mainImage(out vec4 fragColor, in vec2 fragCoord) {
      // Calculate aspect-corrected UV coordinates
      vec2 p = fragCoord.xy/min(iResolution.x, iResolution.y) - vec2(.9, .5);
      p.x += 0.4;

      vec3 cl = vec3(0.);
      float d = 2.5;

      // Ray marching loop
      for(int i=0; i<=5; i++) {
          vec3 p3d = vec3(0,0,5.) + normalize(vec3(p, -1.))*d;
          float rz = map(p3d);
          float f = clamp((rz - map(p3d+.1))*0.5, -.1, 1.);

          // Dynamic color blending using uniforms
          vec3 baseColor = mix(uBrandColor, uAccentColor, f * 0.5);
          vec3 highlightColor = uAccentColor * vec3(3.0, 2.0, 2.5);

          cl = cl*baseColor + smoothstep(2.5, .0, rz)*.7*highlightColor;
          d += min(rz, 1.);
      }

      // Mouse interaction
      float mouseInfluence = 0.0;
      if(iMouse.x > 0.0 || iMouse.y > 0.0) {
          vec2 mousePos = iMouse.xy;
          float mouseDist = length(p - (mousePos*2.0-vec2(1.0))*0.5);
          mouseInfluence = smoothstep(0.6, 0.0, mouseDist);
          cl += uAccentColor * mouseInfluence * 0.3;
      }

      fragColor = vec4(cl, 1.0);

      // Center dimming
      vec2 center = iResolution.xy * 0.5;
      float dist = distance(fragCoord, center);
      float radius = min(iResolution.x, iResolution.y) * 0.5;
      float centerDim = disableCenterDimming ? 1.0 : smoothstep(radius * 0.3, radius * 0.5, dist);

      if (!disableCenterDimming) {
          fragColor.rgb = mix(fragColor.rgb * 0.3, fragColor.rgb, centerDim);
      }
  }

  void main() {
      vec2 fragCoord = vTextureCoord * iResolution;
      vec2 center = iResolution * 0.5;
      float dist = distance(fragCoord, center);
      float radius = min(iResolution.x, iResolution.y) * 0.5;

      if (dist < radius) {
          vec4 color;
          mainImage(color, fragCoord);
          gl_FragColor = color;
      } else {
          discard;
      }
  }
`;

export function ShaderBlob({
  size = 300,
  onClick,
  className,
  disableCenterDimming = false,
}: ShaderBlobProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const mousePositionRef = useRef<[number, number]>([0.5, 0.5]);
  const programInfoRef = useRef<{
    program: WebGLProgram;
    attribLocations: { vertexPosition: number; textureCoord: number };
    uniformLocations: Record<string, WebGLUniformLocation | null>;
  } | null>(null);
  const startTimeRef = useRef<number>(Date.now());
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = useRef(false);

  // Track mouse position
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    mousePositionRef.current = [x, y];
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    mousePositionRef.current = [0.5, 0.5];
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    reducedMotion.current = mediaQuery.matches;

    const gl = canvas.getContext('webgl');
    if (!gl) {
      console.error('WebGL not supported');
      return;
    }

    // Initialize shader program
    const shaderProgram = createShaderProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER);
    if (!shaderProgram) return;

    programInfoRef.current = {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
      },
      uniformLocations: {
        iResolution: gl.getUniformLocation(shaderProgram, 'iResolution'),
        iTime: gl.getUniformLocation(shaderProgram, 'iTime'),
        iMouse: gl.getUniformLocation(shaderProgram, 'iMouse'),
        uBrandColor: gl.getUniformLocation(shaderProgram, 'uBrandColor'),
        uAccentColor: gl.getUniformLocation(shaderProgram, 'uAccentColor'),
        disableCenterDimming: gl.getUniformLocation(shaderProgram, 'disableCenterDimming'),
      },
    };

    // Create fullscreen quad buffers
    const buffers = createFullscreenQuad(gl);

    // Set canvas size
    canvas.width = size;
    canvas.height = size;
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Get initial colors from design tokens
    let colors = getShaderColors();

    // Observer for brightness mode changes
    const observer = new MutationObserver(() => {
      colors = getShaderColors();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-brightness'],
    });

    // Render function
    const render = () => {
      if (!gl || !programInfoRef.current) return;

      const currentTime = reducedMotion.current ? 0 : (Date.now() - startTimeRef.current) / 1000;
      const mousePos = mousePositionRef.current;

      // Clear and setup
      gl.clearColor(0.0, 0.0, 0.0, 0.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.useProgram(programInfoRef.current.program);

      // Set uniforms
      gl.uniform2f(programInfoRef.current.uniformLocations.iResolution, canvas.width, canvas.height);
      gl.uniform1f(programInfoRef.current.uniformLocations.iTime, currentTime);
      gl.uniform2f(programInfoRef.current.uniformLocations.iMouse, mousePos[0], mousePos[1]);
      gl.uniform3f(programInfoRef.current.uniformLocations.uBrandColor, ...colors.brand);
      gl.uniform3f(programInfoRef.current.uniformLocations.uAccentColor, ...colors.accent);
      gl.uniform1i(programInfoRef.current.uniformLocations.disableCenterDimming, disableCenterDimming ? 1 : 0);

      // Set vertex attributes
      if (buffers.position) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
        gl.vertexAttribPointer(
          programInfoRef.current.attribLocations.vertexPosition,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );
        gl.enableVertexAttribArray(programInfoRef.current.attribLocations.vertexPosition);
      }

      if (buffers.textureCoord) {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
        gl.vertexAttribPointer(
          programInfoRef.current.attribLocations.textureCoord,
          2,
          gl.FLOAT,
          false,
          0,
          0
        );
        gl.enableVertexAttribArray(programInfoRef.current.attribLocations.textureCoord);
      }

      // Draw
      if (buffers.indices) {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationRef.current);
      observer.disconnect();
      if (gl && shaderProgram) {
        gl.deleteProgram(shaderProgram);
      }
      if (buffers.position) gl.deleteBuffer(buffers.position);
      if (buffers.textureCoord) gl.deleteBuffer(buffers.textureCoord);
      if (buffers.indices) gl.deleteBuffer(buffers.indices);
    };
  }, [size, disableCenterDimming]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'rounded-full transition-transform duration-300',
        'cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2',
        className
      )}
      style={{
        width: size,
        height: size,
        transform: isHovered ? 'scale(1.03)' : 'scale(1)',
        boxShadow: isHovered ? '0 0 30px rgba(255, 255, 255, 0.2)' : 'none',
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      role="button"
      tabIndex={0}
      aria-label="Open Ozzy AI Assistant"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
    />
  );
}
