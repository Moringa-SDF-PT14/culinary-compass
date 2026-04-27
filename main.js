// DOM elements
const searchForm = document.getElementById("search-form")
const searchInput = document.getElementById("search-input")

const recipeContainer =  document.getElementById("recipe-container")
const favoritesContainer = document.getElementById("favorites-container")

const modal = document.getElementById("recipe-modal")
const modalTitle = document.getElementById("modal-title")
const modalContent = document.getElementById("modal-content")
const closeModalBtn = document.getElementById("close-modal-btn")

const fetchFavorites = () => {
    const storedItems = localStorage.getItem("favs") // string form of all favorites
    return JSON.parse(storedItems) || []
}

let favRecipes = fetchFavorites()

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
        // const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`)
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
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

// const renderMealCardAlternative = (meal) => {
//     const outerDiv = document.createElement("div")
//     outerDiv.addEventListener("click", (e) => {
//         clickEvent(meal.id)
//     })
//     outerDiv
// }

// function clickEvent(e){
//     console.log("clicked here")
// }

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
        <li class="favorite-item" data-id="${favorite.id}">
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

// Handle clicks using the container reference
recipeContainer.addEventListener("click", async (e) => {
    const eventTarget = e.target

    const card = eventTarget.closest(".card")
    if(!card) return; // execution stops if item clicked on the container is not a card

    const mealId = card.dataset.id

    const isViewBtn = eventTarget.classList.contains("view-btn")
    const isSaveBtn = eventTarget.classList.contains("fav-btn")

    if(isViewBtn){
        await onViewBtnClick(mealId)
    }

    if(isSaveBtn){
        console.log("Save is clicked", favRecipes)
        const mealName = card.querySelector("h3").textContent
        await onSaveBtnClick(mealId, mealName, eventTarget)
    }

})

async function onViewBtnClick(mealId) {
    modalTitle.textContent = "Loading ..."
    modalContent.innerHTML = "<p> Please wait as we retrieve all the recipe goodness"
    modal.showModal()

    const meal = await fetchRecipeDetails(mealId)

    if(meal){
        modalTitle.textContent = meal.strMeal
        
        let ingredientsList = "<ul>"
        for(let i = 1; i <= 20; i++){
            const key1 = `strIngredient${i}`
            const key2 = `strMeasure${i}`

            const ingredient = meal[key1]
            const measure = meal[key2]

            if(ingredient && ingredient.trim()){
                const item = `<li>${measure} ${ingredient}</li>`
                ingredientsList += item
            }
        }
        ingredientsList += "</ul>"

        modalContent.innerHTML = `
        
            <p><strong>Ingredients:</strong></p>
            ${ingredientsList}
            <br>
            <p><strong>Instructions:</strong></p>
            <p style="white-space: pre-wrap;">${meal.strInstructions}</p>

        `
    }
}

async function onSaveBtnClick(mealId, mealName, target) {

    const exists = favRecipes.find(fav =>  fav.id === mealId)
    
    const originalText = target.innerHTML

    if(!exists){
        const favMeal = { id: mealId, name: mealName }
        favRecipes.push(favMeal)
        const jsonString = JSON.stringify(favRecipes)
        localStorage.setItem("favs", jsonString)

        favRecipes = fetchFavorites()
        displayFavorites(favRecipes)

        // some UI feedback
        target.innerHTML = "Recipe Saved"
    } else {
        target.innerHTML = "Recipe Already Saved"
    }
    setTimeout(() => target.innerHTML = originalText, 3000)
}

favoritesContainer.addEventListener("click", (e) => {
    const isRemoveFavs = e.target.classList.contains("remove-fav-btn")

    if(isRemoveFavs){
        const item = e.target.closest(".favorite-item")
        const mealId = item.dataset.id

        favRecipes = favRecipes.filter(fav => fav.id !== mealId)

        // Update storage and UI
        localStorage.setItem("favs", JSON.stringify(favRecipes))
        
        favRecipes = fetchFavorites()
        displayFavorites(favRecipes)

    }

})

closeModalBtn.addEventListener("click", () => {
    modal.close()
})

async function initApp() {
    displayFavorites(favRecipes)

    // default search
    const initialMeals = await fetchRecipes("potato")
    displayRecipes(initialMeals)
}

document.addEventListener("DOMContentLoaded", () => {
    initApp()
    console.log("Here is the app loaded")
})


