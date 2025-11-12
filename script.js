const findBtn = document.getElementById("find-btn");
const ingredientInput = document.getElementById("ingredient-input");
const recipeList = document.getElementById("recipe-list");

findBtn.addEventListener("click", async () => {
    const input = ingredientInput.value.trim().toLowerCase();
    if (!input) {
        recipeList.innerHTML = "<p>Please enter ingredient(s).</p>";
        return;
    }

    const ingredients = input.split(",").map(i => i.trim()).filter(Boolean);
    recipeList.innerHTML = "<p>Loading recipes…</p>";

    try {
        // Call your Render backend
        const url = `https://your-backend-on-render.onrender.com/api/recipes?ingredients=${ingredients.join(',')}`;
        const res = await fetch(url);
        const data = await res.json();

        if (!data || data.length === 0) {
            recipeList.innerHTML = `<p>No recipes found containing: ${ingredients.join(", ")}</p>`;
            return;
        }

        recipeList.innerHTML = "";

        data.forEach(recipe => {
            const card = document.createElement("div");
            card.classList.add("recipe-card");
            card.innerHTML = `
                <h3>${recipe.title}</h3>
                <img src="${recipe.image}" alt="${recipe.title}" />
                <p><strong>Used:</strong> ${recipe.usedIngredients.map(i => i.name).join(", ")}</p>
                <p class="missing"><strong>Missing:</strong> ${recipe.missedIngredients.map(i => i.name).join(", ")}</p>
                <a href="recipe.html?id=${recipe.id}" class="prepare-btn">Prepare</a>
            `;
            recipeList.appendChild(card);
        });

        // Wait for images to load before Masonry layout
        imagesLoaded(recipeList, function () {
            new Masonry(recipeList, {
                itemSelector: '.recipe-card',
                gutter: 20,
                fitWidth: true,
                horizontalOrder: true
            });
        });

    } catch (err) {
        recipeList.innerHTML = `<p>Error fetching recipes: ${err}</p>`;
    }
});
