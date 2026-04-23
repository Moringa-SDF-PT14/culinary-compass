// DOM elements
const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search-input")

const recipeContainer =  document.getElementById("recipe-container")
const favoritesContainer = document.getElementById("favorites-container")

const modal = document.getElementById("recipe-modal")
const modalTitle = document.getElementById("modal-title")
const modalContent = document.getElementById("modal-content")
const closeModalBtn = document.getElementById("close-modal-btn")

// Access API data
async function fetchRecipes(query) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        const data = await response.json()
        return data.meals;
    } catch (error) {
        console.error("Failed to fetch recipes", error)
        return null
    }
}

async function fetchRecipeDetails(id) {
    try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        const data = await response.json()
        return data.meals ? data.meals[0] : null
    } catch (error){
        console.error("Failed to fetch recipe with id: ", id)
        return null
    }
}

// Paint the DOM
const renderMealCard = (meal) => {
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
    `
}

function displayRecipes(meals){
    recipeContainer.innerHTML = "" // clear any dummy data

    if(!meals){
        recipeContainer.innerHTML = '<p>No recipes found. Try another ingredient</p>'
        return
    }

    const mealCards = meals.map(renderMealCard)
    recipeContainer.innerHTML = mealCards.join("")

}


const renderFavoriteCard = (favorite) => {
    return `
        <li class="favorite-item">
            <span>${favorite.name}</span>
            <button class="remove-fav-btn" title="Remove">✕</button>
        </li>
    `
}

function displayFavorites(favoriteRecipes){
    favoritesContainer.innerHTML = ""
    if(!favoriteRecipes){
        favoritesContainer.innerHTML = '<li class="favorite-item">No favorites yet</li>'
        return
    }
    const favoriteCards = favoriteRecipes.map(renderFavoriteCard)
    favoritesContainer.innerHTML = favoriteCards.join("")
}

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault()

    const searchTerm = searchInput.value.trim()
    if(searchTerm){
        recipeContainer.innerHTML = "<p>Loading recipes</p>"
        const meals = await fetchRecipes(searchTerm)
        displayRecipes(meals)
        searchInput.value = ""
    }
})



