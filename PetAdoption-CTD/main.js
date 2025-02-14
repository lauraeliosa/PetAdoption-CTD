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

function loadRandomPets(type) {
    const url = `/.netlify/functions/fetchPets?type=${type}`;  // ✅ Calls the Netlify Function

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById(`${type}-container`);
            container.innerHTML = ''; 

            data.forEach(pet => {
                const img = document.createElement('img');
                img.src = pet.url;
                img.alt = `A cute ${type}`;
                img.className = 'pet-image'; 
                container.appendChild(img);
            });
        })
        .catch(error => console.error(`Error loading ${type} images:`, error));
}

function loadBreeds(type, selectId) {
    const url = `/.netlify/functions/fetchBreeds?type=${type}`; // ✅ Calls the Netlify Function
    const select = document.getElementById(selectId);

    fetch(url)
        .then(response => response.json())
        .then(data => {
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
    const url = `/.netlify/functions/fetchImagesByBreed?type=${type}&breedId=${breedId}`; // ✅ Calls Netlify Function
    const container = document.getElementById(containerId);

    fetch(url)
        .then(response => response.json())
        .then(data => {
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
        loadRandomPets("cat");
        loadBreeds("cat", "cat-breed-select");
        document.getElementById('cat-breed-select').addEventListener('change', (event) => {
            const breedId = event.target.value;
            if (breedId) {
                fetchImagesByBreed("cat", breedId, "cat-container");
            } else {
                loadRandomPets("cat");
            }
        });
    }

    if (dogContainer) {
        loadRandomPets("dog");
        loadBreeds("dog", "dog-breed-select");
        document.getElementById('dog-breed-select').addEventListener('change', (event) => {
            const breedId = event.target.value;
            if (breedId) {
                fetchImagesByBreed("dog", breedId, "dog-container");
            } else {
                loadRandomPets("dog");
            }
        });
    }
}

// ==================== VOTING.HTML ====================

let currentCatImageId = null; 

function fetchRandomCat() {
    const container = document.getElementById('cat-image-container');
    fetch('/.netlify/functions/fetchRandomCat')  // ✅ Calls Netlify Function
        .then(response => response.json())
        .then(data => {
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
        .catch(error => console.error('Error fetching cat image:', error));
}

function vote(value) {
    if (!currentCatImageId) {
        alert('No cat image to vote on!');
        return;
    }

    fetch('/.netlify/functions/voteCat', { // ✅ Calls Netlify Function
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
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
});









