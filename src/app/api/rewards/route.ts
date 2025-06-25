import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const rewards = await prisma.reward.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(rewards);
}

export async function POST(request: Request) {
  const { title, description, cost, imageUrl } = await request.json();
  if (!title || !description || typeof cost !== 'number') {
    return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
  }
  await prisma.reward.create({ data: { title, description, cost, imageUrl } });
  const rewards = await prisma.reward.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(rewards, { status: 201 });
}