import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { UpdateSchedulePDF } from "@/app/models/UpdateSchedulePDF";

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    // Usa timeout para evitar travamentos
    const pdfs = await Promise.race([
      db.collection('updateschedulepdfs').find().sort({ date: -1, createdAt: -1 }).toArray(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout na consulta')), 8000)
      )
    ]);

    return NextResponse.json(pdfs);
  } catch (error) {
    console.error('Error fetching PDFs:', error);
    
    // Retorna array vazio em caso de erro para evitar problemas de renderização
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { title, description, url, date, category } = body;

    const pdf = await UpdateSchedulePDF.create({
      title,
      description,
      url,
      date: new Date(date + 'T12:00:00'),
      category
    });

    return NextResponse.json(pdf);
  } catch (error) {
    console.error('Error creating PDF:', error);
    return NextResponse.json(
      { error: 'Erro ao criar PDF' },
      { status: 500 }
    );
  }
}
