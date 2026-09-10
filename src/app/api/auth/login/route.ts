import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createSessionToken,
  setSessionCookie,
  verifyPassword,
} from "@/lib/auth";
import { logAudit } from "@/lib/audit";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = String(body.username ?? "").trim().toLowerCase();
    const password = String(body.password ?? "");

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username dan password wajib diisi" },
        { status: 400 },
      );
    }

    const found = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (found.length === 0) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    const user = found[0];
    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json(
        { error: "Username atau password salah" },
        { status: 401 },
      );
    }

    const token = await createSessionToken({
      id: user.id,
      username: user.username,
      fullName: user.fullName,
      role: user.role as "admin" | "staff",
    });
    await setSessionCookie(token);

    await logAudit({
      userId: user.id,
      userName: user.fullName,
      action: "LOGIN",
      entityType: "user",
      entityId: user.id,
      description: `User ${user.username} berhasil login`,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Gagal melakukan login" },
      { status: 500 },
    );
  }
}
