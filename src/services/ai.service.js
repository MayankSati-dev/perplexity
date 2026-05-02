import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {HumanMessage, SystemMessage,AIMessage,tool,createAgent} from "langchain"
import * as z from "zod"
import { searchInternet } from "./internet.service.js";
import { query } from "express-validator";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
})
const MistralmoDel=new ChatMistralAI({
   model:"mistral-small-latest",
   apiKey:process.env.MISTRAL_API_KEY
})






const searchInternetTool = tool(searchInternet, {
  name: "searchInternet",
  description:
    "Search the internet for latest, current, or real-time information like news, date, weather, or recent updates.",
  schema: z.object({
    query: z.string().describe("Search query for internet")
  })
});


function shouldSearch(query) {
  const keywords = ["today", "latest", "current", "news", "recent"];
  return keywords.some(k => query.toLowerCase().includes(k));
}
const agent = createAgent({
  model: MistralmoDel,
  tools: [searchInternetTool],
});

export async function generateResponse(messages) {
  const lastMessage = messages[messages.length - 1].content;


  if (shouldSearch(lastMessage)) {
    console.log("👉 FORCING TAVILY");

    const result = await searchInternet({ query: lastMessage });

    const clean = result.results?.map(r => r.content).join("\n");

    const final = await MistralmoDel.invoke([
      new HumanMessage(`
Question: ${lastMessage}

Search Results:
${clean}

Answer ONLY using these results.
Do not guess.
      `)
    ]);

    return final.content;
  }


  const response = await agent.invoke({
    messages: [
      new SystemMessage("You are a helpful assistant."),
      ...messages.map(msg =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      )
    ]
  });

  return response.messages.at(-1).content;
}

export async function generateChatitle(message){
   const response=MistralmoDel.invoke([
     new SystemMessage(
        `you are a helpfull assistant that generates concise and descriptive titles for chat conversations.
        
        user will provide you  with th first message of a chat conversation and you will generate a title that
        captures the essence of the conversation in 1-2 words.the  title should be clear,relevant.and engaging,
        giving users a quick understanding of the chat's topic.  `
    ),
    new HumanMessage(`generate a title with the based on the following first message:"${message}"`)

   ])
   return response
}