import { NextResponse } from "next/server";

let errorCounter = 0;

export function logApiError(
  route: string,
  error: unknown,
  context?: Record<string, unknown>
): string {
  const errorId = `ERR-${Date.now()}-${++errorCounter}`;
  const message = error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : "";

  console.error(`[${errorId}] ${route}: ${message}`);
  if (stack) {
    console.error(`[${errorId}] Stack: ${stack.split("\n").slice(0, 6).join("\n")}`);
  }
  if (context) {
    console.error(`[${errorId}] Context:`, JSON.stringify(context));
  }

  return errorId;
}

export function internalError(errorId: string) {
  return NextResponse.json(
    {
      error: "Internal server error",
      errorId,
      message:
        "An unexpected error occurred. Please try again. If the problem persists, contact support with the error ID.",
    },
    { status: 500 }
  );
}
