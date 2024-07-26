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
  const { mood, summary, color, negative, subject } = entry?.analysis || {};
  const analysisData = [
    {
      name: "Subject",
      value: subject || "",
    },
    {
      name: "Summary",
      value: summary || "",
    },
    {
      name: "Mood",
      value: mood || "",
    },
    {
      name: "Negative",
      value: negative ? "True" : "False",
    },
  ];

  return (
    <div className="h-[calc(100vh-70px)] grid grid-cols-3">
      <div className="col-span-2">{entry && <Editor entry={entry} />}</div>
      <div className="border-l border-black/10">
        <div className=" px-6 py-10" style={{ backgroundColor: color }}>
          <h2 className="text-2xl">Analysis</h2>
        </div>
        <div>
          <ul className="p-4">
            {analysisData.map((item, idx) => (
              <li
                key={idx}
                className="flex py-4 border-b border-black/10 items-center justify-between"
              >
                <span className="text-lg font-semibold">{item.name}</span>
                <span>{item.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EntryPage;
