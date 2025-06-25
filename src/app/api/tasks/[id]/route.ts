
import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const { delta, name, pts } = await request.json();

  if (typeof delta === 'number') {
    // update count
    await prisma.task.update({
      where: { id },
      data: { count: { increment: delta } },
    });
  } else if (typeof name === 'string' && typeof pts === 'number') {
    // update description/points
    await prisma.task.update({
      where: { id },
      data: { name, pts },
    });
  } else {
    return NextResponse.json(
      { message: 'Invalid update data' },
      { status: 400 }
    );
  }

  // return the full updated list
  const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(tasks);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);

  await prisma.task.delete({ where: { id } });
  const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json(tasks);
}
