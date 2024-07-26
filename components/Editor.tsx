"use client";

import { updateEntry } from "@/utils/api";
import { JournalEntry } from "@prisma/client";
import { useState } from "react";
import { useAutosave } from "react-autosave";

const Editor = ({ entry }: { entry: JournalEntry }) => {
  const [value, setValue] = useState(entry.content);
  const [isLoading, setIsLoading] = useState(false);

  useAutosave({
    data: value,
    onSave: async (_value) => {
      setIsLoading(true);
      const updated = await updateEntry(entry.id, _value);
      setIsLoading(false);
    },
  });

  return (
    <div className="w-full h-full">
      {isLoading && <div className="p-8">loading...</div>}
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full h-full p-8 text-xl outline-none"
      ></textarea>
    </div>
  );
};

export default Editor;
