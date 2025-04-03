// Formate un nombre en euros avec deux décimales
// @param {number} value - Le nombre à formater
function formate_money(value) {
    let number = parseFloat(value.toString().replace(',', '.'));
    if (isNaN(number)) return "0,00 €";
    
    return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " €";
}


// Calcul le prix TTC d'un produit
// @param {Object} data - L'objet contenant les données du produit
function calcul_ttc(data){
    return data.puht * data.quantity * (1 + data.tva / 100);
}

