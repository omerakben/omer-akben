# Streamdown API Reference

Complete TypeScript interface documentation for Streamdown v2.x.

## Table of Contents

1. [StreamdownProps](#streamdownprops)
2. [Plugin Interfaces](#plugin-interfaces)
3. [Configuration Types](#configuration-types)
4. [Component Types](#component-types)
5. [Utility Exports](#utility-exports)

---

## StreamdownProps

Main component props interface:

```typescript
interface StreamdownProps {
  // Content
  children?: string;

  // Rendering mode
  mode?: "static" | "streaming";
  isAnimating?: boolean;  // Shorthand for mode="streaming"

  // Plugins
  plugins?: PluginConfig;

  // Custom components
  components?: Components;
  BlockComponent?: React.ComponentType<BlockProps>;
  parseMarkdownIntoBlocksFn?: (markdown: string) => string[];

  // Configuration
  controls?: ControlsConfig;
  mermaid?: MermaidOptions;
  shikiTheme?: [BundledTheme, BundledTheme];
  linkSafety?: LinkSafetyConfig;
  remend?: RemendOptions;  // Incomplete markdown parser options

  // Features
  parseIncompleteMarkdown?: boolean;  // Default: true
  caret?: "block" | "circle";

  // Styling
  className?: string;

  // remark/rehype plugins (advanced)
  rehypePlugins?: PluggableList;
  remarkPlugins?: PluggableList;
  remarkRehypeOptions?: Readonly<RemarkRehypeOptions>;
}
```

---

## Plugin Interfaces

### PluginConfig

```typescript
interface PluginConfig {
  code?: CodeHighlighterPlugin;
  mermaid?: DiagramPlugin;
  math?: MathPlugin;
  cjk?: CjkPlugin;
}
```

### CodeHighlighterPlugin

```typescript
interface CodeHighlighterPlugin {
  name: "shiki";
  type: "code-highlighter";

  highlight: (
    options: HighlightOptions,
    callback?: (result: HighlightResult) => void
  ) => HighlightResult | null;

  supportsLanguage: (language: BundledLanguage) => boolean;
  getSupportedLanguages: () => BundledLanguage[];
  getThemes: () => [BundledTheme, BundledTheme];
}

interface HighlightOptions {
  code: string;
  language: BundledLanguage;
  themes: [string, string];
}

interface HighlightResult {
  tokens: HighlightToken[][];
  fg?: string;
  bg?: string;
}

interface HighlightToken {
  content: string;
  color?: string;
  bgColor?: string;
  htmlStyle?: Record<string, string>;
  htmlAttrs?: Record<string, string>;
  offset?: number;
}

// Factory function
interface CodePluginOptions {
  themes?: [BundledTheme, BundledTheme];  // Default: ["github-light", "github-dark"]
}
function createCodePlugin(options?: CodePluginOptions): CodeHighlighterPlugin;

// Pre-configured instance
const code: CodeHighlighterPlugin;
```

### DiagramPlugin (Mermaid)

```typescript
interface DiagramPlugin {
  name: "mermaid";
  type: "diagram";
  language: string;  // "mermaid"
  getMermaid: (config?: MermaidConfig) => MermaidInstance;
}

interface MermaidInstance {
  initialize: (config: MermaidConfig) => void;
  render: (id: string, source: string) => Promise<{ svg: string }>;
}

// Factory function
interface MermaidPluginOptions {
  config?: MermaidConfig;
}
function createMermaidPlugin(options?: MermaidPluginOptions): DiagramPlugin;

// Pre-configured instance
const mermaid: DiagramPlugin;
```

### MathPlugin (KaTeX)

```typescript
interface MathPlugin {
  name: "katex";
  type: "math";
  remarkPlugin: Pluggable;  // remark-math
  rehypePlugin: Pluggable;  // rehype-katex
  getStyles?: () => string;
}

// Factory function
interface MathPluginOptions {
  singleDollarTextMath?: boolean;  // Default: false
  errorColor?: string;             // Default: "var(--color-muted-foreground)"
}
function createMathPlugin(options?: MathPluginOptions): MathPlugin;

// Pre-configured instance
const math: MathPlugin;
```

### CjkPlugin

```typescript
interface CjkPlugin {
  name: "cjk";
  type: "cjk";
  remarkPluginsBefore: Pluggable[];  // Run before remarkGfm
  remarkPluginsAfter: Pluggable[];   // Run after remarkGfm
  remarkPlugins: Pluggable[];        // @deprecated
}

function createCjkPlugin(): CjkPlugin;
const cjk: CjkPlugin;
```

---

## Configuration Types

### ControlsConfig

```typescript
type ControlsConfig = boolean | {
  table?: boolean;
  code?: boolean;
  mermaid?: boolean | {
    download?: boolean;
    copy?: boolean;
    fullscreen?: boolean;
    panZoom?: boolean;
  };
};
```

### MermaidOptions

```typescript
interface MermaidOptions {
  config?: MermaidConfig;  // From 'mermaid' package
  errorComponent?: React.ComponentType<MermaidErrorComponentProps>;
}

interface MermaidErrorComponentProps {
  error: string;
  chart: string;
  retry: () => void;
}
```

### LinkSafetyConfig

```typescript
interface LinkSafetyConfig {
  enabled: boolean;
  onLinkCheck?: (url: string) => Promise<boolean> | boolean;
  renderModal?: (props: LinkSafetyModalProps) => React.ReactNode;
}

interface LinkSafetyModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}
```

---

## Component Types

### Components

React component overrides for Markdown elements:

```typescript
interface ExtraProps {
  node?: Element | undefined;  // HAST element
}

type Components = {
  [Key in keyof JSX.IntrinsicElements]?:
    | ComponentType<JSX.IntrinsicElements[Key] & ExtraProps>
    | keyof JSX.IntrinsicElements;
};
```

Common overrides:

- `code` - Inline/block code
- `pre` - Code block wrapper
- `a` - Links
- `table`, `th`, `td`, `tr` - Table elements
- `h1`, `h2`, `h3`, etc. - Headings
- `ul`, `ol`, `li` - Lists
- `blockquote` - Block quotes
- `mark` - Highlighted text
- `img` - Images

### BlockProps

For custom block rendering:

```typescript
interface BlockProps extends Options {
  content: string;
  shouldParseIncompleteMarkdown: boolean;
  index: number;
}
```

---

## Utility Exports

### parseMarkdownIntoBlocks

Split markdown into logical blocks for streaming:

```typescript
function parseMarkdownIntoBlocks(markdown: string): string[];
```

### Context

```typescript
interface StreamdownContextType {
  shikiTheme: [BundledTheme, BundledTheme];
  controls: ControlsConfig;
  isAnimating: boolean;
  mode: "static" | "streaming";
  mermaid?: MermaidOptions;
  linkSafety?: LinkSafetyConfig;
}

const StreamdownContext: React.Context<StreamdownContextType>;
```

### Default Plugins

```typescript
const defaultRehypePlugins: Record<string, Pluggable>;
const defaultRemarkPlugins: Record<string, Pluggable>;
```

### Caret Styles

```typescript
const carets: {
  block: string;   // CSS class for block cursor
  circle: string;  // CSS class for circle cursor
};
```

---

## Import Patterns

```typescript
// Main component
import { Streamdown } from "streamdown";

// Types
import type {
  StreamdownProps,
  Components,
  PluginConfig,
  ControlsConfig,
  MermaidOptions,
  LinkSafetyConfig,
  CodeHighlighterPlugin,
  DiagramPlugin,
  MathPlugin,
  CjkPlugin,
  HighlightOptions,
  HighlightResult,
  MermaidErrorComponentProps,
  LinkSafetyModalProps,
} from "streamdown";

// Plugins
import { code, createCodePlugin } from "@streamdown/code";
import { mermaid, createMermaidPlugin } from "@streamdown/mermaid";
import { math, createMathPlugin } from "@streamdown/math";
import { cjk, createCjkPlugin } from "@streamdown/cjk";

// Re-exported from shiki
import type { BundledLanguage, BundledTheme } from "streamdown";
```
