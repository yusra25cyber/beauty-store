import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { logApiError, internalError } from "@/lib/error-utils";

let lastConnectionAttempt: "never" | "success" | "failed" = "never";

export async function GET() {
  try {
    const envStatus = {
      hasMongoUri: !!process.env.MONGODB_URI,
      hasJwtSecret: !!process.env.JWT_SECRET,
      hasAdminEmail: !!process.env.ADMIN_EMAIL,
      hasAdminPassword: !!process.env.ADMIN_INITIAL_PASSWORD,
      hasSeedSecret: !!process.env.SEED_SECRET,
      hasCloudinary: !!(
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ),
      hasWhatsAppNumber: !!process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    };

    const missingVars = Object.entries(envStatus)
      .filter(([, v]) => !v)
      .map(([key]) => key.replace(/^has/, ""));

    if (!envStatus.hasMongoUri) {
      return NextResponse.json(
        {
          status: "unhealthy",
          mongo: "disconnected",
          env: envStatus,
          error: "MONGODB_URI is not set",
          missingVars,
        },
        { status: 503 }
      );
    }

    let mongoStatus: string;
    let dbInfo: Record<string, unknown> = {};

    try {
      if (mongoose.connection.readyState === 1) {
        mongoStatus = "connected";
        lastConnectionAttempt = "success";
        dbInfo = {
          readyState: mongoose.connection.readyState,
          host: mongoose.connection.host,
          name: mongoose.connection.name || "unknown",
        };
      } else if (mongoose.connection.readyState === 2) {
        mongoStatus = "connecting";
        dbInfo = { readyState: 2 };
      } else {
        mongoStatus = "disconnected";
        dbInfo = { readyState: mongoose.connection.readyState };

        try {
          await connectDB();
          mongoStatus = "connected";
          lastConnectionAttempt = "success";
          dbInfo = {
            readyState: mongoose.connection.readyState,
            host: mongoose.connection.host,
            name: mongoose.connection.name || "unknown",
          };
        } catch (connError) {
          mongoStatus = "failed";
          lastConnectionAttempt = "failed";
          const message =
            connError instanceof Error ? connError.message : String(connError);
          dbInfo = { error: message };
          logApiError("/api/health - connection attempt", connError);

          return NextResponse.json(
            {
              status: "unhealthy",
              mongo: mongoStatus,
              env: envStatus,
              db: dbInfo,
              missingVars: [],
              lastConnectionAttempt,
            },
            { status: 503 }
          );
        }
      }
    } catch (checkError) {
      mongoStatus = "error";
      dbInfo = {
        error:
          checkError instanceof Error
            ? checkError.message
            : String(checkError),
      };
    }

    return NextResponse.json(
      {
        status: mongoStatus === "connected" ? "healthy" : "degraded",
        mongo: mongoStatus,
        env: envStatus,
        db: dbInfo,
        lastConnectionAttempt,
        missingVars: [],
      },
      { status: mongoStatus === "connected" ? 200 : 503 }
    );
  } catch (error) {
    const errorId = logApiError("/api/health GET", error);
    return internalError(errorId);
  }
}
