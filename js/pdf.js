async function printPdf() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Récupération des valeurs des champs
    const myCompany = sessionStorage.getItem("my_company_name");
    const myAddress = sessionStorage.getItem("my_adress");
    const myPostalCode = sessionStorage.getItem("my_postalcode");
    const myCity = sessionStorage.getItem("my_city");
    const myPhone = sessionStorage.getItem("my_phonenumber");

    const customerCompany = sessionStorage.getItem("customer_company_name");
    const customerAddress = sessionStorage.getItem("customer_adress");
    const customerPostalCode = sessionStorage.getItem("customer_postalcode");
    const customerCity = sessionStorage.getItem("customer_city");
    const customerPhone = sessionStorage.getItem("customer_phonenumber");

    const basket = JSON.parse(sessionStorage.getItem("basket"));
    let totalTTC = 0;
    let totalTVA = 0;
    let totalHT = 0;

    const maxDays = sessionStorage.getItem("maximum_days");
    const legals = sessionStorage.getItem("legals");

    const meParams = [
        {
            line: myCompany,
            fontWeight: "bold"
        },
        {
            line: `${myAddress}`,
            fontWeight: "normal"
        },
        {
            line: `${myPostalCode} ${myCity}`,
            fontWeight: "normal"
        },
        {
            line: myPhone.replace(/(.{2})/g, "$1 "),
            fontWeight: "normal"
        }
    ]
    const customerParams = [
        {
            line: customerCompany,
            fontWeight: "bold",
            align: "right"
        },
        {
            line: `${customerAddress}`,
            fontWeight: "normal",
            align: "right"
        },
        {
            line: `${customerPostalCode} ${customerCity}`,
            fontWeight: "normal",
            align: "right"
        },
        {
            line: customerPhone.replace(/(.{2})/g, "$1 "),
            fontWeight: "normal",
            align: "right"
        }
    ]

    let y = 10; // Position de départ dans le PDF
    let lineSize = 5; // Espacement entre les lignes
    let lineBreakSize = 10; // Taille du saut de ligne
    let pageWidth = doc.internal.pageSize.getWidth(); // Largeur de la page
    doc.setFontSize(11); // Taille de la police globale

    // Fonction d'ajout d'un block de contenu
    function addBlock(array, xaxe, yaxe, addSpace = true){
        array.forEach((elem, index) => {
            doc.setFont("helvetica", "normal");

            if(elem.fontWeight == "bold"){
                doc.setFont("helvetica", "bold");
            }

            if(elem.align){
                doc.text(elem.line, xaxe, yaxe + (lineSize*index), {align: elem.align})
            } else {
                doc.text(elem.line, xaxe, yaxe + (lineSize*index))
            }

            if(addSpace){
                lineBreak()
            }
        });
    }

    // Fonction d'ajout d'une ligne simple
    function addLine(text, xaxe, yaxe){
        doc.text(text, xaxe, yaxe)
        lineBreak()
    }

    function jumpBreak(){
        y += lineBreakSize;
    }

    function lineBreak(numberLines = 1){
        y += (lineSize*numberLines);
    }

    productFormated = () =>{
        let products = [];

        basket.forEach(product => {
            products.push([
                product.name,
                product.quantity,
                formate_money(product.puht),
                product.tva + " %",
                formate_money(calcul_ttc(product))
            ])
            totalHT += product.puht * product.quantity;
            totalTTC += calcul_ttc(product);
            totalTVA += (product.tva / 100) * product.puht * product.quantity;
        })

        return products;
    }

    addBlock(meParams, 10, 10); // Informations de mon entreprise
    addBlock(customerParams, pageWidth - 10, 10, false); // Information entreprise cliente
    jumpBreak();

    addLine(`Devis n°${new Date().valueOf()}`, 10, y);
    addLine(`Réalisé le ${new Date().toLocaleDateString('fr-FR')}`, 10, y);
    addLine(`Ce devis est valable ${maxDays} jours`, 10, y);
    jumpBreak();

    // Tableau des produits
    doc.autoTable({
        startY: y,
        head: [
            [
                "Produit", 
                { content: "Quantité", styles: { halign: "right" } }, 
                { content: "Prix Unitaire HT", styles: { halign: "right" } }, 
                { content: "TVA", styles: { halign: "right" } }, 
                { content: "TTC", styles: { halign: "right" } }
            ]
        ],
        body: productFormated(),
        foot: [
            ["", "", "", "Total HT", formate_money(totalHT)],  // Ligne Total HT
            ["", "", "", "Total TVA", formate_money(totalTVA)],  // Ligne Total TVA
            ["", "", "", "Total TTC", formate_money(totalTTC)]  // Ligne Total TTC
        ],
        headStyles: {
            fillColor: "#F17960",
            textColor: [0, 0, 0],
            fontStyle: "bold",
        },
        footStyles: {
            fillColor: "white", // Fond gris pour le footer
            textColor: [0, 0, 0], // Texte noir
            fontStyle: "bold",
            halign: "right" // Alignement à droite pour toutes les colonnes du footer
        },
        columnStyles: {
            0: { halign: "left" },  // La colonne "Produit" reste alignée à gauche
            1: { halign: "right" }, // Quantité alignée à droite
            2: { halign: "right" }, // Prix Unitaire HT aligné à droite
            3: { halign: "right" }, // TVA alignée à droite
            4: { halign: "right" }  // TTC aligné à droite
        }
    });
    lineBreak(1 + (basket.length * 2) + (3*2));
    jumpBreak();

    // Mentions légales
    doc.setTextColor(0, 0, 0, 0.7);
    doc.setFont("helvetica", "bold");
    doc.text("Mentions Légales :", 10, y);
    doc.setFont("helvetica", "italic");
    doc.text(`Délai maximum de paiement: ${maxDays} jours`, 10, y + 10);
    doc.text(`${legals}`, 10, y + 20, { maxWidth: 180 }); // Limite la largeur du texte

    // Télécharger le PDF
    doc.save("devis.pdf");
}