# Streamdown Implementation Patterns

Patterns and best practices derived from production usage in Elon AI project.

## Table of Contents

- [Streamdown Implementation Patterns](#streamdown-implementation-patterns)
  - [Table of Contents](#table-of-contents)
  - [Error Boundary Pattern](#error-boundary-pattern)
  - [Lazy Loading Pattern](#lazy-loading-pattern)
  - [Custom Mermaid Theming](#custom-mermaid-theming)
  - [Fallback Component Pattern](#fallback-component-pattern)
  - [Post-Stream Content Cleanup](#post-stream-content-cleanup)
  - [Responsive Table Pattern](#responsive-table-pattern)
  - [External Link Handling](#external-link-handling)
  - [Brand-Styled Components](#brand-styled-components)
  - [Container Styling](#container-styling)

---

## Error Boundary Pattern

Wrap Streamdown in an error boundary to gracefully handle crashes from malformed content:

```tsx
interface StreamdownErrorBoundaryProps {
  children: ReactNode;
  fallbackContent: string;
  fallbackClassName?: string;
}

interface StreamdownErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class StreamdownErrorBoundary extends Component<
  StreamdownErrorBoundaryProps,
  StreamdownErrorBoundaryState
> {
  constructor(props: StreamdownErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): StreamdownErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[StreamdownErrorBoundary] Render failed:", {
      error: error.message,
      componentStack: errorInfo.componentStack?.slice(0, 500),
    });
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <pre
          className={cn(
            "whitespace-pre-wrap break-words text-foreground text-sm font-sans",
            this.props.fallbackClassName
          )}
        >
          {this.props.fallbackContent}
        </pre>
      );
    }
    return this.props.children;
  }
}
```

**Common failure cases:**

- Malformed mermaid diagrams with invalid syntax
- Deeply nested/recursive markdown structures
- Invalid HTML tags that break react-markdown
- Memory pressure from extremely long content

---

## Lazy Loading Pattern

Reduce initial bundle size with React.lazy:

```tsx
import { lazy, Suspense } from "react";
import type { StreamdownContentProps } from "./streamdown-content";

const StreamdownContent = lazy(() =>
  import("./streamdown-content").then((mod) => ({
    default: mod.StreamdownContent,
  }))
);

function StreamdownFallback({
  content,
  className,
}: Pick<StreamdownContentProps, "content" | "className">) {
  return (
    <div
      className={cn(
        "whitespace-pre-wrap break-words text-foreground text-sm",
        className
      )}
    >
      {content}
    </div>
  );
}

export function LazyStreamdownContent(props: StreamdownContentProps) {
  return (
    <Suspense
      fallback={
        <StreamdownFallback
          className={props.className}
          content={props.content}
        />
      }
    >
      <StreamdownContent {...props} />
    </Suspense>
  );
}
```

---

## Mermaid Error Fallback (v2)

Handle Mermaid diagram parse failures gracefully with a custom error component:

```tsx
import type { MermaidErrorComponentProps } from "streamdown";

function MermaidErrorFallback({
  error,
  chart,
  retry,
}: MermaidErrorComponentProps) {
  return (
    <div className="my-4 rounded-lg border border-destructive/50 bg-destructive/10 p-4">
      <div className="mb-2 flex items-center gap-2">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-destructive/20 text-destructive text-xs">
          !
        </span>
        <span className="font-medium text-destructive text-sm">
          Diagram Error
        </span>
      </div>
      <p className="mb-3 text-muted-foreground text-xs">{error}</p>
      <div className="flex gap-2">
        <button
          className="rounded bg-primary/10 px-3 py-1.5 text-primary text-xs"
          onClick={retry}
          type="button"
        >
          Retry
        </button>
        <details className="text-xs">
          <summary className="cursor-pointer text-muted-foreground">
            Show source
          </summary>
          <pre className="mt-2 max-h-32 overflow-auto rounded bg-muted p-2 font-mono text-[10px]">
            {chart}
          </pre>
        </details>
      </div>
    </div>
  );
}

<Streamdown
  plugins={{ mermaid: mermaidPlugin }}
  mermaid={{
    config: mermaidConfig,
    errorComponent: MermaidErrorFallback,
  }}
>
  {content}
</Streamdown>
```

---

## Remend Configuration (v2)

Enable automatic incomplete markdown healing during streaming:

```tsx
<Streamdown
  plugins={{ code, mermaid, math }}
  isAnimating={isStreaming}
  remend={{
    bold: true,        // Heal incomplete **bold**
    italic: true,      // Heal incomplete *italic*
    links: true,       // Heal incomplete [links](url)
    images: true,      // Heal incomplete ![images](url)
    inlineCode: true,  // Heal incomplete `code`
    strikethrough: true, // Heal incomplete ~~strike~~
  }}
>
  {content}
</Streamdown>
```

**Note:** When `remend` is configured, the manual `processedContent` cleanup pattern (above) becomes less necessary, as Streamdown v2 handles incomplete markdown automatically.

---

## Custom Mermaid Theming

Mermaid requires actual hex values, NOT CSS variables:

```tsx
import type { MermaidConfig } from "mermaid";

// Brand-themed Mermaid config
const mermaidConfig: MermaidConfig = {
  theme: "base",
  themeVariables: {
    // MUST use hex values - Mermaid generates inline SVG styles
    primaryColor: "#73000a",        // maroon
    primaryTextColor: "#ffffff",
    primaryBorderColor: "#5a0c1a",  // darker maroon
    lineColor: "#73000a",
    secondaryColor: "#f5f5f5",
    tertiaryColor: "#ffffff",
    fontSize: "14px",
  },
};

<Streamdown
  plugins={{ mermaid: mermaidPlugin }}
  mermaid={{ config: mermaidConfig }}
>
  {content}
</Streamdown>
```

---

## Fallback Component Pattern

Handle custom XML tags that AI might output when GenUI is disabled:

```tsx
function FallbackTag({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

const fallbackComponents: Record<string, typeof FallbackTag> = {
  // Common conversational tags
  child: FallbackTag,
  login: FallbackTag,
  profile: FallbackTag,
  user: FallbackTag,
  assistant: FallbackTag,
  system: FallbackTag,
  message: FallbackTag,
  context: FallbackTag,
  example: FallbackTag,
  note: FallbackTag,
  warning: FallbackTag,
  tip: FallbackTag,
  info: FallbackTag,

  // GenUI tags (if tools output raw XML)
  suggest_follow_up_actions: FallbackTag,
  suggest_related: FallbackTag,
  generate_quiz: FallbackTag,
  create_flashcards: FallbackTag,
};

<Streamdown components={{ ...fallbackComponents, ...customComponents }}>
  {content}
</Streamdown>
```

---

## Post-Stream Content Cleanup

Clean up incomplete markdown markers when streaming ends:

```tsx
const processedContent = useMemo(() => {
  if (!content?.trim()) return "";
  if (isStreaming) return content;

  let cleaned = content;

  // Fix malformed nested bold: "**prefix **keyword**:" → "**prefix keyword**:"
  // This happens when AI tries to emphasize a keyword within already-bold text
  cleaned = cleaned.replace(/\*\*([^*]+)\s\*\*(\w+)\*\*(:?)/g, "**$1 $2**$3");

  // Remove trailing incomplete bold/italic markers
  cleaned = cleaned.replace(/\s*\*{1,2}\s*$/, "");

  // Fix "word**:" pattern where opening ** was lost
  cleaned = cleaned.replace(/(\s)(\w+)\*\*:/g, "$1**$2**:");

  // Remove orphaned lone ** not part of a pair
  const boldMatches = cleaned.match(/\*\*/g);
  if (boldMatches && boldMatches.length % 2 !== 0) {
    cleaned = cleaned.replace(/\*\*(\s*)$/, "$1");
  }

  return cleaned;
}, [content, isStreaming]);
```

---

## Responsive Table Pattern

Make tables mobile-friendly with horizontal scroll:

```tsx
const components: Components = {
  table({ children, ...props }) {
    return (
      <div className="my-4 overflow-x-auto rounded-lg border border-border shadow-sm">
        <table
          className="min-w-full divide-y divide-border [&_td:first-child]:pl-5 [&_th:first-child]:pl-5"
          {...props}
        >
          {children}
        </table>
      </div>
    );
  },

  th({ children, ...props }) {
    return (
      <th
        className="whitespace-nowrap bg-maroon/5 px-4 py-3 text-left font-semibold text-foreground text-sm dark:bg-maroon/20"
        {...props}
      >
        {children}
      </th>
    );
  },

  td({ children, ...props }) {
    return (
      <td
        className="whitespace-normal px-4 py-3 text-muted-foreground text-sm"
        {...props}
      >
        {children}
      </td>
    );
  },

  tr({ children, ...props }) {
    return (
      <tr className="transition-colors hover:bg-muted" {...props}>
        {children}
      </tr>
    );
  },
};
```

---

## External Link Handling

Safe external link pattern with target="_blank":

```tsx
const components: Components = {
  a({ href, children, ...props }) {
    const isExternal = href?.startsWith("http");
    return (
      <a
        className="break-all text-primary underline underline-offset-2 transition-colors hover:text-primary/80"
        href={href}
        rel={isExternal ? "noopener noreferrer" : undefined}
        target={isExternal ? "_blank" : undefined}
        {...props}
      >
        {children}
      </a>
    );
  },
};
```

---

## Brand-Styled Components

Complete component override set with Elon brand styling:

```tsx
const components: Components = {
  // Code blocks
  code({ className, children, ...props }) {
    const match = className?.match(/language-(\w+)/);
    const language = match ? match[1] : null;

    if (language === "mermaid") return null; // Handled by plugin

    if (!language) {
      return (
        <code
          className="rounded bg-primary/5 px-1.5 py-0.5 font-mono text-primary text-sm"
          {...props}
        >
          {children}
        </code>
      );
    }

    return (
      <LazySyntaxHighlighter
        customStyle={{
          margin: "0.75rem 0",
          borderRadius: "0.5rem",
          fontSize: "0.8125rem",
          lineHeight: "1.5",
        }}
        language={language}
        PreTag="div"
        wrapLines
        wrapLongLines
      >
        {String(children).replace(/\n$/, "")}
      </LazySyntaxHighlighter>
    );
  },

  pre({ children }) {
    return <>{children}</>;
  },

  mark({ children, ...props }) {
    return (
      <mark
        className="rounded bg-gold/20 px-1 text-foreground dark:bg-gold/30 dark:text-foreground"
        {...props}
      >
        {children}
      </mark>
    );
  },

  blockquote({ children, ...props }) {
    return (
      <blockquote
        className="my-4 border-maroon border-l-4 bg-maroon/5 py-2 pr-4 pl-4 text-muted-foreground italic dark:bg-maroon/20"
        {...props}
      >
        {children}
      </blockquote>
    );
  },

  h1({ children, ...props }) {
    return (
      <h1
        className="mt-6 mb-3 font-bold text-2xl text-maroon dark:text-primary"
        {...props}
      >
        {children}
      </h1>
    );
  },

  h2({ children, ...props }) {
    return (
      <h2
        className="mt-5 mb-2 font-semibold text-maroon text-xl dark:text-primary"
        {...props}
      >
        {children}
      </h2>
    );
  },

  h3({ children, ...props }) {
    return (
      <h3
        className="mt-4 mb-2 font-semibold text-foreground text-lg"
        {...props}
      >
        {children}
      </h3>
    );
  },

  ul({ children, ...props }) {
    return (
      <ul className="my-2 ml-4 list-disc space-y-1" {...props}>
        {children}
      </ul>
    );
  },

  ol({ children, ...props }) {
    return (
      <ol className="my-2 ml-4 list-decimal space-y-1" {...props}>
        {children}
      </ol>
    );
  },
};
```

---

## Container Styling

Prose container with Tailwind Typography:

```tsx
<div
  className={cn(
    // Base prose styling
    "prose prose-sm dark:prose-invert max-w-none",
    // Mobile overflow handling
    "break-words",
    // Better spacing
    "prose-p:my-1 prose-p:leading-relaxed",
    // Strong text
    "prose-strong:font-semibold prose-strong:text-foreground",
    // Horizontal rules
    "prose-hr:my-4 prose-hr:border-border",
    className
  )}
>
  <Streamdown {...props}>{content}</Streamdown>
</div>
```
