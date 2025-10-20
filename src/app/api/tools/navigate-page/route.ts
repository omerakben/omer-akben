import { NextRequest, NextResponse } from 'next/server';
import { navigatePageInputSchema } from '@/lib/agent-tools/schemas';

const ALLOWED_DOMAINS = ['omerakben.com', 'localhost'];

function validateDomain(url: string): boolean {
  try {
    const hostname = new URL(url).hostname;
    return ALLOWED_DOMAINS.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, waitUntil } = navigatePageInputSchema.parse(body);

    // Domain validation for security
    if (!validateDomain(url)) {
      return NextResponse.json({
        success: false,
        error: 'Navigation restricted to omerakben.com domain',
      }, { status: 403 });
    }

    // For MVP, return success with navigation instruction
    // Client-side will handle actual navigation
    // Future: Integrate Playwright MCP for server-side browser automation
    return NextResponse.json({
      success: true,
      data: {
        url,
        waitUntil,
        message: `Navigating to ${url}`,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        error: error.message,
      }, { status: 400 });
    }

    return NextResponse.json({
      success: false,
      error: 'Invalid request',
    }, { status: 400 });
  }
}
