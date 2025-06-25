import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  // Await params before accessing its properties
  const { id } = await context.params;
  const taskId = Number(id);
  const { delta, name, pts } = await request.json();

  if (typeof delta === 'number') {
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }

    // Update task count
    await prisma.task.update({
      where: { id: taskId },
      data: { count: { increment: delta } },
    });

    // Record transaction
    await prisma.transaction.create({
      data: { taskId, amount: delta * task.pts },
    });

    // Upsert account balance
    const existingAccount = await prisma.account.findUnique({ where: { id: 1 } });
    if (existingAccount) {
      await prisma.account.update({
        where: { id: 1 },
        data: { balance: { increment: delta * task.pts } },
      });
    } else {
      await prisma.account.create({ data: { balance: delta * task.pts } });
    }
  } else if (typeof name === 'string' && typeof pts === 'number') {
    // Update task description/points
    await prisma.task.update({
      where: { id: taskId },
      data: { name, pts },
    });
  } else {
    return NextResponse.json(
      { message: 'Invalid update data' },
      { status: 400 }
    );
  }

  // Return updated tasks and account balance
  const [tasks, account] = await Promise.all([
    prisma.task.findMany({ orderBy: { id: 'asc' } }),
    prisma.account.findUnique({ where: { id: 1 } }),
  ]);

  return NextResponse.json({ tasks, balance: account?.balance ?? 0 });
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const taskId = Number(id);
  await prisma.task.delete({ where: { id: taskId } });
  const tasks = await prisma.task.findMany({ orderBy: { id: 'asc' } });
  return NextResponse.json({ tasks });
}
