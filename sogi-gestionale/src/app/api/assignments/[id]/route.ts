import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';

// DELETE - Elimina un'assegnazione
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    await connectDB();

    const assignment = await Assignment.findByIdAndUpdate(
      params.id,
      { deleted: true },
      { new: true }
    );

    if (!assignment) {
      return NextResponse.json({ error: 'Assegnazione non trovata' }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Assegnazione spostata nel cestino',
      assignment
    });
  } catch (error) {
    console.error('Errore eliminazione assegnazione:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'eliminazione' },
      { status: 500 }
    );
  }
}

// GET - Recupera una singola assegnazione
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json({ error: 'Non autenticato' }, { status: 401 });
    }

    await connectDB();

    const assignment = await Assignment.findById(params.id).populate('docente', 'nome cognome');

    if (!assignment) {
      return NextResponse.json({ error: 'Assegnazione non trovata' }, { status: 404 });
    }

    return NextResponse.json({ assignment });
  } catch (error) {
    console.error('Errore recupero assegnazione:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero' },
      { status: 500 }
    );
  }
}
