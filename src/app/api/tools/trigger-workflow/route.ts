import { NextRequest, NextResponse } from 'next/server';
import { triggerWorkflowInputSchema } from '@/lib/agent-tools/schemas';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workflowId, payload: _payload, waitForResult: _waitForResult } = triggerWorkflowInputSchema.parse(body);

    // For MVP, return mock response
    // Future: Integrate with n8n webhook endpoints
    // Example: await fetch(process.env.N8N_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) })
    
    if (!process.env.N8N_WEBHOOK_URL) {
      console.warn('[n8n] N8N_WEBHOOK_URL not configured');
    }

    const mockResult = {
      workflowId,
      status: 'completed' as const,
      result: {
        message: 'Workflow executed successfully',
        timestamp: new Date().toISOString(),
      },
      message: `Workflow ${workflowId} triggered successfully`,
    };

    return NextResponse.json({
      success: true,
      data: mockResult,
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
