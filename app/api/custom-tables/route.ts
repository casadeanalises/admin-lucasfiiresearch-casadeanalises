import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const customTables = await db.collection('customTables').find({ userId }).toArray();

    return NextResponse.json({ customTables });
  } catch (error) {
    console.error('Erro ao carregar planilhas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    const { customTables } = await request.json();
    const { db } = await connectToDatabase();

    // Remover planilhas antigas do usuário
    await db.collection('customTables').deleteMany({ userId });

    // Inserir novas planilhas
    if (customTables && customTables.length > 0) {
      const tablesWithUserId = customTables.map((table: any) => ({
        ...table,
        userId,
        createdAt: new Date(),
        updatedAt: new Date()
      }));

      await db.collection('customTables').insertMany(tablesWithUserId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erro ao salvar planilhas:', error);
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 });
  }
}
