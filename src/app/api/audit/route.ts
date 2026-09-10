import { NextResponse } from "next/server";
import { db } from "@/db";
import { auditLogs, users } from "@/db/schema";
import { desc, eq, and, gte, lte, sql } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getSession(); // bisa null (guest read-only)
    const url = new URL(request.url);
    const from = url.searchParams.get("from");
    const to = url.searchParams.get("to");
    const action = url.searchParams.get("action");
    const userId = url.searchParams.get("userId");
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 200), 500);

    // Guest: tampil semua (read-only). PIC hanya lihat log dirinya sendiri.
    const conditions: any[] = [];
    if (user && user.role !== "admin") {
      conditions.push(eq(auditLogs.userId, user.id));
    } else if (user && user.role === "admin" && userId) {
      conditions.push(eq(auditLogs.userId, Number(userId)));
    }

    if (from) conditions.push(gte(auditLogs.createdAt, new Date(from)));
    if (to) {
      const toDate = new Date(to);
      toDate.setHours(23, 59, 59, 999);
      conditions.push(lte(auditLogs.createdAt, toDate));
    }
    if (action) conditions.push(eq(auditLogs.action, action));

    const where = conditions.length > 0 ? and(...conditions) : undefined;

    const rows = await db
      .select()
      .from(auditLogs)
      .where(where)
      .orderBy(desc(auditLogs.createdAt))
      .limit(limit);

    // Daftar user (untuk filter - admin only)
    let userList: any[] = [];
    if (user && user.role === "admin") {
      userList = await db.select({ id: users.id, fullName: users.fullName, role: users.role }).from(users);
    }

    return NextResponse.json({ logs: rows, users: userList });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Gagal memuat audit log" }, { status: 500 });
  }
}
