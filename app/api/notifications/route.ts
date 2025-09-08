import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/app/_models/Notification';
import { connectToDatabase } from '@/app/_lib/mongodb';

// GET /api/notifications?userId=xxx&unread=true
export async function GET(req: NextRequest) {
  await connectToDatabase();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const unread = searchParams.get('unread') === 'true';

  if (!userId) {
    return NextResponse.json({ error: 'userId obrigatório' }, { status: 400 });
  }

  let query: any = { $or: [ { global: true } ] };
  if (unread) {
    query.usersRead = { $ne: userId };
  }

  const notifications = await Notification.find(query).sort({ createdAt: -1 });
  return NextResponse.json(notifications);
}

// POST /api/notifications
export async function POST(req: NextRequest) {
  await connectToDatabase();
  const body = await req.json();
  const notification = await Notification.create({
    ...body,
    createdAt: new Date(),
    usersRead: [],
    global: true,
  });
  return NextResponse.json(notification, { status: 201 });
}

// DELETE /api/notifications (remove todas as notificações)
export async function DELETE() {
  await connectToDatabase();
  await Notification.deleteMany({});
  return NextResponse.json({ success: true });
}

// PATCH /api/notifications (marca todas como lidas para o userId)
export async function PATCH(req: NextRequest) {
  await connectToDatabase();
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
  await Notification.updateMany(
    { global: true, usersRead: { $ne: userId } },
    { $addToSet: { usersRead: userId } }
  );
  return NextResponse.json({ success: true });
} 