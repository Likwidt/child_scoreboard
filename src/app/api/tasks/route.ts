
import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const { name, pts } = await request.json();
  if (typeof name !== 'string' || typeof pts !== 'number') {
    return NextResponse.json({ message: 'Invalid task data' }, { status: 400 });
  }
  await prisma.task.create({ data: { name, pts } });
  const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(tasks, { status: 201 });
}