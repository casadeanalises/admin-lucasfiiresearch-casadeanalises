import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
    const { client } = await connectToDatabase();
    const db = client.db('db_research');
    const collection = db.collection('IPCA_Full');
    
    // Buscar todos os dados ordenados por data (mais recentes primeiro)
    const data = await collection.find({}).sort({ Data: -1 }).toArray();
    
    // Mapear os campos para os nomes esperados pelo frontend
    const mappedData = data.map(item => ({
      Data: item.Data,
      'IPCA 12M': item.IPCA_12M,
      'IPCA': item.IPCA,
      'IPCA Ano': item.IPCA_Ano,
      
      // Campos principais - mapeamento direto do MongoDB
      'IPCA Nucleo': item.IPCA_Nucleo,
      'Gasolina': item.Gasolina,
      'Alim Domicilio': item.Alim_Domicilio,
      'Transporte': item.Transporte,
      'Habitacao': item.Habitacao,
      'Saude': item.Saude,
      'Desp Pessoal': item.Desp_Pessoal,
      'Vestuario': item.Vestuario,
      
      // Campos 12M - mapeamento direto do MongoDB
      'IPCA Nucleo 12M': item.IPCA_Nucleo_12M,
      'Gasolina 12M': item.Gasolina_12M,
      'Alim Domicilio 12M': item.Alim_Domicilio_12M,
      'Transporte 12M': item.Transporte_12M,
      'Habitacao 12M': item.Habitacao_12M,
      'Saude 12M': item.Saude_12M,
      'Desp Pessoal 12M': item.Desp_Pessoal_12M,
      'Vestuario 12M': item.Vestuario_12M,
      
      // Campos adicionais do MongoDB
      'Livre Servicos 12M': item.Livre_Servicos_12M,
      'Administrados 12M': item.Administrados_12M,
      'Livre Industria 12M': item.Livre_Industria_12M,
      'Alim Bebidas 12M': item.Alim_Bebidas_12M,
      'Artigos Residencia 12M': item.Artigos_Residencia_12M,
      'Comunicacao 12M': item.Comunicacao_12M,
      'Educacao 12M': item.Educacao_12M,
      'Alim Fora Domicilio 12M': item.Alim_Fora_Domicilio_12M
    }));
    
    return NextResponse.json({ data: mappedData });
  } catch (error) {
    console.error('Erro ao buscar dados do IPCA:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados do IPCA', details: error }, { status: 500 });
  }
} 
