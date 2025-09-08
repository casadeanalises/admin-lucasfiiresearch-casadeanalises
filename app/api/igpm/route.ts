import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { client } = await connectToDatabase();
    const db = client.db('db_research');
    const collection = db.collection('IGP_M');
    const rawData = await collection.find({}).sort({ Data: -1 }).toArray();

    // Mapear os dados do MongoDB para o formato esperado pelo frontend
    const data = rawData.map(item => ({
      Data: item.Data,
      'IGP-M Mensal': item['IGP-M Mensal'],
      'IGP-M 12m': item['IGP-M 12m'],
      'IGP-M Ano': item['IGP-M Ano'],
      'IPC-M Mensal': item['IPC-M Mensal'],
      'IPC-M 12m': item['IPC-M 12m'],
      'IPC-M Ano': item['IPC-M Ano'],
      'IPA-M Mensal': item['IPA-M Mensal'],
      'IPA-M 12m': item['IPA-M 12m'],
      'IPA-M Ano': item['IPA-M Ano'],
      'INCC-M Mensal': item['INCC-M Mensal'],
      'INCC-M 12m': item['INCC-M 12m'],
      'INCC-M Ano': item['INCC-M Ano'],
      Tipo: item.Tipo || 'Realizado'
    }));

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados do IGPM', details: error }, { status: 500 });
  }
} 
