class Table{
    constructor(){
        this.tableBody = document.getElementById("basket_datas");
        this.totalHT = document.getElementById("total_ht");
        this.totalTTC = document.getElementById("total_ttc");
        this.totalTVA = document.getElementById("total_tva");

        this.init();
    }

    init = () => {
        // Cet évènnement custom s'apprête à ajouter lui même la ligne dès qu'un produit est ajouté correctement
        window.addEventListener('newProductToBasket', (e) => {
            const { key, newObject } = e.detail;
            this.addLineToTable(newObject);
        });

        this.fetchData();
    }

    fetchData(){
        let datas = JSON.parse(localStorage.getItem("basket")) || [];
        datas.forEach(data => {
            this.addLineToTable(data);
        });
    }

    addLineToTable(data){
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
    }

    calcul_ttc(data){
        return data.puht * data.quantity * (1 + data.tva / 100);
    }

    formate_money(value){
        let number = parseFloat(value.toString().replace(',', '.'));
        return number.toFixed(2) + " €";
    }

    // FONCTIONS 
        // Insert une ligne dans le tableau
        // Supprime une ligne dans le tableau
        // Recalcule les différents montants totaux
        // Fonctionnement des boutons + et - dans le tableau => Modifie la quantité et les montant avec la fonction au-dessus
        // Formate les montants en euros pour les données avec currency
        
}