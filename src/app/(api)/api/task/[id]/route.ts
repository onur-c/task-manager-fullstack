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

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
    await db.task.delete({
      where: {
        id: params.id,
      },
    });
    return NextResponse.json({
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Error deleting the task.",
    });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized", status: 401 });
    }
    const value = await req.json();
    await db.task.update({
      where: {
        id: params.id,
      },
      data: {
        ...value,
      },
    });

    return NextResponse.json({
      status: 201,
    });
  } catch (error) {
    return NextResponse.json({
      status: 500,
      error: "Error updating the task.",
    });
  }
}
