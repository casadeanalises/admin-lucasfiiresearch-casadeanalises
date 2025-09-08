import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UpdateSchedule } from "@/app/models/UpdateSchedule";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Usa timeout para evitar travamentos
    const updates = await Promise.race([
      db.collection('updateschedules').find().sort({ date: 1 }).toArray(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na consulta')), 8000)
      )
    ]);

    return NextResponse.json(updates);
  } catch (error) {
    console.error('Error fetching updates:', error);
    
    // Retorna array vazio em caso de erro para evitar problemas de renderização
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, description, date, status, category } = body;

    const update = await UpdateSchedule.create({
      title,
      description,
      date: new Date(date + 'T12:00:00'),
      status,
      category
    });

    return NextResponse.json(update);
  } catch (error) {
    console.error('Error creating update:', error);
    return NextResponse.json(
      { error: 'Erro ao criar atualização' },
      { status: 500 }
    );
  }
}