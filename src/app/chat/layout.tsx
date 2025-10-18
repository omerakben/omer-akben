import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "AI Assistant Chat",
  description: "Chat with Ozzy, an AI assistant powered by GPT-4 that can help you learn more about Omer's experience, skills, and projects. Ask questions about his work or download his resume.",
  path: "/chat",
});

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
