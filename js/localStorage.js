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

// Fonction pour supprimer un objet à un tableau dans localStorage
function removeProductToBasket(key, newObject) {
    // Récupérer le tableau existant depuis localStorage
    let existingArray = JSON.parse(localStorage.getItem(key)) || [];

    // Ajouter le nouvel objet au tableau
    let newArray = existingArray.filter((obj) => obj.id !== newObject.id);

    // Sauvegarder le tableau mis à jour dans localStorage
    localStorage.setItem(key, JSON.stringify(newArray));

    // Déclencher un événement personnalisé
    const event = new CustomEvent('removeProductToBasket', {
        detail: { key, newObject }
    });
    
    window.dispatchEvent(event);
}

function getItemFromBasket(key, newObject) {
    // Récupérer le tableau existant depuis localStorage
    let existingArray = JSON.parse(localStorage.getItem(key)) || [];

    // Ajouter le nouvel objet au tableau
    let newArray = existingArray.filter((obj) => obj.id === newObject.id);
    return newArray[0];
}

function updateItemFromBasket(key, newObject) {
    // Récupérer le tableau existant depuis localStorage
    let existingArray = JSON.parse(localStorage.getItem(key)) || [];

    // Ajouter le nouvel objet au tableau
    let newArray = existingArray.map((obj) => {
        if(obj.id === newObject.id) {
            return newObject;
        } else {
            return obj;
        }
    });

    // Sauvegarder le tableau mis à jour dans localStorage
    localStorage.setItem(key, JSON.stringify(newArray));
}