import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';

export async function GET() {
  try {
 
    
    const { client } = await connectToDatabase();
    const db = client.db('db_research');
    const collection = db.collection('Tit_Publico');
    
  
    
    const data = await collection.find({}).sort({ Data: -1 }).toArray();
    console.log(`📊 Encontrados ${data.length} registros na collection Tit_Publico`);
    
    if (data.length === 0) {
      console.log('⚠️ Nenhum dado encontrado na collection Tit_Publico');
      return NextResponse.json({
        success: true,
        data: [],
        count: 0,
        message: 'Nenhum dado encontrado'
      });
    }
    
    // Log do primeiro registro para debug
    console.log('📋 Exemplo de registro:', JSON.stringify(data[0], null, 2));
    
    // Processar e validar as datas, mantendo apenas os campos necessários
    const processedData = data.map(item => {
      // Tentar converter a data para um formato válido
      let dataProcessada = item.Data;
      if (typeof item.Data === 'string') {
        // Se a data está no formato DD/MM/YYYY, converter para YYYY-MM-DD
        if (item.Data && item.Data.includes('/')) {
          const partes = item.Data.split('/');
          if (partes.length === 3) {
            dataProcessada = `${partes[2]}-${partes[1]}-${partes[0]}`;
          }
        }
      }
      
      return {
        _id: item._id,
        ID: item.ID,
        Titulo: item.Titulo,
        Data: dataProcessada,
        Dt_Venc: item.Dt_Venc,
        Tx_Indc: item.Tx_Indc
      };
    });
    
    return NextResponse.json({
      success: true,
      data: processedData,
      count: processedData.length
    });
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados dos títulos públicos:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Erro ao buscar dados dos títulos públicos', 
      details: error 
    }, { status: 500 });
  }
}
