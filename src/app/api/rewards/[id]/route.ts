import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const rid = Number(id);
  const { title, description, cost, imageUrl } = await request.json();
  await prisma.reward.update({ where: { id: rid }, data: { title, description, cost, imageUrl } });
  const rewards = await prisma.reward.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(rewards);
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  await prisma.reward.delete({ where: { id: Number(id) } });
  const rewards = await prisma.reward.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(rewards);
}