import { NextRequest, NextResponse } from "next/server";
import { appendRow } from "@/lib/google-sheets";

interface SubmitRequest {
  email: string;
  phone?: string;
  address?: string;
  comments?: string;
}

// Simple in-memory rate limiter (per IP)
const submissions = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 submissions per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = submissions.get(ip);

  if (!entry || now > entry.resetAt) {
    submissions.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) return true;

  entry.count++;
  return false;
}

// Strip HTML/script tags
function sanitize(str: string): string {
  return str.replace(/<[^>]*>/g, "").trim();
}

const EMAIL_REGEX = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
const MAX_EMAIL_LEN = 254;
const MAX_PHONE_LEN = 20;
const MAX_ADDRESS_LEN = 500;
const MAX_COMMENTS_LEN = 500;
const MAX_BODY_SIZE = 2048; // bytes

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { success: false, error: "Too many submissions. Please try again later." },
        { status: 429 }
      );
    }

    // Body size check
    const bodyText = await request.text();
    if (bodyText.length > MAX_BODY_SIZE) {
      return NextResponse.json(
        { success: false, error: "Request too large." },
        { status: 413 }
      );
    }

    let body: SubmitRequest;
    try {
      body = JSON.parse(bodyText);
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid request." },
        { status: 400 }
      );
    }

    // Sanitize all inputs
    const email = sanitize(body.email || "").toLowerCase();
    const phone = sanitize(body.phone || "");
    const address = sanitize(body.address || "");
    const comments = sanitize(body.comments || "");

    // Validation
    if (!email) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (email.length > MAX_EMAIL_LEN || !EMAIL_REGEX.test(email)) {
      return NextResponse.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!phone) {
      return NextResponse.json(
        { success: false, error: "Phone number is required" },
        { status: 400 }
      );
    }

    if (phone.length > MAX_PHONE_LEN || !/^\+?[0-9\s\-()]{6,}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: "Valid phone number is required" },
        { status: 400 }
      );
    }

    if (!address) {
      return NextResponse.json(
        { success: false, error: "Address is required" },
        { status: 400 }
      );
    }

    if (address.length > MAX_ADDRESS_LEN) {
      return NextResponse.json(
        { success: false, error: "Address is too long" },
        { status: 400 }
      );
    }

    if (comments.length > MAX_COMMENTS_LEN) {
      return NextResponse.json(
        { success: false, error: "Comments must be 500 characters or less" },
        { status: 400 }
      );
    }

    // Log submission
    console.log("New waitlist submission:", {
      timestamp: new Date().toISOString(),
      ip,
      email,
      phone,
      address,
      comments: comments || "N/A",
    });

    // Append to Google Sheets (graceful fallback if not configured)
    const sheetsResult = await appendRow({
      email,
      phone,
      address,
      comments,
    });

    if (!sheetsResult.success) {
      console.warn(`[API] Sheets write failed: ${sheetsResult.error}`);
      // Don't fail the response — form submission succeeds even if Sheets write fails
    }

    return NextResponse.json(
      { success: true, message: "You're on the list!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing submission:", error);
    return NextResponse.json(
      { success: false, error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
