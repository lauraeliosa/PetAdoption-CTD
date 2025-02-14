const API_KEY = import.meta.env.VITE_CAT_API_KEY; 
const DOG_API_KEY = import.meta.env.VITE_DOG_API_KEY;

//nav hamburger menu
const primaryHeader = document.querySelector('.primary-header');
const navToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.getElementById('primary-navigation');


if (navToggle) {
  navToggle.addEventListener('click', () => {
    primaryNav.hasAttribute('data-visible')
      ? navToggle.setAttribute('aria-expanded', false)
      : navToggle.setAttribute('aria-expanded', true);

    primaryNav.toggleAttribute('data-visible');
    primaryHeader.toggleAttribute('data-overlay');
  });
}


// ==================== PETS.HTML ====================


function loadRandomCats() {
    const container = document.getElementById('cat-container'); 
    const url = `https://api.thecatapi.com/v1/images/search?limit=5`;

    fetch(url, {
        headers: { 'x-api-key': API_KEY },
    })
        .then((response) => response.json())
        .then((data) => {
            container.innerHTML = ''; 
            data.forEach((cat) => {
                const img = document.createElement('img');
                img.src = cat.url;
                img.alt = 'A cute cat';
                img.className = 'pet-image'; 
                container.appendChild(img);
            });
        })
        .catch((error) => console.error('Error loading random cat images:', error));
}


function loadRandomDogs() {
    const container = document.getElementById('dog-container'); 
    const url = `https://api.thedogapi.com/v1/images/search?limit=5`;

    fetch(url, {
        headers: { 'x-api-key': API_KEY },
    })
        .then((response) => response.json())
        .then((data) => {
            container.innerHTML = ''; 
            data.forEach((dog) => {
                const img = document.createElement('img');
                img.src = dog.url;
                img.alt = 'A cute dog';
                img.className = 'pet-image'; 
                container.appendChild(img);
            });
        })
        .catch((error) => console.error('Error loading random dog images:', error));
}


function loadBreeds(type, selectId) {
    const url = type === 'cat' ? `https://api.thecatapi.com/v1/breeds` : `https://api.thedogapi.com/v1/breeds`;
    const select = document.getElementById(selectId);

    fetch(url, {
        headers: { 'x-api-key': API_KEY },
    })
        .then((response) => response.json())
        .then((data) => {
            select.innerHTML = '<option value="">Select a Breed</option>'; // Default option
            data.forEach((breed) => {
                const option = document.createElement('option');
                option.value = breed.id;
                option.textContent = breed.name;
                select.appendChild(option);
            });
        })
        .catch((error) => console.error(`Error loading ${type} breeds:`, error));
}


function fetchImagesByBreed(type, breedId, containerId) {
    const url = `https://api.${type === 'cat' ? 'thecatapi' : 'thedogapi'}.com/v1/images/search?limit=10&breed_ids=${breedId}`;
    const container = document.getElementById(containerId);

    fetch(url, {
        headers: { 'x-api-key': API_KEY },
    })
        .then((response) => response.json())
        .then((data) => {
            container.innerHTML = ''; 
            if (data.length === 0) {
                container.textContent = `No ${type} images found for this breed.`;
            } else {
                data.forEach((item) => {
                    const img = document.createElement('img');
                    img.src = item.url;
                    img.alt = `${type} image`;
                    img.className = 'pet-image';
                    container.appendChild(img);
                });
            }
        })
        .catch((error) => console.error(`Error fetching ${type} images by breed:`, error));
}


function initPetsPage() {
    const catContainer = document.getElementById('cat-container');
    const dogContainer = document.getElementById('dog-container');

    if (catContainer) {
        loadRandomCats();
        loadBreeds('cat', 'cat-breed-select');
        document.getElementById('cat-breed-select').addEventListener('change', (event) => {
            const breedId = event.target.value;
            if (breedId) {
                fetchImagesByBreed('cat', breedId, 'cat-container');
            } else {
                loadRandomCats();
            }
        });
    }

    if (dogContainer) {
        loadRandomDogs();
        loadBreeds('dog', 'dog-breed-select');
        document.getElementById('dog-breed-select').addEventListener('change', (event) => {
            const breedId = event.target.value;
            if (breedId) {
                fetchImagesByBreed('dog', breedId, 'dog-container');
            } else {
                loadRandomDogs();
            }
        });
    }
}

// ==================== VOTING.HTML ====================

let currentCatImageId = null; 


function fetchRandomCat() {
    const container = document.getElementById('cat-image-container');
    fetch('https://api.thecatapi.com/v1/images/search', {
        headers: { 'x-api-key': API_KEY },
    })
        .then((response) => response.json())
        .then((data) => {
            container.innerHTML = ''; 
            if (data.length > 0) {
                const img = document.createElement('img');
                img.src = data[0].url;
                img.alt = 'A cute cat';
                img.className = 'cat-image';
                container.appendChild(img);
                currentCatImageId = data[0].id; 
            } else {
                container.textContent = 'No cat images found.';
            }
        })
        .catch((error) => console.error('Error fetching cat image:', error));
}


function vote(value) {
    if (!currentCatImageId) {
        alert('No cat image to vote on!');
        return;
    }

    fetch('https://api.thecatapi.com/v1/votes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        body: JSON.stringify({ image_id: currentCatImageId, value }),
    })
        .then((response) => response.json())
        .then(() => {
            alert('Vote submitted!');
            fetchRandomCat(); 
        })
        .catch((error) => console.error('Error submitting vote:', error));
}


function initVotingPage() {
    const container = document.getElementById('cat-image-container');
    if (container) {
        fetchRandomCat();
        document.getElementById('upvote-button').addEventListener('click', () => vote(1));
        document.getElementById('downvote-button').addEventListener('click', () => vote(-1));
    }
}


// Initialize functionality 
document.addEventListener('DOMContentLoaded', () => {
    initPetsPage(); 
    initVotingPage(); 
})




console.log("Environment Variables:", import.meta.env);
console.log("VITE_CAT_API_KEY:", import.meta.env.VITE_CAT_API_KEY);


