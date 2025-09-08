import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { client } = await connectToDatabase();
    const db = client.db('db_research');

    // Buscar dados da tabela separados por ano
    const tableData2025 = await db.collection('Focus_Tabela').find({ Ano: '2025' }).toArray();
    const tableData2026 = await db.collection('Focus_Tabela').find({ Ano: '2026' }).toArray();
    
    // Buscar dados dos gráficos
    const chartData = await db.collection('focus').find({}).sort({ Data: -1 }).toArray();

    return NextResponse.json({ 
      tableData2025,
      tableData2026,
      chartData
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar dados do Boletim Focus', details: error }, 
      { status: 500 }
    );
  }
}
