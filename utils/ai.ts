import { StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { ChatOpenAI } from "@langchain/openai";
import { JournalEntry } from "@prisma/client";
import { loadQARefineChain } from "langchain/chains";
import { Document } from "langchain/document";
import { z } from "zod";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";

export const analyze = async (content: string) => {
  const model = new ChatOpenAI({
    model: "gpt-3.5-turbo",
    temperature: 0,
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  const zodSchema = z.object({
    mood: z
      .string()
      .describe("the mood of the person who wrote the journal entry."),
    summary: z.string().describe("quick summary of the journal entry."),
    subject: z.string().describe("the subject of the journal entry."),
    color: z
      .string()
      .describe(
        "a hexidecimal color code representing the mood of the journal entry. Example #0101fe for blue representing happiness."
      ),
    negative: z
      .boolean()
      .describe(
        "whether the journal entry is negative or not (i.e does it contain negative emotions?)."
      ),
  });

  const parser = StructuredOutputParser.fromZodSchema(zodSchema);

  const chain = RunnableSequence.from([
    ChatPromptTemplate.fromTemplate(
      "Analyze the following journal entry. !IMPORTANT: Follow the instructions and format your response to match the format instructions!\n{format_instructions}\n{entry}"
    ),
    model,
    parser,
  ]);

  const response = await chain.invoke({
    entry: content,
    format_instructions: parser.getFormatInstructions(),
  });

  try {
    return response;
  } catch (error) {
    console.log(error);
  }
};

export const qa = async (question: string, entries: JournalEntry[]) => {
  const docs = entries.map((entry: JournalEntry) => {
    return new Document({
      pageContent: entry.content,
      metadata: {
        id: entry.id,
        createdAt: entry.createdAt,
      },
    });
  });

  const model = new ChatOpenAI({
    temperature: 0,
    model: "gpt-3.5-turbo",
    apiKey: process.env.OPEN_AI_API_KEY,
  });

  const chain = loadQARefineChain(model);
  const embeddings = new OpenAIEmbeddings({
    apiKey: process.env.OPEN_AI_API_KEY,
  });
  const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
  const relevantDocs = await store.similaritySearch(question);

  const response = await chain.invoke({
    input_documents: relevantDocs,
    question: question,
  });

  return response;
};
