class Table{
    constructor(){
        this.tableBody = document.getElementById("basket_datas");
        this.totalHT = document.getElementById("total_ht");
        this.totalTTC = document.getElementById("total_ttc");
        this.totalTVA = document.getElementById("total_tva");
        this.clearButton = document.getElementById("delete_basket");
        this.modalProduct = document.getElementById("modif_modal");
        this.modalProductValidate = document.getElementById("modif_product_validate");

        this.init();
    }

    // Initialise les évènements
    init = () => {
        window.addEventListener('newProductToBasket', (e) => {
            const { key, newObject } = e.detail;
            this.addLine(newObject);
            this.updateTotal();
        });

        this.clearButton.addEventListener("click", () => {
            this.clearBasketCache();
            this.removeBasket();
        });

        this.modalProductValidate.addEventListener("click", () => {
            this.validateModal();
            this.fill();
            this.closeModal();
        });

        // Préparation des évènnements pour les boutons générés dynamiquement
        window.addEventListener("click", (e) => {
            // Click sur le bouton de suppression d'une ligne
            if(e.target.closest("button") && e.target.closest("button").classList.contains("delete-button")) {
                let idToRemove = e.target.closest("button").getAttribute("data_id");
                removeProductToBasket("basket", { id: idToRemove });
                this.removeLine(e.target);
            }

            // Click sur le bouton de modification d'une ligne
            if(e.target.closest("button") && e.target.closest("button").classList.contains("edit-button")) {
                let idToModif = e.target.closest("button").getAttribute("data_id");
                let product = getItemFromBasket("basket", { id: idToModif });
                this.showModal(product);
            }

            // Click sur le bouton de fermeture de la modale
            if(e.target.closest("button") 
            && (e.target.closest("button").classList.contains("close-modal") 
            || e.target.closest("button").id == "modif_product_cancel") 
            || e.target.classList.contains("background")){
                this.closeModal();
            }

            if(e.target.classList.contains("quantity-button")){
                let idToModif = e.target.getAttribute("data_id");
                let product = getItemFromBasket("basket", { id: idToModif });
                let newQuantity = e.target.classList.contains("plus") ? parseInt(product.quantity) + 1 : parseInt(product.quantity) - 1;
                product.quantity = newQuantity;
                updateItemQuantityFromBasket("basket", product);
                this.fill();
            }
        });

        this.fill();
    }

    // Remplit le tableau avec les données du panier
    fill(){
        this.removeBasket();
        let datas = JSON.parse(sessionStorage.getItem("basket")) || [];
        datas.forEach(data => {
            this.addLine(data);
        });
    }

    // Ajoute une ligne au tableau
    // @param {Object} data - L'objet contenant les données du produit
    addLine(data){
        let tr = document.createElement("tr");
        tr.id = `basket_${data.id}`;
        tr.innerHTML = `
            <td>${data.name}</td>
            <td class="quanity-container">
                <span class="quantity">${data.quantity}</span>
                <div class="quantity-buttons-container">
                    <button type="button" class="quantity-button minus" data_id="${data.id}">-</button>
                    <button type="button" class="quantity-button plus" data_id="${data.id}">+</button>
                </div>
            </td>
            <td>${this.formate_money(data.puht)}</td>
            <td>${data.tva} %</td>
            <td>${this.formate_money(this.calcul_ttc(data))}</td>
            <td>
                <button type="button" class="edit-button" data_id="${data.id}">
                    <img src="./svg/edit.svg" class="edit-icon" alt="Modifier le produit" title="Modifier le produit" />
                </button>
                <button type="button" class="delete-button" data_id="${data.id}">
                    <img src="./svg/trash.svg" class="trash-icon" alt="Supprimer le produit" title="Supprimer le produit" />
                </button>
            </td>
        `;
        this.tableBody.appendChild(tr);
        this.revealClearButton();
    }

    // Supprime une ligne du tableau
    // @param {HTMLElement} target - L'élément qui a déclenché l'évènement (le bouton de suppression)
    removeLine(target){
        target.closest("tr").remove();
        this.updateTotal();
        let datas = JSON.parse(sessionStorage.getItem("basket")) || [];
        if(datas.length === 0){
            this.hideClearButton();
        }
    }

    // Affiche le bouton de suppression du panier si le tableau n'est pas vide
    revealClearButton(){
        if(!this.clearButton.classList.contains("show")){
            this.clearButton.classList.add("show");
        }
    }

    // Cache le bouton de suppression du panier si le tableau est vide
    hideClearButton(){
        if(this.clearButton.classList.contains("show")){
            this.clearButton.classList.remove("show");
        }
    }

    // Supprime le panier et vide le tableau
    removeBasket(){
        this.tableBody.innerHTML = ""; // On vide le tableau
        this.updateTotal();
        this.hideClearButton();
    }

    clearBasketCache(){
        sessionStorage.removeItem("basket");
    }

    // Met à jour les totaux HT, TTC et TVA
    updateTotal(){
        let datas = JSON.parse(sessionStorage.getItem("basket")) || [];

        let totalHT = 0;
        let totalTTC = 0;
        let totalTVA = 0;

        datas.forEach(data => {
            totalHT += data.puht * data.quantity;
            totalTTC += this.calcul_ttc(data);
            totalTVA += (data.tva / 100) * data.puht * data.quantity;
        });

        this.totalHT.innerHTML = this.formate_money(totalHT);
        this.totalTTC.innerHTML = this.formate_money(totalTTC);
        this.totalTVA.innerHTML = this.formate_money(totalTVA);
    }

    // Calcul le prix TTC d'un produit
    // @param {Object} data - L'objet contenant les données du produit
    calcul_ttc(data){
        return data.puht * data.quantity * (1 + data.tva / 100);
    }

    // Formate un nombre en euros avec deux décimales
    // @param {number} value - Le nombre à formater
    formate_money(value) {
        let number = parseFloat(value.toString().replace(',', '.'));
        if (isNaN(number)) return "0,00 €";
        
        return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " €";
    }

    // Affiche la modale de modification d'un produit
    // @param {Object} data - L'objet contenant les données du produit
    showModal(data){
        this.modalProduct.classList.add("show");
        this.modalProduct.querySelector("#modif_product_name").value = data.name;
        this.modalProduct.querySelector("#modif_product_quantity").value = data.quantity;
        this.modalProduct.querySelector("#modif_product_puht").value = data.puht;
        this.modalProduct.querySelector("#modif_product_tva").value = data.tva;
        this.modalProduct.querySelector("#modif_product_validate").setAttribute("data_id_to_edit", data.id);

        let title = this.modalProduct.querySelector(".modal-content h2");
        title.innerHTML = `Modifier le produit "${data.name}"`;
    }

    // Ferme la modale de modification d'un produit
    closeModal(){
        this.modalProduct.classList.remove("show");
        this.modalProduct.querySelector("#modif_product_name").value = "";
        this.modalProduct.querySelector("#modif_product_quantity").value = 1;
        this.modalProduct.querySelector("#modif_product_puht").value = 0;
        this.modalProduct.querySelector("#modif_product_tva").value = 20;
    }

    validateModal(){
        let idToEdit = this.modalProduct.querySelector("#modif_product_validate").getAttribute("data_id_to_edit");
        let item = {
            id: idToEdit,
            name: this.modalProduct.querySelector("#modif_product_name").value,
            quantity: this.modalProduct.querySelector("#modif_product_quantity").value,
            puht: this.modalProduct.querySelector("#modif_product_puht").value,
            tva: this.modalProduct.querySelector("#modif_product_tva").value
        };
        updateItemFromBasket("basket", item);
    }
}