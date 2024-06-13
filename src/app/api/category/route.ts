import getCurrentUser from '@/actions/getCurrentUser';
import { NextResponse } from 'next/server';

import prisma from '@/libs/prisma';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    const body = await req.json();
    const { title } = body;

    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!title) {
      return new NextResponse('Category title is required.', { status: 400 });
    }

    const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase();
    const categoryName = await prisma.category.create({
      data: {
        title: sanitizedTitle,
        userId: user.id,
      },
    });

    return NextResponse.json(categoryName);
  } catch (error) {
    console.error('CATEGORY_POST', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const categories = await prisma.category.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('CATEGORY_POST', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { id } = body;

    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const deletedCategory = await prisma.category.delete({
      where: {
        userId: user.id,
        id,
      },
    });

    return NextResponse.json(deletedCategory);
  } catch (error) {
    console.error('CATEGORY_DELETE', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
