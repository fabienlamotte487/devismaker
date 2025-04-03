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
    let lineBreakSize = 10; // Taille du saut de ligne
    let pageWidth = doc.internal.pageSize.getWidth();
    doc.setFontSize(11); // Taille de la police globale

    function addBlock(array, xaxe) {
        array.forEach((elem) => {
            doc.setFont("helvetica", elem.fontWeight || "normal");
            y = addTextWithAutoHeight(doc, elem.line, xaxe, y, { align: elem.align || "left" });
        });
    }

    function jumpBreak(){
        y += lineBreakSize;
    }

    function addTextWithAutoHeight(doc, text, x, y, options = null) {
        const textLines = doc.splitTextToSize(text, 180); // Divise le texte en plusieurs lignes
        const lineHeight = doc.getTextDimensions("A").h + 2; // Hauteur d'une ligne avec un petit padding
        
        textLines.forEach((line) => {
            const pageHeight = doc.internal.pageSize.height;
            if (y + lineHeight > pageHeight - 10) {
                doc.addPage();
                y = 10; // Réinitialisation en haut de la nouvelle page
            }

            doc.text(line, x, y, options); // Ajoute la ligne de texte
            y += lineHeight; // Met à jour la position Y
        });
    
        return y; // Retourne la nouvelle position Y mise à jour
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

    function addFooter() {
        const pageCount = doc.internal.getNumberOfPages(); // Nombre total de pages
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i); // Sélectionner la page à modifier
            doc.setFontSize(10);
            doc.setTextColor(150); // Couleur grise pour le footer
            
            // Numéro de page à droite
            doc.text(`Page ${i} / ${pageCount}`, pageWidth - 30, pageHeight - 10, { align: "right" });
        }
    }

    addBlock(meParams, 10, y); // Informations de mon entreprise
    y = 10;
    addBlock(customerParams, pageWidth - 10, y); // Information entreprise cliente
    jumpBreak();

    y = addTextWithAutoHeight(doc, `Devis n°${new Date().valueOf()}`, 10, y);
    y = addTextWithAutoHeight(doc, `Réalisé le ${new Date().toLocaleDateString('fr-FR')}`, 10, y);
    y = addTextWithAutoHeight(doc, `Ce devis est valable ${maxDays} jours`, 10, y);
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
    y = doc.lastAutoTable.finalY + 10;
    jumpBreak();

    // Mentions légales
    doc.setTextColor(0, 0, 0, 0.7);
    doc.setFont("helvetica", "bold");
    y = addTextWithAutoHeight(doc, "Mentions Légales :", 10, y);
    doc.setFont("helvetica", "italic");
    y = addTextWithAutoHeight(doc, `Délai maximum de paiement: ${maxDays} jours`, 10, y);
    y = addTextWithAutoHeight(doc, legals, 10, y, { maxWidth: 180 });
    addFooter()
    // Télécharger le PDF
    doc.save("devis.pdf");
}