class Navigator{
    constructor(){
        this.page = 3;
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
        this.pagesElements.forEach((section, index) => {
            if(index === this.getPageIndex()){
                section.classList.add("current-page");
                section.setAttribute("aria-hidden", "false");
            } else {
                section.classList.remove("current-page");
                section.setAttribute("aria-hidden", "true");
            }
            let targetStep = section.querySelector(".target-step");

            if(targetStep){
                targetStep.innerHTML = this.getStepForm(index+1);
            }
        });
    }

    getPageIndex(){
        return this.page-1;
    }

    getStepForm(index){
        return `Etape <span>${index}</span> sur ${this.max}`;
    }

    setNewFocus(){
        let input = this.pagesElements[this.getPageIndex()].querySelector("input");
        if(input){
            input.focus();
        }
    }
}