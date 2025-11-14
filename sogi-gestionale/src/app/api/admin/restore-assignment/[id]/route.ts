import { NextRequest, NextResponse } from 'next/server';
import Assignment from '@/models/Assignment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = (await getServerSession(authOptions as any)) as any;
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  await dbConnect();
  const assignment = await Assignment.findByIdAndUpdate(params.id, { deleted: false }, { new: true });
  if (!assignment) {
    return NextResponse.json({ error: 'Assegnazione non trovata' }, { status: 404 });
  }
  return NextResponse.json({ assignment });
}
