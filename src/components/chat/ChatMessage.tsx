import { AnimatedBlobContainer } from "@/components/animated-blob-container";
import {
  extractCollectContactMessage,
  extractNavigationLinks,
} from "@/lib/chat/message-utils";
import type { FollowupSuggestionType } from "@/lib/schemas/followup-schema";
import type { UIMessage } from "ai";
import {
  ArrowRight,
  Briefcase,
  ExternalLink,
  FileText,
  Github,
  Mail,
  User,
  Zap,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { memo } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FollowupChips } from "./FollowupChips";

// Icon mapping for navigation links
const getIconComponent = (iconName?: string) => {
  const iconMap: Record<string, React.ElementType> = {
    briefcase: Briefcase,
    github: Github,
    "external-link": ExternalLink,
    "arrow-right": ArrowRight,
    "file-text": FileText,
    zap: Zap,
    mail: Mail,
  };
  return iconMap[iconName || "arrow-right"] || ArrowRight;
};

interface ChatMessageProps {
  message: UIMessage;
  textContent: string;
  isLastAssistantMessage: boolean;
  isLoading: boolean;
  currentFollowups: FollowupSuggestionType[];
  onSuggestedQuestion: (question: string) => void;
  closeSidebar: () => void;
}

export const ChatMessage = memo(
  function ChatMessage({
    message,
    textContent,
    isLastAssistantMessage,
    isLoading,
    currentFollowups,
    onSuggestedQuestion,
    closeSidebar,
  }: ChatMessageProps) {
    const router = useRouter();

    // Extract data ONCE per message render (textContent is now provided as prop)
    const navigationLinks = extractNavigationLinks(message);
    const contactMessage = extractCollectContactMessage(message);

    const handleInternalNavigation = (href: string) => {
      closeSidebar();
      router.push(href);
    };

    return (
      <div key={message.id} className="space-y-2">
        <div
          className={`flex gap-3 ${
            message.role === "user" ? "justify-end" : "justify-start"
          }`}
        >
          {message.role === "assistant" && (
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center">
                <AnimatedBlobContainer
                  size={16}
                  className="rounded-full"
                  disableCenterDimming={true}
                  asIcon={true}
                />
              </div>
            </div>
          )}
          <div
            className={`chat-message max-w-[85%] rounded-lg px-4 py-3 text-sm ${
              message.role === "user"
                ? "bg-brand-primary text-white"
                : "bg-surf-1/95 border border-border-line/40 text-text-1 shadow-sm backdrop-blur-sm"
            }`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                a: ({ href, children }) => {
                  // Detect internal vs external links securely
                  const INTERNAL_HOSTNAMES = [
                    "omerakben.com",
                    "www.omerakben.com",
                  ];
                  let isInternal =
                    href?.startsWith("/") || href?.startsWith("#");

                  if (!isInternal && href) {
                    try {
                      const url = new URL(href, "https://omerakben.com");
                      isInternal = INTERNAL_HOSTNAMES.includes(url.hostname);
                    } catch {
                      // If URL parsing fails, treat as external
                      isInternal = false;
                    }
                  }

                  if (isInternal) {
                    // Internal link: Navigate in same window using <a> for accessibility
                    return (
                      <a
                        href={href}
                        onClick={(e) => {
                          e.preventDefault();
                          if (href) {
                            handleInternalNavigation(href);
                          }
                        }}
                        className={`font-medium transition-all duration-200 cursor-pointer ${
                          message.role === "user"
                            ? "text-white underline decoration-white/50 hover:decoration-white"
                            : "text-brand-primary no-underline hover:underline hover:decoration-brand-primary"
                        }`}
                      >
                        {children}
                      </a>
                    );
                  }

                  // External link: Open in new tab
                  return (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`font-medium transition-all duration-200 ${
                        message.role === "user"
                          ? "text-white underline decoration-white/50 hover:decoration-white"
                          : "text-brand-primary no-underline hover:underline hover:decoration-brand-primary"
                      }`}
                    >
                      {children}
                    </a>
                  );
                },
                p: ({ children }) => (
                  <p className="mb-4 last:mb-0 leading-[1.7] text-text-1">
                    {children}
                  </p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc ml-6 mb-4 space-y-2.5 marker:text-text-2">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal ml-6 mb-4 space-y-2.5 marker:text-text-2">
                    {children}
                  </ol>
                ),
                li: ({ children }) => (
                  <li className="pl-2 leading-[1.7] text-text-1">{children}</li>
                ),
                strong: ({ children }) => (
                  <strong className="font-semibold text-text-1">
                    {children}
                  </strong>
                ),
                h1: ({ children }) => (
                  <h1 className="text-[1.4em] font-bold mb-4 text-text-1 leading-[1.6]">
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-[1.2em] font-semibold mb-3 text-text-1 leading-[1.6]">
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-base font-semibold mb-2 text-text-2 leading-[1.6]">
                    {children}
                  </h3>
                ),
              }}
            >
              {textContent}
            </ReactMarkdown>

            {/* Navigation Links */}
            {message.role === "assistant" && navigationLinks.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {navigationLinks.map((link, linkIndex) => {
                  const Icon = getIconComponent(link.icon);
                  const isExternal = link.type === "external";

                  return (
                    <button
                      key={`${message.id}-link-${linkIndex}`}
                      type="button"
                      onClick={() => {
                        if (isExternal) {
                          window.open(
                            link.href,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        } else {
                          handleInternalNavigation(link.href);
                        }
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surf-2 border border-border-line text-xs text-text-2 hover:border-brand-primary/50 hover:text-text-1 hover:bg-surf-1 transition-all font-medium"
                    >
                      <div className="w-3.5 h-3.5 rounded-sm bg-brand-primary/10 flex items-center justify-center shrink-0">
                        <Icon
                          aria-hidden="true"
                          className="w-2.5 h-2.5 text-brand-primary"
                        />
                      </div>
                      <span>{link.label}</span>
                      {isExternal && (
                        <ExternalLink
                          aria-hidden="true"
                          className="w-2.5 h-2.5"
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Contact Collection Message */}
            {message.role === "assistant" && contactMessage && (
              <div className="mt-3 rounded-lg border border-brand-primary/30 bg-brand-primary/5 px-3 py-2 text-sm text-text-1">
                {contactMessage}
              </div>
            )}
          </div>
          {message.role === "user" && (
            <div className="shrink-0">
              <div className="w-8 h-8 rounded-full bg-surf-2 flex items-center justify-center">
                <User aria-hidden="true" className="w-4 h-4 text-text-2" />
              </div>
            </div>
          )}
        </div>

        {/* Dynamic follow-up questions after last assistant message */}
        {isLastAssistantMessage &&
          !isLoading &&
          currentFollowups.length > 0 && (
            <div className="ml-11 mt-3">
              <FollowupChips
                followups={currentFollowups}
                onSend={onSuggestedQuestion}
              />
            </div>
          )}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: only re-render if these specific props changed
    // Compare textContent (string) instead of message.parts (array reference)
    // This prevents unnecessary re-renders during streaming of OTHER messages
    return (
      prevProps.message.id === nextProps.message.id &&
      prevProps.textContent === nextProps.textContent &&
      prevProps.isLastAssistantMessage === nextProps.isLastAssistantMessage &&
      prevProps.isLoading === nextProps.isLoading &&
      prevProps.currentFollowups === nextProps.currentFollowups
    );
  }
);
