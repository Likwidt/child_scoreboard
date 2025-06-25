import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/prisma';

export async function GET() {
  const account = await prisma.account.findUnique({ where: { id: 1 } });
  return NextResponse.json({ balance: account?.balance ?? 0 });
}