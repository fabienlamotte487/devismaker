class Table{
    constructor(){
        this.tableBody = document.getElementById("basket_datas");
        this.totalHT = document.getElementById("total_ht");
        this.totalTTC = document.getElementById("total_ttc");
        this.totalTVA = document.getElementById("total_tva");
        this.remove_basket_button = document.getElementById("delete_basket");

        this.init();
    }

    init = () => {
        // Cet évènnement custom s'apprête à ajouter lui même la ligne dès qu'un produit est ajouté correctement
        window.addEventListener('newProductToBasket', (e) => {
            const { key, newObject } = e.detail;
            this.addLineToTable(newObject);
        });

        this.remove_basket_button.addEventListener("click", () => {
            this.deleteBasket();
        });

        window.addEventListener("click", (e) => {
            if(e.target.closest("button") && e.target.closest("button").classList.contains("delete-button")) {
                let idToRemove = e.target.closest("button").getAttribute("data_id");
                removeProductToBasket("basket", { id: idToRemove });
                this.deleteLineToBasket(e.target);
            }
        });

        this.fetchData();
    }

    fetchData(){
        let datas = JSON.parse(localStorage.getItem("basket")) || [];
        datas.forEach(data => {
            this.addLineToTable(data);
        });
        this.updateTotal();
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
        this.updateTotal();
    }

    deleteBasket(){
        localStorage.removeItem("basket");
        this.tableBody.innerHTML = ""; // On vide le tableau
        this.updateTotal();
    }

    deleteLineToBasket(target){
        target.closest("tr").remove();
        this.updateTotal();
    }

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

    calcul_ttc(data){
        return data.puht * data.quantity * (1 + data.tva / 100);
    }

    formate_money(value) {
        let number = parseFloat(value.toString().replace(',', '.'));
        if (isNaN(number)) return "0,00 €";
        
        return number.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + " €";
    }
}