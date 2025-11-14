import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log('Sessione ricevuta in /api/admin/deleted-assignments:', session);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  await dbConnect();
  const assignments = await Assignment.find({ deleted: true })
    .populate('createdBy', 'nome cognome email ruolo')
    .sort({ updatedAt: -1 });
  return NextResponse.json({ assignments });
}
