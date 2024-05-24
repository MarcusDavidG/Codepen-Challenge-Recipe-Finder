const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-btn");
const recipeCardsContainer = document.getElementById("recipe-cards");
const recipeModal = document.getElementById("recipe-modal");
const modalContent = document.querySelector(".modal-content");
const closeModal = document.querySelector(".close");

searchButton.addEventListener("click", searchRecipes);
closeModal.addEventListener("click", closeRecipeModal);
window.addEventListener("click", outsideClick);

function searchRecipes() {
  const query = searchInput.value.trim();
  if (query !== "") {
    fetchRecipes(query);
  }
}

async function fetchRecipes(query) {
  const apiKey = "your_api_key_here"; // Replace with your API key
  const endpoint = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}&number=6`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch recipes");
    }
    const data = await response.json();
    displayRecipes(data.results);
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

function displayRecipes(recipes) {
  recipeCardsContainer.innerHTML = "";
  recipes.forEach((recipe) => {
    const recipeCard = document.createElement("div");
    recipeCard.classList.add("recipe-card");
    recipeCard.innerHTML = `
      <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%">
      <h2>${recipe.title}</h2>
      <button class="show-recipe-btn" data-id="${recipe.id}">View Recipe</button>
    `;
    recipeCard
      .querySelector(".show-recipe-btn")
      .addEventListener("click", () => openRecipeModal(recipe.id));
    recipeCardsContainer.appendChild(recipeCard);
  });
}

async function openRecipeModal(recipeId) {
  const apiKey = "your_api_key_here"; // Replace with your API key
  const recipeEndpoint = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

  try {
    const response = await fetch(recipeEndpoint);
    if (!response.ok) {
      throw new Error("Failed to fetch recipe details");
    }
    const recipeData = await response.json();
    populateModal(recipeData);
    recipeModal.style.display = "block";
  } catch (error) {
    console.error("Error fetching recipe details:", error);
  }
}

function populateModal(recipe) {
  modalContent.innerHTML = `
    <span class="close">&times;</span>
    <h2 id="modal-title">${recipe.title}</h2>
    <div id="modal-body">
      <img src="${recipe.image}" alt="${recipe.title}" style="width: 100%">
      <h3>Ingredients:</h3>
      <ul>
        ${recipe.extendedIngredients
          .map((ingredient) => `<li>${ingredient.original}</li>`)
          .join("")}
      </ul>
      <h3>Instructions:</h3>
      <p>${recipe.instructions}</p>
    </div>
  `;
  document.querySelector(".close").addEventListener("click", closeRecipeModal);
}

function closeRecipeModal() {
  recipeModal.style.display = "none";
}

function outsideClick(e) {
  if (e.target === recipeModal) {
    recipeModal.style.display = "none";
  }
}
