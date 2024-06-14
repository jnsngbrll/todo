import { NextResponse } from 'next/server';

import getCurrentUser from '@/actions/getCurrentUser';
import prisma from '@/libs/prisma';

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();

    const body = await req.json();
    const { title, description, project } = body;

    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    if (!title) {
      return new NextResponse('Task title is required.', { status: 400 });
    }

    const task = await prisma.task.create({
      data: {
        title,
        description,
        project,
        userId: user.id,
      },
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('TASK_POST', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

// export async function GET(req: Request) {
//   try {
//     const user = await getCurrentUser();
//     if (!user?.id) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const tasks = await prisma.task.findMany({
//       where: { userId: user.id },
//     });

//     return NextResponse.json(tasks);
//   } catch (error) {
//     console.error('TASK_GET', error);
//     return NextResponse.json({ error: 'Internal error' }, { status: 500 });
//   }
// }

export async function GET(req: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const url = new URL(req.url);
    const taskId = url.searchParams.get('id');

    if (taskId) {
      const task = await prisma.task.findFirst({
        where: { id: taskId, userId: user.id },
      });

      if (!task) {
        return new NextResponse('Task not found', { status: 404 });
      }

      return NextResponse.json(task);
    } else {
      const tasks = await prisma.task.findMany({
        where: { userId: user.id },
      });

      return NextResponse.json(tasks);
    }
  } catch (error) {
    console.error('TASK_GET', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, isCompleted } = body;

    const user = await getCurrentUser();
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const updatedTask = await prisma.task.update({
      where: { id },
      data: { isCompleted },
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error('TASK_UPDATE', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json();
    const { id } = body;

    const user = await getCurrentUser();
    if (!user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const deletedTask = await prisma.task.delete({
      where: { id },
    });

    return NextResponse.json(deletedTask);
  } catch (error) {
    console.error('TASK_DELETE', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
