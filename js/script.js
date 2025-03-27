document.addEventListener('DOMContentLoaded', function() {
    new Table();
    const navigator = new Navigator();
    const formulaire = new Formulaire();

    navigator.prevButton.addEventListener("click", () => {
        navigator.previous();
    });

    navigator.nextButton.addEventListener("click", () => {
        let isScreenValid = formulaire.validLevel[navigator.getPageIndex()]();
        
        if(isScreenValid){
            navigator.next();
        }
    });

    fileInput();
});