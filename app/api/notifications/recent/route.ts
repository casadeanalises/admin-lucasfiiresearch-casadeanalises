import { NextRequest, NextResponse } from 'next/server';
import Notification from '@/app/_models/Notification';
import { connectToDatabase } from '@/app/_lib/mongodb';

export async function GET() {
  await connectToDatabase();
  const notifications = await Notification.find({ global: true })
    .sort({ createdAt: -1 })
    .limit(6);
  return NextResponse.json(notifications);
} 