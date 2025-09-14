// import OpenAI from 'openai';
// import 'dotenv/config';

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
// });

// const response = await client.responses.create({
//   model: 'gpt-4o-mini',
//   input: 'Joke related to computer science',
// });

// console.log(response.output_text);



// import express from 'express';
// import cors from 'cors';
// import 'dotenv/config';
// import mongoose from 'mongoose';
// import chatRoutes from './routes/chat.js';


// const app = express();
// const PORT = 8080;

// app.use(express.json());
// app.use(cors());


// app.use('/api', chatRoutes);

// app.listen(PORT, () => {
//   console.log(`server running on ${PORT}`);
//   connectDB();
// });

// const connectDB = async () => {
//     try {
//         await mongoose.connect(process.env.MONGODB_URL); 
//         console.log("Connected with Database");
        
//     } catch (err) {
//         console.log("Failded to connect with db" , err);
//     }
// };


import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import mongoose from 'mongoose';
import chatRoutes from './routes/chat.js';

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api', chatRoutes);

// Connect DB first, then start server
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("✅ Connected with Database");
    } catch (err) {
        console.error("❌ Failed to connect with DB", err.message);
        process.exit(1); // stop server if DB fails
    }
};

const startServer = async () => {
    try {
        // Debugging: check env variables
        console.log("🔑 OpenRouter Key Loaded:", process.env.OPENROUTER_API_KEY?.slice(0, 10) + "...");
        console.log("🗄️ MongoDB URL Loaded:", process.env.MONGODB_URL ? "Yes" : "No");

        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Server failed to start:", err.message);
    }
};

startServer();
