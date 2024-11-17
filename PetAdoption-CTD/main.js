// Mobile navigation setup
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

// API keys from Vite 
const CAT_API_KEY = import.meta.env.VITE_CAT_API_KEY;
const DOG_API_KEY = import.meta.env.VITE_DOG_API_KEY;

// Fetch and display cat images
async function fetchCats(limit = 10) {
  const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=${limit}&api_key=${CAT_API_KEY}`);
  const data = await response.json();
  displayImages(data, 'cat');
}

// Fetch and display dog images
async function fetchDogs(limit = 10) {
  const response = await fetch(`https://api.thedogapi.com/v1/images/search?limit=${limit}&api_key=${DOG_API_KEY}`);
  const data = await response.json();
  displayImages(data, 'dog');
}

// Display images
function displayImages(images, type) {
  const container = document.getElementById(`${type}-container`);
  if (container) {
    container.innerHTML = '';  // Clear existing images
    images.forEach(image => {
      const img = document.createElement('img');
      img.src = image.url;
      img.alt = `${type} image`;
      img.classList.add('pet-image');
      img.dataset.imageId = image.id; // Storing image ID for voting
      container.appendChild(img);
    });
  }
}

// Fetch breeds and populate breed dropdowns
async function fetchCatBreeds() {
  const response = await fetch(`https://api.thecatapi.com/v1/breeds?api_key=${CAT_API_KEY}`);
  const breeds = await response.json();
  populateBreedSelect(breeds, 'cat');
}

async function fetchDogBreeds() {
  const response = await fetch(`https://api.thedogapi.com/v1/breeds?api_key=${DOG_API_KEY}`);
  const breeds = await response.json();
  populateBreedSelect(breeds, 'dog');
}

function populateBreedSelect(breeds, type) {
  const select = document.getElementById(`${type}-breed-select`);
  if (select) {
    select.innerHTML = '';
    breeds.forEach(breed => {
      const option = document.createElement('option');
      option.value = breed.id;
      option.textContent = breed.name;
      select.appendChild(option);
    });
  }
}

// Fetch images by breed
async function fetchImagesByBreed(type, breedId) {
  const apiURL = type === 'cat'
    ? `https://api.thecatapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${CAT_API_KEY}`
    : `https://api.thedogapi.com/v1/images/search?limit=10&breed_ids=${breedId}&api_key=${DOG_API_KEY}`;

  const response = await fetch(apiURL);
  const data = await response.json();
  displayImages(data, type);
}

// Fetch and display initial images and breeds on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchCats();
  fetchDogs();
  fetchCatBreeds();
  fetchDogBreeds();

  const catSelect = document.getElementById('cat-breed-select');
  if (catSelect) {
    catSelect.addEventListener('change', (event) => {
      const breedId = event.target.value;
      fetchImagesByBreed('cat', breedId);
    });
  }

  const dogSelect = document.getElementById('dog-breed-select');
  if (dogSelect) {
    dogSelect.addEventListener('change', (event) => {
      const breedId = event.target.value;
      fetchImagesByBreed('dog', breedId);
    });
  }

  fetchCatForVoting();
  fetchDogForVoting();
});

// ========   VOTING =========

async function fetchCatForVoting() {
  const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=1&api_key=${CAT_API_KEY}`);
  const data = await response.json();
  displayVotingImage(data[0], 'cat');
}

// async function fetchDogForVoting() {
//   const response = await fetch(`https://api.thedogapi.com/v1/images/search?limit=1&api_key=${DOG_API_KEY}`);
//   const data = await response.json();
//   displayVotingImage(data[0], 'dog');
// }

function displayVotingImage(image, type) {
  const container = document.getElementById(`${type}-image-container`);
  if (container) {
    container.innerHTML = ''; // Clear previous image
    const img = document.createElement('img');
    img.src = image.url;
    img.alt = `${type} image for voting`;
    img.classList.add('pet-image');
    img.classList.add('large-image');
    img.dataset.imageId = image.id; 
    container.appendChild(img);
  }
}

async function voteOnImage(type, value) {
  const imageContainer = document.getElementById(`${type}-image-container`).querySelector('img');
  const imageId = imageContainer ? imageContainer.dataset.imageId : null;

  if (!imageId) {
    console.error(`No image found to vote on for ${type}`);
    return;
  }

  // Create the vote data following the API structure
  const voteData = {
    image_id: imageId,
    value: value,
    sub_id: "user-123",  // Optional: Use this to track votes per user (customize as needed)
  };

  // Select the correct API key based on the image type
  const apiKey = type === 'cat' ? CAT_API_KEY : DOG_API_KEY;

  try {
    const response = await fetch(`https://api.the${type}api.com/v1/votes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
      },
      body: JSON.stringify(voteData),
    });

    if (response.ok) {
      alert(`${type.charAt(0).toUpperCase() + type.slice(1)} voted successfully!`);
      // Fetch a new image after voting
      type === 'cat' ? fetchCatForVoting() : fetchDogForVoting();
    } else {
      console.error(`Failed to vote: ${response.status}`);
      console.log("Response details:", await response.text());  // Log more response details for troubleshooting
    }
  } catch (error) {
    console.error('Error voting on image:', error);
  }
}

window.voteOnImage = voteOnImage;





