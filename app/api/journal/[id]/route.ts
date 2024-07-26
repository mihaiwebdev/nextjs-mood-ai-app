import { getCurrentUser } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";
import { NextResponse } from "next/server";

export const PATCH = async (request: Request, { params }: Params) => {
  const user = await getCurrentUser();
  const { content } = await request.json();

  const updatedEntry = await prisma.journalEntry.update({
    where: {
      userId: user.id,
      id: params.id,
    },
    data: {
      content,
    },
  });

  if (!updatedEntry) {
    return NextResponse.error();
  }

  return NextResponse.json({ data: updatedEntry });
};
