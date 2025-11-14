import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Assignment from '@/models/Assignment';

// DELETE - elimina un'assegnazione (admin only)
export async function DELETE(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
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

// GET - lista assegnazioni (admin only)
export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
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
