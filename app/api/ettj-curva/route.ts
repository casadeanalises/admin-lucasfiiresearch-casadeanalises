import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { client } = await connectToDatabase();
    const db = client.db('db_research');
    const collection = db.collection('ETTJ_Curva');
    const data = await collection.find({}).sort({ Data: -1 }).toArray();
    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados da ETTJ_Curva', details: error }, { status: 500 });
  }
}
