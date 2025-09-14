// import express from 'express';
// import dotenv from 'dotenv';
// import path from 'path';
// import { fileURLToPath } from 'url';
// import OpenAI from 'openai';

// dotenv.config();

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();
// const PORT = process.env.PORT || 3000;

// const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY;
// const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
// const OPENAI_MODEL = process.env.OPENAI_MODEL || "deepseek/deepseek-chat-v3-0324:free";

// if (!SPOONACULAR_KEY) {
//   console.warn('Warning: Missing SPOONACULAR_API_KEY in .env');
// }
// if (!OPENAI_API_KEY) {
//   console.warn('Warning: Missing OPENAI_API_KEY in .env');
// }

// const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// app.use(express.json());
// app.use(express.static(path.join(__dirname, 'public')));

// app.post('/api/recipe', async (req, res) => {
//   try {
//     const { ingredients, servings, diet, cuisine } = req.body || {};
//     if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
//       return res.status(400).json({ error: 'Please send an array `ingredients` with at least 1 item.' });
//     }

//     // 1) Find candidate recipes by ingredients (Spoonacular)
//     const query = encodeURIComponent(ingredients.join(','));
//     const findUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${SPOONACULAR_KEY}&ingredients=${query}&number=5&ranking=1&ignorePantry=true`;

//     const findResp = await fetch(findUrl);
//     if (!findResp.ok) {
//       const text = await findResp.text();
//       throw new Error(`Spoonacular findByIngredients error: ${findResp.status} ${text}`);
//     }
//     const candidates = await findResp.json();
//     if (!Array.isArray(candidates) || candidates.length === 0) {
//       return res.status(200).json({
//         title: 'No direct matches found',
//         markdown: `I couldn't find a recipe that uses your exact ingredients. Try adding a few more pantry items or removing uncommon ones.`
//       });
//     }

//     // Pick the one using most of the provided ingredients, fallback to first
//     const pick = candidates.sort((a, b) => {
//       const au = (a.usedIngredients || []).length;
//       const bu = (b.usedIngredients || []).length;
//       const am = (a.missedIngredients || []).length;
//       const bm = (b.missedIngredients || []).length;
//       // prioritize more used, fewer missed
//       if (bu !== au) return bu - au;
//       return am - bm;
//     })[0];

//     // 2) Get details for the picked recipe
//     const infoUrl = `https://api.spoonacular.com/recipes/${pick.id}/information?apiKey=${SPOONACULAR_KEY}&includeNutrition=false`;
//     const infoResp = await fetch(infoUrl);
//     if (!infoResp.ok) {
//       const text = await infoResp.text();
//       throw new Error(`Spoonacular information error: ${infoResp.status} ${text}`);
//     }
//     const info = await infoResp.json();

//     // Build a compact data bundle for the LLM
//     const context = {
//       chosenRecipe: {
//         id: info.id,
//         title: info.title,
//         readyInMinutes: info.readyInMinutes,
//         servings: info.servings,
//         sourceName: info.sourceName,
//         sourceUrl: info.sourceUrl,
//         image: info.image,
//         cuisines: info.cuisines,
//         vegetarian: info.vegetarian,
//         vegan: info.vegan,
//         glutenFree: info.glutenFree,
//         dairyFree: info.dairyFree,
//         cheap: info.cheap,
//         veryPopular: info.veryPopular,
//         summary: info.summary,
//         extendedIngredients: (info.extendedIngredients || []).map(i => ({
//           name: i.name,
//           amount: i.amount,
//           unit: i.unit
//         }))
//       },
//       userPantry: ingredients,
//       userPrefs: { servings, diet, cuisine }
//     };

//     // 3) Ask OpenAI to craft a clean, step-by-step recipe (Markdown)
//     const instructions = `
// Given:
// - A candidate recipe (structured data below) matched from Spoonacular by the user's ingredients.
// - The user's pantry items and optional preferences.

// Task:
// Write a complete, practical recipe **in Markdown** that the user can cook right now, while maximizing the use of their ingredients. If items are missing, suggest simple substitutes.

// **Format strictly:**
// # {Recipe Title}
// - Servings: X
// - Time: Y minutes
// - Style/Notes: (diet/cuisine if applicable)

// ## Ingredients
// - Use bullet list with exact amounts. If amounts are unknown, provide reasonable estimates.

// ## Instructions
// 1. Step-by-step, concise, numbered. Avoid ambiguous phrasing.

// ## Tips & Substitutions
// - Brief helpful tips, storage, or swaps based on the pantry.

// If the user requested a specific servings count, scale amounts accordingly.
// Prefer metric + common household measures (cups, tsp) together when useful.
// Make it beginner-friendly but not patronizing.
//     `.trim();

//     const response = await openai.responses.create({
//       model: OPENAI_MODEL,
//       input: [
//         { role: 'system', content: 'You are a culinary expert and recipe developer. Output only valid Markdown as instructed.' },
//         { role: 'user', content: instructions },
//         { role: 'user', content: 'Structured data:\n' + JSON.stringify(context, null, 2) }
//       ]
//     });

//     const markdown = response.output_text || 'Sorry, I could not generate a recipe.';

//     res.json({
//       title: info.title,
//       image: info.image,
//       markdown
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message || 'Server error' });
//   }
// });

