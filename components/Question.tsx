"use client";

import { askQuestion } from "@/utils/api";
import { FormEvent, useState } from "react";

const Question = () => {
  const [value, setValue] = useState("");
  const [loading, setIsloading] = useState(false);
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    setIsloading(true);
    const answer = await askQuestion(value);

    setResponse(answer.data.output_text);
    setValue("");
    setIsloading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        type="text"
        placeholder="Ask"
        className="border border-black/20 px-4 py-2 mr-2 text-lg rounded-lg"
        disabled={loading}
      />
      <button
        className="bg-blue-400 px-4 py-2 text-lg rounded-lg"
        type="submit"
        disabled={loading}
      >
        Ask
      </button>
      {loading && <p>Loading...</p>}
      {response && <p>{response}</p>}
    </form>
  );
};

export default Question;
