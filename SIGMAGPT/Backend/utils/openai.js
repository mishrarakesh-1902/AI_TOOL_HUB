// import "dotenv/config";

// const getOpenAIAPIResponse = async(message) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
//         },
//         body: JSON.stringify({
//             model:"openai/gpt-oss-120b:free",      //"gpt-4o-mini"
//             messages: [{
//                 role: "user",
//                 content: message
//             }]
//         })
//     };

//     try {
//         const response = await fetch("https://api.openai.com/v1/chat/completions", options);
//         const data = await response.json();
//         return data.choices[0].message.content; //reply
//     } catch(err) {
//         console.log(err);
//     }
// }

// export default getOpenAIAPIResponse;


// utils/openai.js

// import "dotenv/config";

// const getOpenAIAPIResponse = async (message) => {
//     const options = {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//             "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`, // use your OpenRouter key
//             "HTTP-Referer": "http://localhost:3000",  // change to your domain in production
//             "X-Title": "SigmaGPT"  // your app name
//         },
//         body: JSON.stringify({
//             model: "openai/gpt-oss-120b:free", // keep this if you're using OSS model from OpenRouter
//             messages: [
//                 {
//                     role: "user",
//                     content: message
//                 }
//             ]
//         })
//     };

//     try {
//         const response = await fetch("https://openrouter.ai/api/v1/chat/completions", options);

//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
//         }

//         const data = await response.json();

//         // Debugging: log the whole response to see structure
//         console.log("OpenRouter Response:", JSON.stringify(data, null, 2));

//         // Safety check
//         if (!data.choices || !data.choices.length) {
//             throw new Error("OpenRouter returned no choices");
//         }

//         const aiMessage = data.choices[0].message?.content;
//         if (!aiMessage) {
//             throw new Error("OpenRouter message content missing");
//         }

//         return aiMessage;
//     } catch (err) {
//         console.error("Error in getOpenAIAPIResponse:", err.message);
//         return "Sorry, I couldn't process your request. Please try again.";
//     }
// };

// export default getOpenAIAPIResponse;


// utils/openai.js
import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    try {
        console.log("Using OpenRouter Key:", process.env.OPENROUTER_API_KEY?.slice(0, 10) + "...");

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "HTTP-Referer": "http://localhost:3000", // your frontend domain
                "X-Title": "SigmaGPT"
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-chat-v3-0324:free", // or any OpenRouter-supported model
                messages: [{ role: "user", content: message }]
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        console.log("OpenRouter Response:", JSON.stringify(data, null, 2));

        if (!data.choices || !data.choices.length) {
            throw new Error("OpenRouter returned no choices");
        }

        const aiMessage = data.choices[0].message?.content;
        if (!aiMessage) {
            throw new Error("OpenRouter message content missing");
        }

        return aiMessage;
    } catch (err) {
        console.error("Error in getOpenAIAPIResponse:", err.message);
        return "Sorry, I couldn't process your request. Please try again.";
    }
};

export default getOpenAIAPIResponse;
