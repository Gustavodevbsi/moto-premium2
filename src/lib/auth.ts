import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET não definido nas variáveis de ambiente.");
}

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const COOKIE = "mp_admin_token";
const EXPIRES = "8h";

export async function signToken(payload: { id: string; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(EXPIRES)
    .sign(SECRET);
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { id: string; email: string };
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE)?.value;
  if (!token) return null;
  return verifyToken(token);
}

export function setAuthCookie(token: string) {
  cookies().set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8h
    path: "/",
  });
}

export function clearAuthCookie() {
  cookies().set(COOKIE, "", { maxAge: 0, path: "/" });
}
