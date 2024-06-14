import prisma from '@/libs/prisma';

import getSession from './getSession';

export default async function GetCurrentUser() {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return null;
    }

    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email as string },
    });
    if (!currentUser) {
      return null;
    }

    return currentUser;
  } catch (error) {
    console.log(error);
  }
}
