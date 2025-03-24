document.addEventListener('DOMContentLoaded', function() {
    const navigator = new Navigator();
    
    navigator.prevButton.addEventListener("click", () => {
        navigator.previous();
    });

    navigator.nextButton.addEventListener("click", () => {
        navigator.next();
    });
});