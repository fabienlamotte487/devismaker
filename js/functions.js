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