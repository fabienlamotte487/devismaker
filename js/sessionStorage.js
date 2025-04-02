// Fonction pour ajouter un objet à un tableau dans sessionStorage
function newProductToBasket(key, newObject) {
    // Récupérer le tableau existant depuis sessionStorage
    let basket = JSON.parse(sessionStorage.getItem(key)) || [];

    // Ajouter le nouvel objet au tableau
    basket.push(newObject);

    // Sauvegarder le tableau mis à jour dans sessionStorage
    sessionStorage.setItem(key, JSON.stringify(basket));

    // Déclencher un événement personnalisé
    const event = new CustomEvent('newProductToBasket', {
        detail: { key, newObject }
    });
    
    window.dispatchEvent(event);
}

// Fonction pour supprimer un objet à un tableau dans sessionStorage
function removeProductToBasket(key, newObject) {
    // Récupérer le tableau existant depuis sessionStorage
    let basket = JSON.parse(sessionStorage.getItem(key)) || [];

    // Ajouter le nouvel objet au tableau
    let newArray = basket.filter((obj) => obj.id !== newObject.id);

    // Sauvegarder le tableau mis à jour dans sessionStorage
    sessionStorage.setItem(key, JSON.stringify(newArray));

    // Déclencher un événement personnalisé
    const event = new CustomEvent('removeProductToBasket', {
        detail: { key, newObject }
    });
    
    window.dispatchEvent(event);
}

function getItemFromBasket(key, newObject) {
    // Récupérer le tableau existant depuis sessionStorage
    let basket = JSON.parse(sessionStorage.getItem(key)) || [];

    // Ajouter le nouvel objet au tableau
    let newArray = basket.filter((obj) => obj.id === newObject.id);
    return newArray[0];
}

function updateItemFromBasket(key, newObject) {
    // Récupérer le tableau existant depuis sessionStorage
    let basket = JSON.parse(sessionStorage.getItem(key)) || [];

    // Ajouter le nouvel objet au tableau
    let newArray = basket.map((obj) => {
        if(obj.id === newObject.id) {
            return newObject;
        } else {
            return obj;
        }
    });

    // Sauvegarder le tableau mis à jour dans sessionStorage
    sessionStorage.setItem(key, JSON.stringify(newArray));
}

function updateItemQuantityFromBasket(key, newObject) {
    // Récupérer le tableau existant depuis sessionStorage
    let basket = JSON.parse(sessionStorage.getItem(key)) || [];

    if(newObject.quantity <= 0) {
        removeProductToBasket(key, newObject);
        return;
    }

    // Ajouter le nouvel objet au tableau
    let newArray = basket.map((obj) => {
        if(obj.id === newObject.id) {
            return newObject;
        } else {
            return obj;
        }
    });

    // Sauvegarder le tableau mis à jour dans sessionStorage
    sessionStorage.setItem(key, JSON.stringify(newArray));
}

function isBaskedFilled(){
    let basket = JSON.parse(sessionStorage.getItem("basket")) || [];

    if(basket.length === 0) {
        alert('Le panier de votre devis ne peut pas être vide !');
        return false;
    }

    return true;
}