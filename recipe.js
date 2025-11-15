const detailsDiv = document.getElementById("recipe-details");
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

const BACKEND_URL = "https://quickrecipebackend-production.up.railway.app";

function createSafeElement(tag, text) {
    const el = document.createElement(tag);
    el.textContent = text;
    return el;
}

if (!recipeId) {
    detailsDiv.innerHTML = "";
    detailsDiv.appendChild(createSafeElement("p", "Invalid recipe."));
} else {
    fetch(`${BACKEND_URL}/api/recipe/${encodeURIComponent(recipeId)}`)
        .then(res => {
            if (!res.ok) throw new Error("Failed to load recipe");
            return res.json();
        })
        .then(recipe => {
            detailsDiv.innerHTML = "";
            if (!recipe || !recipe.extendedIngredients) {
                detailsDiv.appendChild(createSafeElement("p", "Recipe details not available."));
                return;
            }

            const title = createSafeElement("h2", recipe.title || "Untitled Recipe");
            detailsDiv.appendChild(title);

            if (recipe.image) {
                const img = document.createElement("img");
                img.src = recipe.image;
                img.alt = recipe.title || "Recipe Image";
                detailsDiv.appendChild(img);
            }

            const ingredientsText = recipe.extendedIngredients
                .map(i => `${i.name} - ${i.amount} ${i.unit}`)
                .join(", ");
            detailsDiv.appendChild(createSafeElement("p", `Ingredients: ${ingredientsText}`));

            const instructions = recipe.instructions || "N/A";
            detailsDiv.appendChild(createSafeElement("p", `Instructions: ${instructions}`));
        })
        .catch(err => {
            detailsDiv.innerHTML = "";
            detailsDiv.appendChild(createSafeElement("p", "Error loading recipe. Please try again later."));
            console.error(err);
        });
}
