const primaryHeader = document.querySelector('.primary-header');
const navToggle = document.querySelector('.mobile-nav-toggle');
const primaryNav = document.querySelector('.primary-navigation');


navToggle.addEventListener('click', () => {
    // used for accessibility 
    primaryNav.hasAttribute('data-visible')
    ? navToggle.setAttribute('aria-expanded' , false)
    : navToggle.setAttribute('aria-expanded' , true);
// this toggles the 'data-visible' attribute on the primaryNav. When its present it will be removed and when its not there it will be added. 
    primaryNav.toggleAttribute('data-visible');
//this has something to do with the shadowing of the nav when its opened in the mobile 
    primaryHeader.toggleAttribute('data-overlay');
});
