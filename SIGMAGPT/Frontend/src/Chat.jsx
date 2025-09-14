// import "./Chat.css";
// import React, { useContext, useState, useEffect } from "react";
// import { MyContext } from "./MyContext";
// import ReactMarkdown from "react-markdown";
// import rehypeHighlight from "rehype-highlight";
// import "highlight.js/styles/github-dark.css";

// function Chat() {
//     const {newChat, prevChats, reply} = useContext(MyContext);
//     const [latestReply, setLatestReply] = useState(null);

//     useEffect(() => {
//         if(reply === null) {
//             setLatestReply(null); //prevchat load
//             return;
//         }

//         if(!prevChats?.length) return;

//         const content = reply.split(" "); //individual words

//         let idx = 0;
//         const interval = setInterval(() => {
//             setLatestReply(content.slice(0, idx+1).join(" "));

//             idx++;
//             if(idx >= content.length) clearInterval(interval);
//         }, 40);

//         return () => clearInterval(interval);

//     }, [prevChats, reply])

//     return (
//         <>
//             {newChat && <h1>Start a New Chat!</h1>}
//             <div className="chats">
//                 {
//                     prevChats?.slice(0, -1).map((chat, idx) => 
//                         <div className={chat.role === "user"? "userDiv" : "gptDiv"} key={idx}>
//                             {
//                                 chat.role === "user"? 
//                                 <p className="userMessage">{chat.content}</p> : 
//                                 <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{chat.content}</ReactMarkdown>
//                             }
//                         </div>
//                     )
//                 }

//                 {
//                     prevChats.length > 0  && (
//                         <>
//                             {
//                                 latestReply === null ? (
//                                     <div className="gptDiv" key={"non-typing"} >
//                                     <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
//                                 </div>
//                                 ) : (
//                                     <div className="gptDiv" key={"typing"} >
//                                      <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{latestReply}</ReactMarkdown>
//                                 </div>
//                                 )

//                             }
//                         </>
//                     )
//                 }

//             </div>
//         </>
//     )
// }

// export default Chat;


import "./Chat.css";
import React, { useContext, useState, useEffect, useRef } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

function Chat() {
  const { newChat, prevChats, reply } = useContext(MyContext);
  const [latestReply, setLatestReply] = useState(null);
  const chatEndRef = useRef(null); // 👈 ref for auto-scroll

  // Typing effect
  useEffect(() => {
    if (reply === null) {
      setLatestReply(null); // reset when loading prevChats
      return;
    }

    if (!prevChats?.length) return;

    const content = reply.split(" "); // typing effect word by word
    let idx = 0;
    const interval = setInterval(() => {
      setLatestReply(content.slice(0, idx + 1).join(" "));
      idx++;
      if (idx >= content.length) clearInterval(interval);
    }, 40);

    return () => clearInterval(interval);
  }, [prevChats, reply]);

  // Auto-scroll when chats update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [prevChats, latestReply]);

  return (
    <div className="chatContainer">
      {newChat && <h1 className="welcomeText">✨ Start a New Chat!</h1>}

      <div className="chats">
        {prevChats?.slice(0, -1).map((chat, idx) => (
          <div
            className={chat.role === "user" ? "userDiv" : "gptDiv"}
            key={idx}
          >
            {chat.role === "user" ? (
              <p className="userMessage">{chat.content}</p>
            ) : (
              <div className="gptMessage">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                  {chat.content}
                </ReactMarkdown>
              </div>
            )}
          </div>
        ))}

        {prevChats.length > 0 && (
          <>
            {latestReply === null ? (
              <div className="gptDiv" key="non-typing">
                <div className="gptMessage">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {prevChats[prevChats.length - 1].content}
                  </ReactMarkdown>
                </div>
              </div>
            ) : (
              <div className="gptDiv" key="typing">
                <div className="gptMessage">
                  <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                    {latestReply}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </>
        )}
        {/* 👇 Dummy div to keep scroll at bottom */}
        <div ref={chatEndRef} />
      </div>
    </div>
  );
}

export default Chat;
