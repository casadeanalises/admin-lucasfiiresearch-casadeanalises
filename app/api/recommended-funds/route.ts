import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const { client } = await connectToDatabase();
    const db = client.db('db_research');
    const collection = db.collection('Fundos_Resumo');
    
    // Lista específica dos fundos recomendados da imagem
    const recommendedTickers = [
      'KNCR11', 'KNSC11', 'HGCR11', 'AFHI11', 'MCCI11', 'RBRR11', 'JURO11', 
      'CDII11', 'CRAA11', 'KNCA11', 'HGLG11', 'BTLG11', 'LVBI11', 'BRCO11', 
      'HGRU11', 'ALZR11', 'TRXF11', 'HGRE11', 'PVBI11', 'HSML11'
    ];
    
    // Buscar apenas os fundos específicos da lista
    const data = await collection.find({ 
      ticker: { $in: recommendedTickers }
    }).sort({ ticker: 1 }).toArray();
    
    console.log(`Fundos recomendados encontrados: ${data.length}`);
    return NextResponse.json({ data });
  } catch (error) {
    console.error('Erro ao buscar fundos recomendados:', error);
    return NextResponse.json({ 
      error: 'Erro ao buscar fundos recomendados',
      details: error 
    }, { status: 500 });
  }
} 
