class Navigator{
    constructor(){
        this.page = 1;
        this.min = 1;
        this.max = document.querySelectorAll("section").length;
        this.pagesElements = document.querySelectorAll("section"); // Liste des screens
        this.init(); // Lancement des évènnements à articuler
    }

    init(){
        this.updateButtons(); // Mise à jour de l'attribut disabled des boutons selon la page.
        this.updatePageVisibility();
    }

    // On passe à la page suivante
    next(){
        if(this.page < this.max){
            this.page++;
            this.updateButtons();
            this.updatePageVisibility();
        }
    }

    // On revient à la page précédente
    previous(){
        if(this.page > this.min){
            this.page--;
            this.updateButtons();
            this.updatePageVisibility();
        }
    }
    
    // Rends cliquable ou non le bouton previous ou next
    updateButtons(){
        if(this.page > this.min){
            this.prevButton.removeAttribute("disabled");
        } else {
            this.prevButton.setAttribute("disabled", true);
        }

        if(this.page < this.max){
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

        this.pagesElements[this.getPage()].classList.add("current-page");
    }

    getPage(){
        return this.page-1;
    }
}