import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Assignment from '@/models/Assignment';
import User from '@/models/User';
import { getServerSession } from 'next-auth';

import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { NextAuthOptions } from 'next-auth';
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
        await dbConnect();
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
