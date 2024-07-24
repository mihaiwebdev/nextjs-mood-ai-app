import { auth } from "@clerk/nextjs/server";
import { prisma } from "./db";

export const getCurrentUser = async () => {
  const { userId } = await auth();

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      clerkId: userId as string,
    },
  });

  return user;
};
