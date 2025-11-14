export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'ID mancante' }, { status: 400 });
  }
  await dbConnect();
  const deleted = await Assignment.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Assegnazione non trovata' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import User from '@/models/User';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  console.log('Sessione ricevuta in /api/admin/assignments:', session);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  await dbConnect();
  const assignments = await Assignment.find({})
    .populate('createdBy', 'nome cognome email ruolo')
    .sort({ createdAt: -1 });
  return NextResponse.json({ assignments });
}
