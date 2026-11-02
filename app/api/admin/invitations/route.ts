import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { authService } from "@/lib/server/services/auth.service";
import {
  AppError,
  invitationsService,
} from "@/lib/server/services/invitations.service";

export async function GET() {
  try {
    const user = await authService.getAuthenticatedUser();
    const invitations = await invitationsService.findAll(user);
    return NextResponse.json({ invitations });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    logger.error("Failed to fetch invitations", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await authService.getAuthenticatedUser();
    const { recipient } = await request.json();

    if (!recipient || typeof recipient !== "string" || !recipient.trim()) {
      return NextResponse.json(
        { message: "Recipient is required" },
        { status: 400 }
      );
    }

    const invitation = await invitationsService.create(
      { recipient: recipient.trim() },
      user
    );

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message },
        { status: error.statusCode }
      );
    }
    logger.error("Failed to create invitation", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
