# AI Recipe Generator (Spoonacular + OpenAI)

A tiny full-stack app where you enter ingredients you have at home and get an AI-generated recipe.
- Finds matching recipes using **Spoonacular** (Search by Ingredients)
- Uses **OpenAI** to generate a polished, step-by-step recipe based on what you have

## 🚀 Quick Start

1) **Install requirements**
```bash
cd ai-recipe-generator
npm install
```

2) **Set environment variables**
Create a `.env` file in the project root (next to `server.js`) based on `.env.example`:
```
OPENAI_API_KEY=sk-...
SPOONACULAR_API_KEY=...
OPENAI_MODEL=gpt-4o-mini
PORT=3000
```

3) **Run the server**
```bash
npm run dev
```
Then open http://localhost:3000

---

## 🧠 How it works

- On submit, the frontend POSTs to `/api/recipe` with a list of ingredients.
- The server calls Spoonacular’s `findByIngredients` to retrieve candidate recipes and fetches info for the best match.
- The server asks OpenAI to craft a clear, complete recipe (title, servings, time, ingredient list with quantities, instructions, tips). The response is returned as Markdown and rendered in the UI.

## 🔐 API Keys
- Get a Spoonacular key: https://spoonacular.com/food-api
- Get an OpenAI key: https://platform.openai.com/ (create a project and key)
- Never commit your `.env` file.

## 🧪 Notes
- Default OpenAI model is `gpt-4o-mini` to keep cost/perf balanced. Upgrade to `gpt-4o` for stronger reasoning or set any supported text model in `.env`.
- This project uses native `fetch` in Node 18+.

## 📦 Deploy
Any Node host works. Ensure env vars are set on your platform and that the server can serve the static `public/` folder.

## 📁 Project Structure
```
ai-recipe-generator/
├─ public/
│  ├─ index.html
│  ├─ styles.css
│  └─ main.js
├─ .env.example
├─ package.json
├─ server.js
└─ README.md
```
