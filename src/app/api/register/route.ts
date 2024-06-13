import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

import prisma from '@/libs/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return new NextResponse('Missing credentials', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('REGISTRATION_POST', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
