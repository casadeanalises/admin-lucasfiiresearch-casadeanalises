import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

interface IGPDIData {
  _id: string;
  Data: string;
  'IGP-DI Mensal': number;
  'IGP-DI 12m': number;
  'IGP-DI Ano': number;
  'IPC-DI Mensal': number;
  'IPA-DI Mensal': number;
  'INCC-DI Mensal': number;
  'IPC-DI 12m': number;
  'IPA-DI 12m': number;
  'INCC-DI 12m': number;
  'IPC-DI Ano': number;
  'IPA-DI Ano': number;
  'INCC-DI Ano': number;
}

interface FormattedData {
  Data: string;
  Mensal: number;
  '12_Meses': number;
  Ano: number;
}

export async function GET() {
  try {
    const { client } = await connectToDatabase();
    const db = client.db('db_research');
    const collection = db.collection('IGP_DI');
    const rawData = await collection.find({}).sort({ Data: -1 }).toArray();

    const data = rawData.map((item: any) => {
      return {
        Data: item.Data,
        'IGP-DI Mensal': parseFloat(item['IGP-DI Mensal'] || 0),
        'IGP-DI 12m': parseFloat(item['IGP-DI 12m'] || 0),
        'IGP-DI Ano': parseFloat(item['IGP-DI Ano'] || 0),
        'IPC-DI Mensal': parseFloat(item['IPC-DI Mensal'] || 0),
        'IPC-DI 12m': parseFloat(item['IPC-DI 12m'] || 0),
        'IPC-DI Ano': parseFloat(item['IPC-DI Ano'] || 0),
        'IPA-DI Mensal': parseFloat(item['IPA-DI Mensal'] || 0),
        'IPA-DI 12m': parseFloat(item['IPA-DI 12m'] || 0),
        'IPA-DI Ano': parseFloat(item['IPA-DI Ano'] || 0),
        'INCC-DI Mensal': parseFloat(item['INCC-DI Mensal'] || 0),
        'INCC-DI 12m': parseFloat(item['INCC-DI 12m'] || 0),
        'INCC-DI Ano': parseFloat(item['INCC-DI Ano'] || 0)
      };
    });

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar dados do IGP-DI', details: error }, { status: 500 });
  }
} 
