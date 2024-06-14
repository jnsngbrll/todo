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
      return new NextResponse('Project title is required.', { status: 400 });
    }

    const sanitizedTitle = title.replace(/\s+/g, '-').toLowerCase();
    const isProjectExist = await prisma.project.findFirst({
      where: { title: sanitizedTitle },
    });

    if (isProjectExist || title === 'All' || title === 'all') {
      return new NextResponse('Invalid project title.', { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        title: sanitizedTitle,
        userId: user.id,
      },
    });

    return NextResponse.json(newProject);
  } catch (error) {
    console.error('PROJECT_POST', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const projects = await prisma.project.findMany({
      where: {
        userId: user.id,
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('PROJECT_POST', error);
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

    const deletedProject = await prisma.project.delete({
      where: {
        userId: user.id,
        id,
      },
    });

    return NextResponse.json(deletedProject);
  } catch (error) {
    console.error('PROJECT_DELETE', error);
    return new NextResponse('Internal error', { status: 500 });
  }
}
