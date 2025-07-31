/*Scroll Left and Right Button Functionality */
function scrollCarousel(button, distance) {
    const carousel = button.parentElement.querySelector('.carousel-wrapper');
    carousel.scrollBy({ left: distance, behavior: 'smooth' });
}

/* To generate alert of Add to Cart Button*/
var addToCartButtons = document.querySelectorAll(".addToCart");
addToCartButtons.forEach(function(button) {
    button.addEventListener("click",function(){
        alert("Added to Cart");
    })
});