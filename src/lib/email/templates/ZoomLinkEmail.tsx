import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface ZoomLinkEmailProps {
  name: string;
  company?: string;
  conversationNotes?: string;
  zoomLink: string;
}

export const ZoomLinkEmail = ({
  name,
  company,
  conversationNotes,
  zoomLink,
}: ZoomLinkEmailProps) => {
  const myEmail = process.env.OMER_EMAIL || 'me@omerakben.com';

  return (
    <Html>
      <Head />
      <Preview>Let&apos;s connect! Here&apos;s my Zoom link - Omer Akben</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Hi {name}!</Heading>

          <Text style={text}>
            Thanks for exploring my portfolio and chatting with Ozzy! I&apos;m excited to connect
            {company ? ` with you at ${company}` : ''}.
          </Text>

          {conversationNotes && (
            <Section style={notesSection}>
              <Text style={notesText}>
                <strong>From our conversation:</strong><br />
                {conversationNotes}
              </Text>
            </Section>
          )}

          <Section style={buttonContainer}>
            <Button style={button} href={zoomLink}>
              Join Zoom Meeting
            </Button>
          </Section>

          <Text style={text}>
            <strong>Meeting Details:</strong><br />
            Meeting ID: 267 512 4566<br />
            Passcode: 663790
          </Text>

          <Text style={text}>
            Or copy this link: <Link href={zoomLink}>{zoomLink}</Link>
          </Text>

          <Section style={divider} />

          <Text style={footer}>
            <strong>Omer &quot;Ozzy&quot; Akben</strong><br />
            Full-Stack AI Engineer • SDET<br />
            📧 {myEmail}<br />
            🌐 <Link href="https://omerakben.com">omerakben.com</Link><br />
            💼 <Link href="https://linkedin.com/in/omerakben">LinkedIn</Link>
          </Text>

          <Text style={disclaimer}>
            You received this because you requested contact information through omerakben.com.
            If you believe this was sent in error, please reply to let me know.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
};

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '16px 0',
};

const button = {
  backgroundColor: '#00FFC6',
  borderRadius: '5px',
  color: '#000',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '200px',
  padding: '12px',
};

const buttonContainer = {
  padding: '27px 0 27px',
  textAlign: 'center' as const,
};

const notesSection = {
  backgroundColor: '#f4f4f5',
  borderRadius: '5px',
  padding: '16px',
  margin: '24px 0',
};

const notesText = {
  fontSize: '14px',
  lineHeight: '22px',
  color: '#555',
  margin: '0',
};

const divider = {
  borderTop: '1px solid #e6e6e6',
  margin: '32px 0',
};

const footer = {
  color: '#666',
  fontSize: '14px',
  lineHeight: '24px',
  margin: '16px 0',
};

const disclaimer = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '18px',
  marginTop: '32px',
};

export default ZoomLinkEmail;
