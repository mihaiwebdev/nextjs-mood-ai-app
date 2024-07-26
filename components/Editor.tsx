"use client";

import { updateEntry } from "@/utils/api";
import { JournalEntry } from "@prisma/client";
import { useState } from "react";
import { useAutosave } from "react-autosave";

const Editor = ({ entry }: { entry: JournalEntry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState(entry.analysis);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const { mood, summary, color, negative, subject } = analysis || {};
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

  useAutosave({
    data: value,
    onSave: async (_value) => {
      if (isFirstLoad) {
        setIsFirstLoad(false);
        return;
      }
      setIsLoading(true);
      const { data } = await updateEntry(entry.id, _value);
      setAnalysis(data.analysis);
      setIsLoading(false);
    },
  });

  return (
    <div className="w-full h-full grid grid-cols-3">
      <div className="col-span-2">
        {isLoading && <div className="p-8">loading...</div>}
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full h-full p-8 text-xl outline-none"
        ></textarea>
      </div>

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

export default Editor;
