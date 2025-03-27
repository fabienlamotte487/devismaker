// Prévisualisation du logo lors de l'ajout d'un fichier dans le formulaire
function prevImage(e){
    const input = e.target;
    const image = input.parentElement.querySelector("img");

    if(input.files && input.files[0]){
        const reader = new FileReader();

        reader.onload = function(e){
            image.src = e.target.result;
            if(image.src != ""){
                image.classList.add("show");
            }
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function fileInput(){
    let fileInputs = document.querySelectorAll("input[type='file'].logo-file-input");

    fileInputs.forEach(input => {
        input.addEventListener("change", prevImage);
    });
}

// Fonction pour ajouter un objet à un tableau dans localStorage
function newProductToBasket(key, newObject) {
    // Récupérer le tableau existant depuis localStorage
    let existingArray = JSON.parse(localStorage.getItem(key)) || [];

    // Ajouter le nouvel objet au tableau
    existingArray.push(newObject);

    // Sauvegarder le tableau mis à jour dans localStorage
    localStorage.setItem(key, JSON.stringify(existingArray));

    // Déclencher un événement personnalisé
    const event = new CustomEvent('newProductToBasket', {
        detail: { key, newObject }
    });
    
    window.dispatchEvent(event);
}