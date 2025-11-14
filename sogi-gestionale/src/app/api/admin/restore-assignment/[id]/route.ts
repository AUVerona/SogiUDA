import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.ruolo !== 'admin') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  await dbConnect();
  const assignment = await Assignment.findByIdAndUpdate(params.id, { deleted: false }, { new: true });
  if (!assignment) {
    return NextResponse.json({ error: 'Assegnazione non trovata' }, { status: 404 });
  }
  return NextResponse.json({ assignment });
}
