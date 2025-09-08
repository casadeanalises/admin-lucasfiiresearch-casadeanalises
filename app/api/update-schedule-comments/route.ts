import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UpdateScheduleComment } from "@/app/models/UpdateScheduleComment";
import { auth } from "@clerk/nextjs";

export async function GET() {
  try {
    await connectToDatabase();
    const comments = await UpdateScheduleComment.find().sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Erro ao buscar comentários' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      );
    }

    await connectToDatabase();
    const body = await request.json();
    const { userName, content } = body;

    const comment = await UpdateScheduleComment.create({
      userId,
      userName,
      content,
    });

    return NextResponse.json(comment);
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Erro ao criar comentário' },
      { status: 500 }
    );
  }
}
