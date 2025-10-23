import { NextRequest, NextResponse } from 'next/server';
import { collectContactInputSchema } from '@/lib/agent-tools/schemas';
import { sendZoomLinkEmail } from '@/lib/email/send-zoom-link';
import { saveContactToRedis } from '@/lib/redis/contact-storage';
import { checkContactRateLimit } from '@/lib/rate-limit';
import { validateContactEmail } from '@/lib/email/validation';
import { logError } from '@/lib/log';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    // Parse and validate request body
    const body = await req.json();
    const input = collectContactInputSchema.parse(body);

    // Validate email (check for disposable domains)
    const emailValidation = validateContactEmail(input.email);
    if (!emailValidation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: emailValidation.error,
        },
        { status: 400 }
      );
    }

    // Rate limiting check (1 per IP per 24 hours)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'anonymous';
    const rateLimitOk = await checkContactRateLimit(ip);

    if (!rateLimitOk) {
      return NextResponse.json(
        {
          success: false,
          error: 'Contact collection limit reached. Please try again tomorrow.',
        },
        { status: 429 }
      );
    }

    // Save contact to Redis (7-day TTL)
    try {
      await saveContactToRedis({
        name: input.name,
        email: input.email,
        company: input.company,
        purpose: input.purpose,
        notes: input.notes,
        preferredTime: input.preferredTime,
        collectedAt: new Date().toISOString(),
        ip,
      });
    } catch (storageError) {
      logError('collect-contact:storage', storageError);
      // Continue even if storage fails - prioritize user experience
    }

    // Send Zoom link email (async, non-blocking)
    let emailResult;
    try {
      emailResult = await sendZoomLinkEmail({
        to: input.email,
        name: input.name,
        company: input.company,
        purpose: input.purpose,
        conversationNotes: input.notes,
      });
    } catch (emailError) {
      logError('collect-contact:email', emailError);
      // Continue even if email fails - contact is saved
    }

    const zoomLink =
      process.env.OMER_ZOOM_LINK ||
      'https://us06web.zoom.us/j/2675124566?pwd=IStlQ63XGKpsVbn1biPDycfrUrxPPN.1';

    return NextResponse.json({
      success: true,
      data: {
        success: true,
        emailSent: emailResult?.success ?? false,
        zoomLink,
        message: emailResult?.success
          ? `Perfect! I've sent Omer's Zoom link to ${input.email}. Check your inbox!`
          : 'Contact saved! I will have Omer reach out to you shortly.',
        messageId: emailResult?.messageId,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];
      return NextResponse.json(
        {
          success: false,
          error: firstError?.message || 'Invalid input',
        },
        { status: 400 }
      );
    }

    logError('collect-contact', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to collect contact information. Please try again.',
      },
      { status: 500 }
    );
  }
}
