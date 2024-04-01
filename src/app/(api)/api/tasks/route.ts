import db from "@/lib/db";
import { formSchema } from "@/lib/schema";
import { auth } from "@clerk/nextjs";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: Request) {
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
