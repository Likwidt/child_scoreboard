import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Retrieve and parse the dynamic ID
  const { id } = await context.params;
  const rid = Number(id);

  // Parse request body, including purchased flag
  const { title, description, cost, imageUrl, purchased } = await request.json();

  // Update reward with new data
  await prisma.reward.update({
    where: { id: rid },
    data: {
      title,
      description,
      cost,
      imageUrl,
      purchased,
    },
  });

  // Return full updated rewards list
  const rewards = await prisma.reward.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(rewards);
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Parse dynamic ID
  const { id } = await context.params;
  const rid = Number(id);

  // Delete the reward
  await prisma.reward.delete({ where: { id: rid } });

  // Return remaining rewards
  const rewards = await prisma.reward.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(rewards);
}