import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from "jose";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { getJwtSecret } from "./env";

export interface JWTPayload extends JoseJWTPayload {
  adminId: string;
  email: string;
}

function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(getJwtSecret());
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 12);
}

export function comparePassword(password: string, hashed: string): boolean {
  return bcrypt.compareSync(password, hashed);
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT({ adminId: payload.adminId, email: payload.email } as unknown as JoseJWTPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export function setAuthCookie(response: NextResponse, token: string): void {
  response.cookies.set("admin_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60,
    path: "/",
  });
}

export function clearAuthCookie(response: NextResponse): void {
  response.cookies.set("admin_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getAdminFromRequest(request: Request): Promise<JWTPayload | null> {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/admin_token=([^;]+)/);
  if (!match) return null;
  return verifyToken(decodeURIComponent(match[1]));
}
