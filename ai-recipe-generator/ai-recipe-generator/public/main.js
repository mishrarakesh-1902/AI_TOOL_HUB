// const el = (id) => document.getElementById(id);

// function mdToHtml(md) {
//   // Very light Markdown to HTML (headers, lists, paragraphs). For rich rendering, swap in a real parser.
//   // This keeps the demo dependency-free.
//   const lines = md.split('\n');
//   let html = '';
//   let inList = false;
//   for (const line of lines) {
//     if (/^# (.*)/.test(line)) {
//       if (inList) { html += '</ul>'; inList = false; }
//       html += `<h1>${line.replace(/^# /, '')}</h1>`;
//     } else if (/^## (.*)/.test(line)) {
//       if (inList) { html += '</ul>'; inList = false; }
//       html += `<h2>${line.replace(/^## /, '')}</h2>`;
//     } else if (/^### (.*)/.test(line)) {
//       if (inList) { html += '</ul>'; inList = false; }
//       html += `<h3>${line.replace(/^### /, '')}</h3>`;
//     } else if (/^\d+\.\s+/.test(line)) {
//       if (inList) { html += '</ul>'; inList = false; }
//       html += `<p>${line}</p>`;
//     } else if (/^\-\s+/.test(line)) {
//       if (!inList) { html += '<ul>'; inList = true; }
//       html += `<li>${line.replace(/^\-\s+/, '')}</li>`;
//     } else if (line.trim() === '') {
//       if (inList) { html += '</ul>'; inList = false; }
//       html += '<br/>';
//     } else {
//       html += `<p>${line}</p>`;
//     }
//   }
//   if (inList) html += '</ul>';
//   return html;
// }

// async function generate() {
//   const ingredients = el('ingredients').value.split(',').map(s => s.trim()).filter(Boolean);
//   const servings = Number(el('servings').value) || undefined;
//   const diet = el('diet').value.trim() || undefined;
//   const cuisine = el('cuisine').value.trim() || undefined;
//   const status = el('status');
//   const result = el('result');
//   const pickedTitle = el('picked-title');
//   const pickedImg = el('picked-img');
//   const recipeMarkdown = el('recipe-markdown');

//   if (ingredients.length === 0) {
//     status.textContent = 'Please enter at least one ingredient.';
//     return;
//   }
//   status.textContent = 'Thinking...';
//   result.classList.add('hidden');
//   pickedTitle.textContent = '';
//   pickedImg.src = '';

//   try {
//     const resp = await fetch('/api/recipe', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ ingredients, servings, diet, cuisine })
//     });
//     const data = await resp.json();
//     if (!resp.ok) throw new Error(data.error || 'Request failed');

//     pickedTitle.textContent = data.title || 'Recipe';
//     if (data.image) {
//       pickedImg.src = data.image;
//       pickedImg.alt = data.title || 'Recipe';
//     }
//     recipeMarkdown.innerHTML = mdToHtml(data.markdown || 'No recipe generated.');
//     result.classList.remove('hidden');
//     status.textContent = '';
//   } catch (err) {
//     console.error(err);
//     status.textContent = err.message || 'Something went wrong.';
//   }
// }

// document.addEventListener('DOMContentLoaded', () => {
//   el('generate').addEventListener('click', generate);
//   el('ingredients').addEventListener('keydown', (e) => {
//     if (e.key === 'Enter') generate();
//   });
// });




// Helper function
const el = (id) => document.getElementById(id);

// Simple Markdown to HTML conversion
function mdToHtml(md) {
  const lines = md.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    if (/^# (.*)/.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h1>${line.replace(/^# /, '')}</h1>`;
    } else if (/^## (.*)/.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h2>${line.replace(/^## /, '')}</h2>`;
    } else if (/^### (.*)/.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<h3>${line.replace(/^### /, '')}</h3>`;
    } else if (/^\d+\.\s+/.test(line)) {
      if (inList) { html += '</ul>'; inList = false; }
      html += `<p>${line}</p>`;
    } else if (/^\-\s+/.test(line)) {
      if (!inList) { html += '<ul>'; inList = true; }
      html += `<li>${line.replace(/^\-\s+/, '')}</li>`;
    } else if (line.trim() === '') {
      if (inList) { html += '</ul>'; inList = false; }
      html += '<br/>';
    } else {
      html += `<p>${line}</p>`;
    }
  }

  if (inList) html += '</ul>';
  return html;
}

// Recipe generation function
async function generate() {
  const ingredients = el('ingredients').value.split(',').map(s => s.trim()).filter(Boolean);
  const servings = Number(el('servings').value) || undefined;
  const diet = el('diet').value.trim() || undefined;
  const cuisine = el('cuisine').value.trim() || undefined;
  const status = el('status');
  const result = el('result');
  const pickedTitle = el('picked-title');
  const pickedImg = el('picked-img');
  const recipeMarkdown = el('recipe-markdown');

  if (ingredients.length === 0) {
    status.textContent = 'Please enter at least one ingredient.';
    return;
  }

  status.textContent = 'Thinking...';
  result.classList.add('hidden');
  pickedTitle.textContent = '';
  pickedImg.src = '';
  recipeMarkdown.innerHTML = '';

  try {
    const resp = await fetch('/api/recipe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, servings, diet, cuisine })
    });
    const data = await resp.json();
    if (!resp.ok) throw new Error(data.error || 'Request failed');

    pickedTitle.textContent = data.title || 'Recipe';
    if (data.image) {
      pickedImg.src = data.image;
      pickedImg.alt = data.title || 'Recipe';
    }
    recipeMarkdown.innerHTML = mdToHtml(data.markdown || 'No recipe generated.');
    result.classList.remove('hidden');
    status.textContent = '';
  } catch (err) {
    console.error(err);
    status.textContent = err.message || 'Something went wrong.';
  }
}

// Falling vegetables animation
const veggies = ['🍅','🥕','🌽','🥦','🫑']; // emojis for veggies
const container = document.querySelector('.falling-veggies');

function createVeg() {
  const veg = document.createElement('div');
  veg.classList.add('veg');
  veg.textContent = veggies[Math.floor(Math.random()*veggies.length)];
  veg.style.left = Math.random()*100 + 'vw';
  veg.style.fontSize = (20 + Math.random()*20) + 'px';
  veg.style.animationDuration = (5 + Math.random()*5) + 's';
  container.appendChild(veg);
  setTimeout(() => veg.remove(), 10000);
}

setInterval(createVeg, 500);

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  el('generate').addEventListener('click', generate);
  el('ingredients').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') generate();
  });
});
