import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  try {
    const { nome, cognome, email, password, scuola, ruolo } = await req.json();

    // Validazione
    if (!nome || !cognome || !email || !password || !scuola || !ruolo) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    if (!['admin', 'docente'].includes(ruolo)) {
      return NextResponse.json(
        { error: 'Ruolo non valido' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'La password deve essere di almeno 6 caratteri' },
        { status: 400 }
      );
    }

    await dbConnect();

    // Verifica se l'utente esiste già
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email già registrata' },
        { status: 400 }
      );
    }

    // Hash della password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea nuovo utente
    const user = await User.create({
      nome,
      cognome,
      email: email.toLowerCase(),
      password: hashedPassword,
      scuola,
      ruolo,
    });

    return NextResponse.json(
      {
        message: 'Utente registrato con successo',
        user: {
          id: user._id,
          nome: user.nome,
          cognome: user.cognome,
          email: user.email,
          scuola: user.scuola,
          ruolo: user.ruolo,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Errore registrazione:', error);
    return NextResponse.json(
      { error: 'Errore durante la registrazione' },
      { status: 500 }
    );
  }
}
