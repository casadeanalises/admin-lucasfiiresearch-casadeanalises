import { NextResponse } from "next/server";
import clientPromise from '@/lib/mongodb';
import { auth } from "@clerk/nextjs/server";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function PUT(request: Request) {
  const { userId } = auth();
  
  // Verificar se o usuário está autenticado
  if (!userId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI não está definida no .env');
    return NextResponse.json({ error: 'Erro de configuração do banco de dados' }, { status: 500 });
  }

  if (!process.env.MONGODB_DB) {
    console.error('MONGODB_DB não está definida no .env');
    return NextResponse.json({ error: 'Erro de configuração do banco de dados' }, { status: 500 });
  }

  try {
    const data = await request.json();
    
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    console.log('Conectando ao MongoDB...');
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);

    // Limpar a coleção atual
    await db.collection('recommendedFunds').deleteMany({});

    // Inserir os novos fundos
    const result = await db.collection('recommendedFunds').insertMany(data);

    console.log(`${result.insertedCount} fundos atualizados`);

    // Configurar headers para controle de cache
    const response = NextResponse.json({ 
      message: 'Fundos recomendados atualizados com sucesso',
      count: result.insertedCount 
    });
    response.headers.set('Cache-Control', 'no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error: unknown) {
    console.error('Erro ao atualizar fundos:', error);
    return NextResponse.json({ 
      error: 'Erro ao atualizar fundos recomendados',
      message: process.env.NODE_ENV === 'development' ? (error as Error)?.message : 'Tente novamente mais tarde'
    }, { 
      status: 500 
    });
  }
} 