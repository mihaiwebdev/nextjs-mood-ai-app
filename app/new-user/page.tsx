import { prisma } from "@/utils/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const createNewUser = async () => {
  const user = await currentUser();

  const match = await prisma.user.findUnique({
    where: {
      clerkId: user?.id as string,
    },
  });

  if (!match) {
    await prisma.user.create({
      data: {
        clerkId: user?.id as string,
        email: user?.primaryEmailAddress?.emailAddress as string,
      },
    });
  }

  redirect("journal");
};

const NewUserPage = async () => {
  await createNewUser();

  return <></>;
};

export default NewUserPage;
