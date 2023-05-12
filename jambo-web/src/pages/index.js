import { useState } from "react"
import Head from "next/head";

export default function Home() {
  const[apiKey,setApiKey]=useState("");

  const API_URL="https://api.openai.com/v1/chat/completions";
  const [userMessage, setUserMessage]=useState("");
  const [messages,setMessages]=useState([{
    role:"system",
    content:"You are Jambo. A kenyan travelling guide to the interesting sites and impressive accomodations",
  },]);
  
  const sendRequest =async ()=>{
    const response=await fetch(API_URL,{
      method: "POST",
      headers: {
        "Content-Type":"application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body:JSON.stringify({
        model:"gpt-3.5-turbo",
        messages:[{ role: "user", content: "Hello!" }],
      }),
    });
    const resJson=await response.json();
    console.log(resJson);
    setBotMessage(resJson.choices[0].message.content)
  };
  
  return (
    <div className="flex flex-col h-screen">
      <nav className="bg-white shadow w-full">
        <div className="px-4 h-14 flex justify-between items-center">
          <div className="text-xl font-bold">Jambo</div>
          <div>
            <input
            type="password"
            className="border rounded-p1"
            placeholder="Enter API key.."
            value={apiKey}
            onChange={(e)=>setApiKey(e.target.value)}
            />
          </div>
        </div>
      </nav>


    </div>
  
  )
}
