import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  const { delta, name, pts } = await request.json();

  if (typeof delta === 'number') {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

    await prisma.task.update({ where: { id }, data: { count: { increment: delta } } });
    await prisma.transaction.create({ data: { taskId: id, amount: delta * task.pts } });
    await prisma.account.update({ where: { id: 1 }, data: { balance: { increment: delta * task.pts } } });
  } else if (typeof name === 'string' && typeof pts === 'number') {
    await prisma.task.update({ where: { id }, data: { name, pts } });
  } else {
    return NextResponse.json({ message: 'Invalid update data' }, { status: 400 });
  }

  const [tasks, account] = await Promise.all([
    prisma.task.findMany({ orderBy: { id: 'asc' } }),
    prisma.account.findUnique({ where: { id: 1 } }),
  ]);
  return NextResponse.json({ tasks, balance: account?.balance ?? 0 });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  await prisma.task.delete({ where: { id } });
  const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json({ tasks });
}