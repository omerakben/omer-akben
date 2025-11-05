import { triggerWorkflowInputSchema } from "@/lib/tools/zod-schemas";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId");
    const waitForResult = searchParams.get("waitForResult") === "true";

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required parameter: workflowId",
        },
        { status: 400 }
      );
    }

    const input = triggerWorkflowInputSchema.parse({
      workflowId,
      waitForResult,
      payload: {},
    });

    if (!process.env.N8N_WEBHOOK_URL) {
      console.warn("[n8n] N8N_WEBHOOK_URL not configured");
    }

    const mockResult = {
      workflowId: input.workflowId,
      status: "completed" as const,
      result: {
        message: "Workflow executed successfully",
        timestamp: new Date().toISOString(),
      },
      message: `Workflow ${input.workflowId} triggered successfully`,
    };

    return NextResponse.json({
      success: true,
      data: mockResult,
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { workflowId } = triggerWorkflowInputSchema.parse(body);
    // Note: payload and waitForResult parameters validated but not yet used in MVP implementation

    // For MVP, return mock response
    // Future: Integrate with n8n webhook endpoints
    // Example: await fetch(process.env.N8N_WEBHOOK_URL, { method: 'POST', body: JSON.stringify(payload) })

    if (!process.env.N8N_WEBHOOK_URL) {
      console.warn("[n8n] N8N_WEBHOOK_URL not configured");
    }

    const mockResult = {
      workflowId,
      status: "completed" as const,
      result: {
        message: "Workflow executed successfully",
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
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Invalid request",
      },
      { status: 400 }
    );
  }
}
