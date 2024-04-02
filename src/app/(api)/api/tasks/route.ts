import db from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
    const tasks = await db.task.findMany({
      where: {
        userId,
      },
    });

    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Error getting the tasks.",
    });
  }
}
