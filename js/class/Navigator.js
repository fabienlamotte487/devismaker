class Navigator{
    constructor(){
        this.page = 1;
        this.min = 1;
        this.max = document.querySelectorAll("section").length;
        this.prevButton = document.getElementById("previous-button"); // Boutton de retour en arrière
        this.nextButton = document.getElementById("next-button"); // Bouton de page suivante
        this.pagesElements = document.querySelectorAll("section"); // Liste des screens
        this.init(); // Lancement des évènnements à articuler
    }

    init(){
        // On s'assure que les boutons sont bien présents par précaution
        if (!this.prevButton || !this.nextButton) {
            console.error("Les boutons n'ont pas été trouvés dans le DOM !");
            return;
        }

        // this.addButtonsclickCapabilities();
        this.updateButtons(); // Mise à jour de l'attribut disabled des boutons selon la page.
        this.updatePageVisibility();
    }

    // On passe à la page suivante
    next(){
        if(this.page < this.max){
            this.page++;
            this.updateButtons();
            this.updatePageVisibility();
            this.setNewFocus();
        }
    }

    // On revient à la page précédente
    previous(){
        if(this.page > this.min){
            this.page--;
            this.updateButtons();
            this.updatePageVisibility();
            this.setNewFocus();
        }
    }
    
    // Rends cliquable ou non le bouton previous ou next
    updateButtons(){
        if(this.page > this.min){
            this.prevButton.removeAttribute("disabled");
        } else {
            this.prevButton.setAttribute("disabled", true);
        }

        if(this.page <= this.max){
            this.nextButton.removeAttribute("disabled");
        } else {
            this.nextButton.setAttribute("disabled", true);
        }
    }

    // Affiche la bonne section selon la page modifiée
    updatePageVisibility(){
        let currentPage = document.querySelector("section.current-page");

        if(currentPage){
            currentPage.classList.remove("current-page");
        }

        this.pagesElements[this.getPageIndex()].classList.add("current-page");
    }

    getPageIndex(){
        return this.page-1;
    }

    setNewFocus(){
        this.pagesElements[this.getPageIndex()].querySelector("input").focus();
    }
}