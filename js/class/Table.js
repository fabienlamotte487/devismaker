class Table{
    constructor(){
        this.tableBody = document.getElementById("basket_datas");
        this.totalHT = document.getElementById("total_ht");
        this.totalTTC = document.getElementById("total_ttc");
        this.totalTVA = document.getElementById("total_tva");
        this.clearButton = document.getElementById("delete_basket");

        this.init();
    }

    // Initialise les évènements
    init = () => {
        window.addEventListener('newProductToBasket', (e) => {
            const { key, newObject } = e.detail;
            this.addLine(newObject);
        });

        this.clearButton.addEventListener("click", () => {
            this.removeBasket();
        });

        window.addEventListener("click", (e) => {
            if(e.target.closest("button") && e.target.closest("button").classList.contains("delete-button")) {
                let idToRemove = e.target.closest("button").getAttribute("data_id");
                removeProductToBasket("basket", { id: idToRemove });
                this.removeLine(e.target);
            }
        });

        this.fill();
    }

    // Remplit le tableau avec les données du panier
    fill(){
        let datas = JSON.parse(localStorage.getItem("basket")) || [];
        datas.forEach(data => {
            this.addLine(data);
        });
        this.updateTotal();
    }

    // Ajoute une ligne au tableau
    // @param {Object} data - L'objet contenant les données du produit
    addLine(data){
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${data.name}</td>
            <td>${data.quantity}</td>
            <td>${this.formate_money(data.puht)}</td>
            <td>${data.tva} %</td>
            <td>${this.formate_money(this.calcul_ttc(data))}</td>
            <td>
                <button type="button" class="delete-button" data_id="${data.id}">
                    <img src="./svg/trash.svg" class="trash-icon" alt="Supprimer le produit" title="Supprimer le produit" />
                </button>
            </td>
        `;
        this.tableBody.appendChild(tr);
        this.updateTotal();
        this.revealClearButton();
    }

    // Supprime une ligne du tableau
    // @param {HTMLElement} target - L'élément qui a déclenché l'évènement (le bouton de suppression)
    removeLine(target){
        target.closest("tr").remove();
        this.updateTotal();
        let datas = JSON.parse(localStorage.getItem("basket")) || [];
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
        localStorage.removeItem("basket");
        this.tableBody.innerHTML = ""; // On vide le tableau
        this.updateTotal();
        this.hideClearButton();
    }

    // Met à jour les totaux HT, TTC et TVA
    updateTotal(){
        let datas = JSON.parse(localStorage.getItem("basket")) || [];

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
}