import Editor from "@/components/Editor";
import { getCurrentUser } from "@/utils/auth";
import { prisma } from "@/utils/db";
import { Params } from "next/dist/shared/lib/router/utils/route-matcher";

const getEntry = async (id: string) => {
  const user = await getCurrentUser();

  const entry = await prisma.journalEntry.findUnique({
    where: {
      userId: user.id,
      id: id,
    },
    include: {
      analysis: true,
    },
  });

  return entry;
};

const EntryPage = async ({ params }: Params) => {
  const entry = await getEntry(params.id);

  return (
    <div className="h-[calc(100vh-70px)] ">
      {entry && <Editor entry={entry} />}
    </div>
  );
};

export default EntryPage;
