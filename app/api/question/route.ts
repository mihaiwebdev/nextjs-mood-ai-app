import { qa } from "./../../../utils/ai";
import { prisma } from "../../../utils/db";
import { getCurrentUser } from "../../../utils/auth";
import { NextResponse } from "next/server";
import { JournalEntry } from "@prisma/client";

export const POST = async (request: Request) => {
  const { question } = await request.json();
  const user = await getCurrentUser();

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId: user.id,
    },
    select: {
      id: true,
      content: true,
      createdAt: true,
    },
  });

  const answer = await qa(question, entries as JournalEntry[]);

  return NextResponse.json({ data: answer });
};
