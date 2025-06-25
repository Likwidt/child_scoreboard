import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const account = await prisma.account.findUnique({ where: { id: 1 } });
  return NextResponse.json({ balance: account?.balance ?? 0 });
}

export async function PATCH(request: Request) {
  // Expect a JSON body like { spend: 25 }
  const { spend } = await request.json();

  // Validate
  if (typeof spend !== 'number' || spend <= 0) {
    return NextResponse.json(
      { message: 'Invalid spend amount' },
      { status: 400 }
    );
  }

  // Fetch the existing account (should always exist after seeding)
  const account = await prisma.account.findUnique({ where: { id: 1 } });
  if (!account) {
    return NextResponse.json(
      { message: 'Account not found' },
      { status: 404 }
    );
  }

  // Prevent overdraft
  if (account.balance < spend) {
    return NextResponse.json(
      { message: 'Insufficient points' },
      { status: 400 }
    );
  }

  // Deduct the spent points
  const updated = await prisma.account.update({
    where: { id: 1 },
    data: { balance: { decrement: spend } },
  });

  return NextResponse.json({ balance: updated.balance });
}