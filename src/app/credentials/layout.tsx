import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Credentials & Education",
  description:
    "AWS Cloud Practitioner Essentials certified, Nashville Software School graduate with Full-Stack Web Development certification. Continuous learner in AI/ML technologies.",
  path: "/credentials",
});

export default function CredentialsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
