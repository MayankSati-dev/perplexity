import {tavily as Tavily} from "@tavily/core"
import { json } from "zod"

const tavily=Tavily({
    apiKey:process.env.TAVILY_API_KEY
})



export async function searchInternet({ query }) {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      api_key: process.env.TAVILY_API_KEY,
      query,
      search_depth: "advanced",
      include_answer: true
    })
  });

  const data = await res.json();
  return data;
}