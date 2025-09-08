import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UpdateSchedulePDF } from "@/app/models/UpdateSchedulePDF";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, description, url, date, category } = body;

    const pdf = await UpdateSchedulePDF.findByIdAndUpdate(
      params.id,
      {
        title,
        description,
        url,
        date: new Date(date + 'T12:00:00'),
        category
      },
      { new: true }
    );

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(pdf);
  } catch (error) {
    console.error('Error updating PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao atualizar PDF' },
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
    const pdf = await UpdateSchedulePDF.findByIdAndDelete(params.id);

    if (!pdf) {
      return NextResponse.json(
        { error: 'PDF não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'PDF removido com sucesso' });
  } catch (error) {
    console.error('Error deleting PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao remover PDF' },
      { status: 500 }
    );
  }
}
