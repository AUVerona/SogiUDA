import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import { getServerSession } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
import User from '@/models/User';
const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email e password sono obbligatori');
        }
        await connectDB();
        const user: any = await User.findOne({ email: credentials.email });
        if (!user) {
          throw new Error('Credenziali non valide');
        }
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordValid) {
          throw new Error('Credenziali non valide');
        }
        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.nome} ${user.cognome}`,
          role: user.ruolo,
          scuola: user.scuola,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.scuola = user.scuola;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.scuola = token.scuola as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// DELETE - Elimina un'assegnazione
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

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
