import { NextResponse } from 'next/server';
import { SELIC_HISTORY } from '@/app/_data/copom-dates';

export async function GET() {
  try {
    return NextResponse.json(SELIC_HISTORY);
  } catch (error) {
    console.error('Erro na rota:', error);
    return NextResponse.json({ error: 'Erro ao buscar dados da Selic' }, { status: 500 });
  }
} 