// app.listen(PORT, () => {
//   console.log(`AI Recipe Generator listening on http://localhost:${PORT}`);
// });


// server.js
import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch'; // If using Node 18+, fetch is built-in

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// API Keys
const SPOONACULAR_KEY = process.env.SPOONACULAR_API_KEY;
const OPENROUTER_KEY = process.env.OPENROUTER_API_KEY; // Your OpenRouter key
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat-v3-0324:free";

if (!SPOONACULAR_KEY) {
  console.warn('Warning: Missing SPOONACULAR_API_KEY in .env');
}
if (!OPENROUTER_KEY) {
  console.warn('Warning: Missing OPENROUTER_API_KEY in .env');
}

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/recipe', async (req, res) => {
  try {
    const { ingredients, servings, diet, cuisine } = req.body || {};
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ error: 'Please send an array `ingredients` with at least 1 item.' });
    }

    // --- 1) Spoonacular: find candidate recipes ---
    const query = encodeURIComponent(ingredients.join(','));
    const findUrl = `https://api.spoonacular.com/recipes/findByIngredients?apiKey=${SPOONACULAR_KEY}&ingredients=${query}&number=5&ranking=1&ignorePantry=true`;
    const findResp = await fetch(findUrl);
    if (!findResp.ok) {
      const text = await findResp.text();
      throw new Error(`Spoonacular findByIngredients error: ${findResp.status} ${text}`);
    }
    const candidates = await findResp.json();
    if (!Array.isArray(candidates) || candidates.length === 0) {
      return res.status(200).json({
        title: 'No direct matches found',
        markdown: `I couldn't find a recipe that uses your exact ingredients. Try adding a few more pantry items or removing uncommon ones.`
      });
    }

    // Pick the recipe using most ingredients
    const pick = candidates.sort((a, b) => {
      const au = (a.usedIngredients || []).length;
      const bu = (b.usedIngredients || []).length;
      const am = (a.missedIngredients || []).length;
      const bm = (b.missedIngredients || []).length;
      if (bu !== au) return bu - au;
      return am - bm;
    })[0];

    // --- 2) Get full recipe info ---
    const infoUrl = `https://api.spoonacular.com/recipes/${pick.id}/information?apiKey=${SPOONACULAR_KEY}&includeNutrition=false`;
    const infoResp = await fetch(infoUrl);
    if (!infoResp.ok) {
      const text = await infoResp.text();
      throw new Error(`Spoonacular information error: ${infoResp.status} ${text}`);
    }
    const info = await infoResp.json();

    // --- 3) Build structured context ---
    const context = {
      chosenRecipe: {
        id: info.id,
        title: info.title,
        readyInMinutes: info.readyInMinutes,
        servings: info.servings,
        sourceName: info.sourceName,
        sourceUrl: info.sourceUrl,
        image: info.image,
        cuisines: info.cuisines,
        vegetarian: info.vegetarian,
        vegan: info.vegan,
        glutenFree: info.glutenFree,
        dairyFree: info.dairyFree,
        cheap: info.cheap,
        veryPopular: info.veryPopular,
        summary: info.summary,
        extendedIngredients: (info.extendedIngredients || []).map(i => ({
          name: i.name,
          amount: i.amount,
          unit: i.unit
        }))
      },
      userPantry: ingredients,
      userPrefs: { servings, diet, cuisine }
    };

    // --- 4) Prepare instructions for OpenRouter ---
    const instructions = `
Given:
- A candidate recipe (structured data below) matched from Spoonacular by the user's ingredients.
- The user's pantry items and optional preferences.

Task:
Write a complete, practical recipe **in Markdown** that the user can cook right now, while maximizing the use of their ingredients. If items are missing, suggest simple substitutes.

**Format strictly:**
# {Recipe Title}
- Servings: X
- Time: Y minutes
- Style/Notes: (diet/cuisine if applicable)

## Ingredients
- Use bullet list with exact amounts. If amounts are unknown, provide reasonable estimates.

## Instructions
1. Step-by-step, concise, numbered. Avoid ambiguous phrasing.

## Tips & Substitutions
- Brief helpful tips, storage, or swaps based on the pantry.

If the user requested a specific servings count, scale amounts accordingly.
Prefer metric + common household measures (cups, tsp) together when useful.
Make it beginner-friendly but not patronizing.
    `.trim();

    // --- 5) Call OpenRouter API ---
    const orResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: OPENROUTER_MODEL,
        messages: [
          { role: "system", content: "You are a culinary expert and recipe developer. Output only valid Markdown as instructed." },
          { role: "user", content: instructions },
          { role: "user", content: 'Structured data:\n' + JSON.stringify(context, null, 2) }
        ]
      })
    });

    if (!orResponse.ok) {
      const text = await orResponse.text();
      throw new Error(`OpenRouter API error: ${orResponse.status} ${text}`);
    }

    const orData = await orResponse.json();
    const markdown = orData.choices?.[0]?.message?.content || 'Sorry, I could not generate a recipe.';

    // --- 6) Respond to frontend ---
    res.json({
      title: info.title,
      image: info.image,
      markdown
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`AI Recipe Generator listening on http://localhost:${PORT}`);
});
