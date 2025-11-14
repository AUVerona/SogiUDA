import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as any;
  console.log('Sessione ricevuta in /api/admin/users:', session);
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 403 });
  }
  await dbConnect();
  const users = await User.find({}).sort({ createdAt: -1 });
  return NextResponse.json({ users });
}
