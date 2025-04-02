class Formulaire {
    constructor() {
        this.validLevel = [
            this.myDatasValidator, 
            this.customerDatasValidator, 
            this.productDatasValidator, 
            this.legalDatasValidator
        ];
        this.basket_fill_button = document.getElementById("basket_fill");
        this.regexPhone = /^(0[1-9])(\d{8})$/;
        this.regexPostalCode = /^[0-9]{5}$/;
        this.regexPhoneError = "Le numéro de téléphone saisi n'est pas valide.";
        this.regexPostalCodeError = "Le code postal ne doit contenir qu'une série de 5 chiffres.";
        this.invalidEmptyMessage = "Ce champ ne peut pas être vide";
        this.errorClassname = "error-message";

        this.my_company_name = document.getElementById("my_company_name");
        this.my_adress = document.getElementById("my_adress");
        this.my_postalcode = document.getElementById("my_postalcode");
        this.my_city = document.getElementById("my_city");
        this.my_phonenumber = document.getElementById("my_phonenumber");
        this.my_logo = document.getElementById("my_logo");
        
        this.customer_company_name = document.getElementById("customer_company_name");
        this.customer_adress = document.getElementById("customer_adress");
        this.customer_postalcode = document.getElementById("customer_postalcode");
        this.customer_city = document.getElementById("customer_city");
        this.customer_phonenumber = document.getElementById("customer_phonenumber");
        this.customer_logo = document.getElementById("customer_logo");
        
        this.product_name = document.getElementById("product_name");
        this.product_quantity = document.getElementById("product_quantity");
        this.product_puht = document.getElementById("product_puht");
        this.product_tva = document.getElementById("product_tva");

        this.maximum_days = document.getElementById("maximum_days");
        this.legals = document.getElementById("legals");

        this.inputsMyDatas = [
            this.my_company_name, 
            this.my_adress, 
            this.my_postalcode, 
            this.my_city, 
            this.my_phonenumber, 
            this.my_logo
        ];
        this.inputsCustomerDatas = [
            this.customer_company_name, 
            this.customer_adress, 
            this.customer_postalcode, 
            this.customer_city, 
            this.customer_phonenumber, 
            this.customer_logo
        ];
        this.inputsProductDatas = [
            this.product_name, 
            this.product_quantity, 
            this.product_puht, 
            this.product_tva, 
        ];
        this.inputsLegalsDatas = [
            this.maximum_days,
            this.legals
        ];
        
        this.init();
    }

    init(){
        [
            ...this.inputsMyDatas, 
            ...this.inputsCustomerDatas, 
            ...this.inputsProductDatas,
            ...this.inputsLegalsDatas
        ].forEach(input => {
            input.addEventListener("keyup", () => {
                this.validationLoop(input);
            });
            this.prefillInputs(input);
        });

        this.basket_fill_button.addEventListener("click", () => {
            this.updateBasket();
        });

    }

    // Validation pour le premier écran (Mes données)
    myDatasValidator = () => {
        let errors = 0;
        
        this.inputsMyDatas.forEach(input => {
            if(!this.validationLoop(input)){
                errors++;
            }
        });

        if(errors === 0){
            sessionStorage.setItem("my_company_name", this.inputsMyDatas[0].value);
            sessionStorage.setItem("my_adress", this.inputsMyDatas[1].value);
            sessionStorage.setItem("my_postalcode", this.inputsMyDatas[2].value);
            sessionStorage.setItem("my_city", this.inputsMyDatas[3].value);
            sessionStorage.setItem("my_phonenumber", this.inputsMyDatas[4].value);
            sessionStorage.setItem("my_logo", this.inputsMyDatas[5].value);

            return true;
        } else {
            return false
        }

    }

    // Validation pour le second écran (Données du client)
    customerDatasValidator = () => {
        let errors = 0;
        
        this.inputsCustomerDatas.forEach(input => {
            if(!this.validationLoop(input)){
                errors++;
            }
        });

        if(errors === 0){
            sessionStorage.setItem("customer_company_name", this.inputsCustomerDatas[0].value);
            sessionStorage.setItem("customer_adress", this.inputsCustomerDatas[1].value);
            sessionStorage.setItem("customer_postalcode", this.inputsCustomerDatas[2].value);
            sessionStorage.setItem("customer_city", this.inputsCustomerDatas[3].value);
            sessionStorage.setItem("customer_phonenumber", this.inputsCustomerDatas[4].value);
            sessionStorage.setItem("customer_logo", this.inputsCustomerDatas[5].value);

            return true;
        } else {
            return false
        }
    }
    
    // Validation pour le troisième écran (Données produits)
    productDatasValidator(){
        return isBaskedFilled();
    }
    
    // Validation du formulaire de remplissage du devis
    updateBasket(){
        let errors = 0;
        
        this.inputsProductDatas.forEach(input => {
            if(!this.validationLoop(input)){
                errors++;
            }
        });

        if(errors === 0){
            let product = {
                id: "id" + Math.random().toString(16).slice(2),
                name: this.product_name.value,
                quantity: this.product_quantity.value,
                puht: this.product_puht.value,
                tva: this.product_tva.value
            };

            newProductToBasket("basket", product);
            this.cleanInput(this.inputsProductDatas);
            this.inputsProductDatas[0].focus();
        }
    }

    cleanInput(inputs){
        if(inputs.length > 0){
            inputs.forEach(input => {
                input.value = "";
                this.cleanError(input);
            });
        } else {
            inputs.value = "";
            this.cleanError(inputs);
        }
    }
    
    // Validation pour le quatrième écran (Données légaux)
    legalDatasValidator = () => {
        let errors = 0;
        
        this.inputsLegalsDatas.forEach(input => {
            if(!this.validationLoop(input)){
                errors++;
            }
        });

        if(errors === 0){
            sessionStorage.setItem("maximum_days", this.inputsLegalsDatas[0].value);
            sessionStorage.setItem("legals", this.inputsLegalsDatas[1].value);

            printPdf();

            return true;
        } else {
            return false
        }
    }

    // Fonction passerelle qui va vérifier toutes les données d'un écran
    validationLoop(input){
        let value = input.value.trim();

        // On vérifie si l'input est obligatoire et si il est vide
        if(input.required && (value == null || value === "")){
            this.setError(input, this.invalidEmptyMessage);
            return false;
        }

        // Traitement cas numéro de téléphone
        if(input.getAttribute("data-verif") == "phonenumber" && this.isValidPhonenumber(value) == false){
            this.setError(input, this.regexPhoneError);
            return false;
        }

        // Traitement cas code postal
        if(input.getAttribute("data-verif") == "postalcode" && this.isValidPostalCode(value) == false){
            this.setError(input, this.regexPostalCodeError);
            return false;
        }

        // Si les données sont correctes, on supprime le message d'erreur
        this.cleanError(input);
        // Puis on renvoi true
        return true;
    }

    // Renvoi true si le numéro est valide
    isValidPhonenumber(phonenumber){
        return this.regexPhone.test(phonenumber);
    }

    // Renvoi true si le codepostal est valide
    isValidPostalCode(postalcode){
        return this.regexPostalCode.test(postalcode);
    }

    // Gère l'affichage du message d'erreur à l'input concerné 
    setError(input, message){
        let parent = input.closest("div");

        if(parent.querySelector('.' + this.errorClassname)){
            parent.querySelector('.' + this.errorClassname).textContent = message;
        } else {
            let error = document.createElement("p");
            error.textContent = message;
            error.classList.add(this.errorClassname);
            parent.appendChild(error);
        }
    }

    // Nettoie l'erreur à l'input concerné
    cleanError(input){
        let parent = input.closest("div");
        let error = parent.querySelector('.' + this.errorClassname);

        if(error){
            parent.removeChild(error);
        }
    }

    // Préremplie les données dans les inputs si des données sont stockées depuis la sessionStorage
    prefillInputs(input){
        if (input && input.id && sessionStorage.getItem(input.id) && input.type !== "file") {
            input.value = sessionStorage.getItem(input.id);
        }
    }
}