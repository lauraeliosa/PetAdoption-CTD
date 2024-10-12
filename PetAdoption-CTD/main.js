const primaryHeader = document.querySelector('.primary-header');
const navToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.primary-navigation');

navToggle.addEventListener('click', () => {
    // used for accessibility 
    primaryNav.hasAttribute('data-visible')
        ? navToggle.setAttribute('aria-expanded', false)
        : navToggle.setAttribute('aria-expanded', true);
    // this toggles the 'data-visible' attribute on the primaryNav. When it's present it will be removed and when it's not there it will be added. 
    primaryNav.toggleAttribute('data-visible');
    // this has something to do with the shadowing of the nav when it's opened in mobile 
    primaryHeader.toggleAttribute('data-overlay');
});

const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;
const DOG_API_KEY = import.meta.env.VITE_DOG_API_KEY;

// Function to fetch and display cat images
async function fetchCats(limit = 10) {
    const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&api_key=${CAT_API_KEY}`);
    const data = await response.json();
    displayImages(data, 'cat');
}

// Function to fetch and display dog images
async function fetchDogs(limit = 10) {
    const response = await fetch(`https://api.thedogapi.com/v1/images/search?limit=${limit}&api_key=${DOG_API_KEY}`);
    const data = await response.json();
    displayImages(data, 'dog');
}

// Display images in the DOM
function displayImages(images, type) {
    const container = document.getElementById(`${type}-container`);
    container.innerHTML = ''; // Clear any existing images
    images.forEach(image => {
        const img = document.createElement('img');
        img.src = image.url;
        img.alt = `${type} image`;
        img.classList.add('pet-image');
        container.appendChild(img);
    });
}

// Fetch cat breeds
async function fetchCatBreeds() {
    const response = await fetch(`https://api.thecatapi.com/v1/breeds?api_key=${CAT_API_KEY}`);
    const breeds = await response.json();
    populateBreedSelect(breeds, 'cat');
}

// Fetch dog breeds
async function fetchDogBreeds() {
    const response = await fetch(`https://api.thedogapi.com/v1/breeds?api_key=${DOG_API_KEY}`);
    const breeds = await response.json();
    populateBreedSelect(breeds, 'dog');
}

// Populate breed select dropdown
function populateBreedSelect(breeds, type) {
    const select = document.getElementById(`${type}-breed-select`);
    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        select.appendChild(option);
    });
}

// Fetch images by breed
async function fetchImagesByBreed(type, breedId) {
    const apiURL = type === 'cat' 
        ? `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${CAT_API_KEY}`
        : `https://api.thedogapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${DOG_API_KEY}`;
  
    try {
        const response = await fetch(apiURL);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        displayImages(data, type);
    } catch (error) {
        console.error(`Error fetching ${type} images by breed:`, error);
    }
}

// Favorite an image
function favoriteImage(imageUrl) {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    if (!favorites.includes(imageUrl)) {
        favorites.push(imageUrl);
        localStorage.setItem('favorites', JSON.stringify(favorites));
    }
}

// Display favorite images
function displayFavorites() {
    const favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const container = document.getElementById('favorites-container');
    container.innerHTML = ''; // Clear previous favorites
    favorites.forEach(imageUrl => {
        const img = document.createElement('img');
        img.src = imageUrl;
        img.classList.add('pet-image');
        container.appendChild(img);
    });
}

// Fetch initial images when page loads
document.addEventListener('DOMContentLoaded', () => {
    fetchCats();
    fetchDogs();
    fetchCatBreeds();
    fetchDogBreeds();
    displayFavorites();

    // Add event listeners for breed selection
    document.getElementById('cat-breed-select').addEventListener('change', (event) => {
        const breedId = event.target.value;
        fetchImagesByBreed('cat', breedId);
    });

    document.getElementById('dog-breed-select').addEventListener('change', (event) => {
        const breedId = event.target.value;
        fetchImagesByBreed('dog', breedId);
    });
});

window.fetchImagesByBreed = fetchImagesByBreed;


