import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/app/_models/Notification';
import { connectToDatabase } from '@/app/_lib/mongodb';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  const deleted = await Notification.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Notificação não encontrada' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
} 