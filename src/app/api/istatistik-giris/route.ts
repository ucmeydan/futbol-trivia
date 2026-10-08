import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  const { key } = await req.json();
  const ADMIN_KEY = process.env.ADMIN_KEY ?? '';

  if (!ADMIN_KEY || key !== ADMIN_KEY) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set('admin_key', ADMIN_KEY, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    path: '/',
  });

  return NextResponse.json({ ok: true });
}
