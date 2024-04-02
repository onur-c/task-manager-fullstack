import db from "@/lib/db";
import { formSchema } from "@/lib/schema";
import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);

    if (!userId) {
      return NextResponse.json({
        status: 401,
        error: "Unauthorized.",
      });
    }

    const { title, description, date, isCompleted, isImportant, isUrgent } =
      await req.json();

    const parseResult = formSchema.safeParse({
      title,
      description,
      date: new Date(date),
      isCompleted,
      isImportant,
      isUrgent,
    });

    if (!parseResult.success) {
      return NextResponse.json({
        status: 400,
        error: "Invalid formatted fields.",
      });
    }

    await db.task.create({
      data: {
        date,
        title,
        description,
        isCompleted,
        isImportant,
        isUrgent,
        userId,
      },
    });
    return NextResponse.json({
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error,
    });
  }
}
