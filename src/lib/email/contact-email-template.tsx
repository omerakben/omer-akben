import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Section,
  Text,
} from "@react-email/components";

interface ContactEmailProps {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export function ContactEmail({
  name,
  email,
  subject,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Section style={section}>
            <Text style={heading}>New Contact Form Message</Text>
            <Hr style={hr} />

            <Text style={label}>From:</Text>
            <Text style={value}>
              {name} ({email})
            </Text>

            <Text style={label}>Subject:</Text>
            <Text style={value}>{subject}</Text>

            <Text style={label}>Message:</Text>
            <Text style={messageStyle}>{message}</Text>

            <Hr style={hr} />

            <Text style={footer}>
              Reply directly to this email to respond to {name}.
            </Text>
            <Text style={footer}>
              Sent from{" "}
              <Link href="https://omerakben.com/contact" style={link}>
                omerakben.com
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
};

const section = {
  padding: "0 48px",
};

const heading = {
  fontSize: "24px",
  fontWeight: "600",
  color: "#1a1a1a",
  margin: "40px 0 20px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const label = {
  fontSize: "14px",
  fontWeight: "600",
  color: "#6b7280",
  margin: "16px 0 4px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
};

const value = {
  fontSize: "16px",
  color: "#1a1a1a",
  margin: "0 0 16px",
  lineHeight: "24px",
};

const messageStyle = {
  fontSize: "16px",
  color: "#1a1a1a",
  lineHeight: "28px",
  margin: "0 0 16px",
  padding: "16px",
  backgroundColor: "#f9fafb",
  borderRadius: "8px",
  whiteSpace: "pre-wrap" as const,
  wordBreak: "break-word" as const,
  overflowWrap: "break-word" as const,
  maxWidth: "100%",
};

const footer = {
  fontSize: "12px",
  color: "#6b7280",
  margin: "4px 0",
  lineHeight: "20px",
};

const link = {
  color: "#00FFC6",
  textDecoration: "none",
};
