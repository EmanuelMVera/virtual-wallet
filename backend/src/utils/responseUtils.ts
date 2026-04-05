import { Response } from "express";

/**
 * Standardized success response.
 */
export function sendSuccess(res: Response, data: any, message?: string, status: number = 200) {
  const payload: any = { success: true };

  if (data !== null && data !== undefined && typeof data === "object" && !Array.isArray(data)) {
    // Spread the data into root so existing tests can access result properties directly
    Object.assign(payload, data);
  } else if (data !== undefined) {
    payload.data = data;
  }

  if (message && !payload.message) {
    payload.message = message;
  }

  return res.status(status).json(payload);
}

/**
 * Standardized error response.
 */
export function sendError(res: Response, status: number, message: string) {
  return res.status(status).json({
    success: false,
    message,
  });
}
