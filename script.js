const findBtn = document.getElementById("find-btn");
const ingredientInput = document.getElementById("ingredient-input");
const recipeList = document.getElementById("recipe-list");

const BACKEND_URL = "https://quickrecipebackend-production.up.railway.app";

function createSafeElement(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
}

function showMessage(msg) {
    recipeList.innerHTML = "";
    recipeList.appendChild(createSafeElement("p", msg));
}

findBtn.addEventListener("click", async () => {
    const input = ingredientInput.value.trim().toLowerCase();
    if (!input) return showMessage("Please enter ingredient(s).");

    const ingredients = input.split(",").map(i => i.trim()).filter(Boolean);
    if (ingredients.length === 0) return showMessage("Please enter valid ingredient(s).");

    showMessage("Loading recipes…");

    try {
        const url = `${BACKEND_URL}/api/recipes?ingredients=${encodeURIComponent(ingredients.join(','))}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch recipes");
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
            return showMessage(`No recipes found containing: ${ingredients.join(", ")}`);
        }

        recipeList.innerHTML = "";

        data.forEach(recipe => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");

            const title = createSafeElement("h3", recipe.title || "Untitled Recipe");
            card.appendChild(title);

            if (recipe.image) {
                const img = document.createElement("img");
                img.src = recipe.image;
                img.alt = recipe.title || "Recipe Image";
                card.appendChild(img);
            }

            const used = createSafeElement("p", `Used: ${recipe.usedIngredients.map(i => i.name).join(", ")}`);
            card.appendChild(used);

            const missing = createSafeElement("p", `Missing: ${recipe.missedIngredients.map(i => i.name).join(", ")}`);
            missing.classList.add("missing");
            card.appendChild(missing);

            const prepareBtn = document.createElement("a");
            prepareBtn.classList.add("prepare-btn");
            prepareBtn.href = `recipe.html?id=${encodeURIComponent(recipe.id)}`;
            prepareBtn.textContent = "Prepare";
            card.appendChild(prepareBtn);

            recipeList.appendChild(card);
        });

        imagesLoaded(recipeList, () => {
            new Masonry(recipeList, {
                itemSelector: '.recipe-card',
                gutter: 20,
                fitWidth: true,
                horizontalOrder: true
            });
        });

    } catch (err) {
        showMessage("Error fetching recipes. Please try again later.");
        console.error(err);
    }
});
