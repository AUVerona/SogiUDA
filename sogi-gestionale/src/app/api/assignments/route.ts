import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import Assignment from '@/models/Assignment';

export async function POST(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;

    if (!session) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { livello, livelloNome, assegnazioni, docente } = body;

    if (!livello || !livelloNome || !assegnazioni) {
      return NextResponse.json(
        { error: 'Dati mancanti' },
        { status: 400 }
      );
    }

    await dbConnect();

    const assignment = await Assignment.create({
      livello,
      livelloNome,
      assegnazioni,
      docente,
      createdBy: session.user.id,
    });

    return NextResponse.json(
      {
        message: 'Assegnazione salvata con successo',
        assignment,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Errore salvataggio assegnazione:', error);
    return NextResponse.json(
      { error: 'Errore durante il salvataggio' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = (await getServerSession(authOptions as any)) as any;

    if (!session) {
      return NextResponse.json(
        { error: 'Non autenticato' },
        { status: 401 }
      );
    }

    await dbConnect();

    const assignments = await Assignment.find({
      createdBy: session.user.id,
      deleted: { $ne: true }
    })
      .sort({ createdAt: -1 })
      .limit(50);

    return NextResponse.json({ assignments }, { status: 200 });
  } catch (error: any) {
    console.error('Errore recupero assegnazioni:', error);
    return NextResponse.json(
      { error: 'Errore durante il recupero' },
      { status: 500 }
    );
  }
}
