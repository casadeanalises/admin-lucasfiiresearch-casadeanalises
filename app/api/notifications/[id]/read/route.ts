import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/app/_models/Notification';
import { connectToDatabase } from '@/app/_lib/mongodb';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  await connectToDatabase();
  const { id } = params;
  let userId;
  try {
    const body = await req.json();
    userId = body.userId;
  } catch (e) {
    return NextResponse.json({ error: 'Corpo da requisição inválido ou ausente' }, { status: 400 });
  }
  if (!userId) {
    return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });
  }
  const notification = await Notification.findByIdAndUpdate(
    id,
    { $addToSet: { usersRead: userId } },
    { new: true }
  );
  return NextResponse.json(notification);
} 