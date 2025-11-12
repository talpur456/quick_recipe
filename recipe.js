const detailsDiv = document.getElementById("recipe-details");
const params = new URLSearchParams(window.location.search);
const recipeId = params.get("id");

if (!recipeId) {
    detailsDiv.innerHTML = "<p>Invalid recipe.</p>";
} else {
    // Call backend endpoint for recipe details
    fetch(`https://your-backend-on-render.onrender.com/api/recipe/${recipeId}`)
        .then(res => res.json())
        .then(recipe => {
            if (!recipe || !recipe.extendedIngredients) {
                detailsDiv.innerHTML = "<p>Recipe details not available.</p>";
                return;
            }

            const ingredients = recipe.extendedIngredients
                .map(i => `${i.name} - ${i.amount} ${i.unit}`)
                .join(", ");

            detailsDiv.innerHTML = `
                <h2>${recipe.title}</h2>
                <img src="${recipe.image}" alt="${recipe.title}" />
                <p><strong>Ingredients:</strong> ${ingredients}</p>
                <p><strong>Instructions:</strong> ${recipe.instructions || "N/A"}</p>
            `;
        })
        .catch(err => {
            detailsDiv.innerHTML = `<p>Error loading recipe: ${err}</p>`;
        });
}
