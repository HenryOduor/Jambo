import { useState } from "react"
import Head from "next/head";
import { createParser } from "eventsource-parser";
import ReactMarkdown from "react-markdown";
export default function Home() {
  const[apiKey,setApiKey]=useState("");

  const API_URL="https://api.openai.com/v1/chat/completions";
  const [userMessage, setUserMessage]=useState("");
  const [messages,setMessages]=useState([{
    role:"system",
    content:"You are Jambo. A kenyan travelling guide to interesting sites and impressive accomodations for stay periods.",
  },]);
  
  const sendRequest =async ()=>{
    const updatedMessages=[
      ...messages,
      {
        role: "user",
        content: userMessage,
      },
    ];
    setMessages(updatedMessages);
    setUserMessage("");
    try {
      const response=await fetch(API_URL,{
        method: "POST",
        headers: {
          "Content-Type":"application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body:JSON.stringify({
          model:"gpt-3.5-turbo",
          messages:updatedMessages,
          stream:true,
        }),
      });
      const reader = response.body.getReader();

      let newMessage = "";
      const parser = createParser((event) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            return;
          }
          const json = JSON.parse(event.data);
          const content = json.choices[0].delta.content;

          if (!content) {
            return;
          }

          newMessage += content;

          const updatedMessages2 = [
            ...updatedMessages,
            { role: "assistant", content: newMessage },
          ];

          setMessages(updatedMessages2);
        } else {
          return "";
        }
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = new TextDecoder().decode(value);
        parser.feed(text);
      }
    }
      catch (error) {
        console.error("error");
        window.alert("Error:" + error.message);
    }
    
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
      <div className="flex-1 overflow-y-scroll">
          <div className="mx-auto w-full max-w-screen-md p-4 ">
            {messages.filter((msg) => msg.role !== "system").map((msg, idx) => (
                <div key={idx} className="mt-3">
                  <div className="font-bold">
                    {msg.role === "user" ? "You" : "Jambo"}
                  </div>
                  <div className="prose-lg">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
          </div>
      </div>
      <div className="mx-auto w-full max-w-screen-md px-4 pt-0 pb-2 flex">
          <textarea
            className="border rounded-md text-lg p-2 flex-1"
            rows={1}
            placeholder="Feel free to ask me about tour destinations in Kenya..."
            value={userMessage}
            onChange={(e) => setUserMessage(e.target.value)}
          />
          <button
            onClick={sendRequest}
            className="border rounded-md bg-blue-500 hover:bg-blue-600 text-white px-4 ml-2"
          >
            Send
          </button>
        </div>
    </div>
          
  );
}
