// ==========================================
// PHASE 1: Architecture & State
// ==========================================

// DOM Elements
const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const recipeContainer = document.getElementById('recipe-container');
const favoritesContainer = document.getElementById('favorites-container');

const modal = document.getElementById('recipe-modal');
const modalTitle = document.getElementById('modal-title');
const modalContent = document.getElementById('modal-content');
const closeModalBtn = document.getElementById('close-modal-btn');

// Application State (Load from LocalStorage or default to empty array)
let favoriteRecipes = JSON.parse(localStorage.getItem('favs')) || [];

// Fetch multiple recipes by search term
async function fetchRecipes(query) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
        const data = await response.json();
        return data.meals; // Returns array or null
    } catch (error) {
        console.error("Failed to fetch recipes:", error);
        return null;
    }
}

// Fetch a single recipe's full details by ID
async function fetchRecipeDetails(id) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await response.json();
        return data.meals ? data.meals[0] : null;
    } catch (error) {
        console.error("Failed to fetch recipe details:", error);
        return null;
    }
}

// ==========================================
// PHASE 2 & 5: Painting the DOM
// ==========================================

function displayRecipes(meals) {
    recipeContainer.innerHTML = ''; // Clear previous results

    if (!meals) {
        recipeContainer.innerHTML = `<p style="grid-column: 1/-1;">No recipes found. Try another ingredient!</p>`;
        return;
    }

    const htmlString = meals.map(meal => {
        return `
            <div class="card" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="card-content">
                    <h3>${meal.strMeal}</h3>
                    <div class="card-actions">
                        <button class="btn-tonal view-btn">Recipe Details</button>
                        <button class="btn-tonal fav-btn">❤️ Save</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    recipeContainer.innerHTML = htmlString;
}

function displayFavorites() {
    favoritesContainer.innerHTML = ''; // Clear previous list

    if (favoriteRecipes.length === 0) {
        favoritesContainer.innerHTML = `<li class="favorite-item">No favorites yet!</li>`;
        return;
    }

    const htmlString = favoriteRecipes.map(fav => {
        return `
            <li class="favorite-item" data-id="${fav.id}">
                <span>${fav.name}</span>
                <button class="remove-fav-btn" title="Remove">✕</button>
            </li>
        `;
    }).join('');

    favoritesContainer.innerHTML = htmlString;
}

// ==========================================
// PHASE 3 & 4: Event Listeners & Delegation
// ==========================================

// Handle Searching
searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchTerm = searchInput.value.trim();
    
    if (searchTerm) {
        // Provide visual feedback while loading
        recipeContainer.innerHTML = '<p>Loading recipes...</p>';
        const meals = await fetchRecipes(searchTerm);
        displayRecipes(meals);
        searchInput.value = '';
    }
});

// Handle Clicks inside the Recipe Grid (Delegation)
recipeContainer.addEventListener('click', async (e) => {
    const card = e.target.closest('.card');
    if (!card) return; // Exit if they didn't click inside a card
    
    const mealId = card.dataset.id;

    // --- VIEW DETAILS BUTTON ---
    if (e.target.classList.contains('view-btn')) {
        modalTitle.textContent = "Loading...";
        modalContent.innerHTML = "<p>Please wait...</p>";
        modal.showModal();

        const meal = await fetchRecipeDetails(mealId);
        
        if (meal) {
            modalTitle.textContent = meal.strMeal;
            
            // TheMealDB returns up to 20 ingredients in flat properties. We need to extract them.
            let ingredientsList = "<ul>";
            for(let i = 1; i <= 20; i++) {
                const ingredient = meal[`strIngredient${i}`];
                const measure = meal[`strMeasure${i}`];
                
                if(ingredient && ingredient.trim() !== "") {
                    ingredientsList += `<li>${measure} ${ingredient}</li>`;
                }
            }
            ingredientsList += "</ul>";

            modalContent.innerHTML = `
                <p><strong>Ingredients:</strong></p>
                ${ingredientsList}
                <br>
                <p><strong>Instructions:</strong></p>
                <p style="white-space: pre-wrap;">${meal.strInstructions}</p>
            `;
        }
    }

    // --- SAVE FAVORITE BUTTON ---
    if (e.target.classList.contains('fav-btn')) {
        const mealName = card.querySelector('h3').textContent;
        
        // Check if it's already in the array
        const exists = favoriteRecipes.find(fav => fav.id === mealId);

        if (!exists) {
            favoriteRecipes.push({ id: mealId, name: mealName });
            localStorage.setItem('favs', JSON.stringify(favoriteRecipes));
            displayFavorites();
            
            // Quick UI feedback
            const originalText = e.target.innerHTML;
            e.target.innerHTML = "✔️ Saved";
            setTimeout(() => e.target.innerHTML = originalText, 2000);
        } else {
            e.target.innerHTML = "✔️ Already Saved";
            setTimeout(() => e.target.innerHTML = "❤️ Save", 2000);
        }
    }
});

// Handle Clicks inside the Favorites Sidebar (Delegation)
favoritesContainer.addEventListener('click', (e) => {
    if (e.target.classList.contains('remove-fav-btn')) {
        const item = e.target.closest('.favorite-item');
        const mealId = item.dataset.id;
        
        // Filter out the removed item
        favoriteRecipes = favoriteRecipes.filter(fav => fav.id !== mealId);
        
        // Update Storage & UI
        localStorage.setItem('favs', JSON.stringify(favoriteRecipes));
        displayFavorites();
    }
});

// Close Modal
closeModalBtn.addEventListener('click', () => {
    modal.close();
});

// ==========================================
// INITIALIZATION
// ==========================================
async function init() {
    // Load favorites from local storage
    displayFavorites();
    
    // Load a default search so the screen isn't empty
    const initialMeals = await fetchRecipes("chicken");
    displayRecipes(initialMeals);
}

// Run the app!
init();