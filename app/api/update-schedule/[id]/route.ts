import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UpdateSchedule } from "@/app/models/UpdateSchedule";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, description, date, status, category } = body;

    const update = await UpdateSchedule.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        date: new Date(date + 'T12:00:00'),
        status,
        category
      },
      { new: true }
    );

    if (!update) {
      return NextResponse.json(
        { error: 'Atualização não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error updating update:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar atualização' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const update = await UpdateSchedule.findByIdAndDelete(params.id);

    if (!update) {
      return NextResponse.json(
        { error: 'Atualização não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Atualização removida com sucesso' });
  } catch (error) {
    console.error('Error deleting update:', error);
    return NextResponse.json(
      { error: 'Erro ao remover atualização' },
      { status: 500 }
    );
  }
}