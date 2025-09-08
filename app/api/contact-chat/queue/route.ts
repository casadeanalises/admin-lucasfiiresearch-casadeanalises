import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs";

export async function GET() {
  return NextResponse.json({ activeUserId: null, queueLength: 0 });
}

export async function POST() {
  return NextResponse.json({ status: "entrou_na_fila", position: 1 });
}

export async function DELETE() {
  return NextResponse.json({ status: "fila_liberada" });
} 