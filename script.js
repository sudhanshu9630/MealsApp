const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');

let favouriteMeals = [];

function fetchMeals(searchTerm) {
  fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`)
    .then(response => response.json())
    .then(data => displayMeals(data.meals))
    .catch(error => console.log(error));
}

function displayMeals(meals) {
  searchResults.innerHTML = '';

  meals.forEach(meal => {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal');
    
    const mealImage = document.createElement('img');
    mealImage.src = meal.strMealThumb;
    
    const mealName = document.createElement('h3');
    mealName.textContent = meal.strMeal;
    
    const favButton = document.createElement('button');
    favButton.classList.add('fav-btn');
    favButton.textContent = 'Add to Favourites';
    favButton.addEventListener('click', () => addToFavourites(meal));
    
    mealDiv.appendChild(mealImage);
    mealDiv.appendChild(mealName);
    mealDiv.appendChild(favButton);
    
    searchResults.appendChild(mealDiv);
  });
}

function addToFavourites(meal) {
  if (!isMealInFavourites(meal)) {
    favouriteMeals.push(meal);
    saveFavourites();
  }
}

function isMealInFavourites(meal) {
  return favouriteMeals.some(favMeal => favMeal.idMeal === meal.idMeal);
}

function saveFavourites() {
  localStorage.setItem('favouriteMeals', JSON.stringify(favouriteMeals));
}

function loadFavourites() {
  const savedFavourites = localStorage.getItem('favouriteMeals');
  if (savedFavourites) {
    favouriteMeals = JSON.parse(savedFavourites);
  }
}

function removeFavourite(meal) {
  favouriteMeals = favouriteMeals.filter(favMeal => favMeal.idMeal !== meal.idMeal);
  saveFavourites();
  displayFavourites();
}

function displayFavourites() {
  searchResults.innerHTML = '';

  favouriteMeals.forEach(meal => {
    const mealDiv = document.createElement('div');
    mealDiv.classList.add('meal');
    
    const mealImage = document.createElement('img');
    mealImage.src = meal.strMealThumb;
    
    const mealName = document.createElement('h3');
    mealName.textContent = meal.strMeal;
    
    const removeButton = document.createElement('button');
    removeButton.classList.add('fav-btn', 'remove');
    removeButton.textContent = 'Remove from Favourites';
    removeButton.addEventListener('click', () => removeFavourite(meal));
    
    mealDiv.appendChild(mealImage);
    mealDiv.appendChild(mealName);
    mealDiv.appendChild(removeButton);
    
    searchResults.appendChild(mealDiv);
  });
}

searchInput.addEventListener('input', () => {
  const searchTerm = searchInput.value.trim();
  if (searchTerm) {
    fetchMeals(searchTerm);
  } else {
    searchResults.innerHTML = '';
  }
});

loadFavourites();
displayFavourites();
