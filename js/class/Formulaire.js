class Formulaire {
    constructor() {
        this.validLevel = [
            this.myDatasValidator, 
            this.customerDatasValidator, 
            this.productDatasValidator, 
            this.legalDatasValidator
        ];
        this.regexPhone = /^(0[1-9])(\d{8})$/;
        this.regexPostalCode = /^[0-9]{5}$/;
        this.regexPhoneError = "Le numéro de téléphone n'est pas valide";
        this.regexPostalCodeError = "Le code postal n'est pas valide";
        this.invalidEmptyMessage = "Ce champ ne peut pas être vide";
        this.errorClassname = "error-message";

        this.my_company_name = document.querySelector("#my_company_name");
        this.my_adress = document.querySelector("#my_adress");
        this.my_postalcode = document.querySelector("#my_postalcode");
        this.my_city = document.querySelector("#my_city");
        this.my_phonenumber = document.querySelector("#my_phonenumber");
        this.my_logo = document.querySelector("#my_logo");

        this.inputsMyDatas = [
            this.my_company_name, 
            this.my_adress, 
            this.my_postalcode, 
            this.my_city, 
            this.my_phonenumber, 
            this.my_logo
        ];
        
        this.init();
    }

    init(){
        [...this.inputsMyDatas].forEach(input => {   
            input.addEventListener("keyup", () => {
                this.validationLoop(input);
            });
        });
    }

    // Validation pour le premier écran (Mes données)
    myDatasValidator = () =>{
        let errors = 0;
        
        this.inputsMyDatas.forEach(input => {
            if(!this.validationLoop(input)){
                errors++;
            }
        });

        return errors === 0;
    }

    // Validation pour le second écran (Données du client)
    customerDatasValidator(){
        return true;
    }
    
    // Validation pour le troisième écran (Données produits)
    productDatasValidator(){
        return true;
    }
    
    // Validation pour le quatrième écran (Données légaux)
    legalDatasValidator(){
        return true;
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

        this.cleanError(input);
        return true;
    }

    // Renvoi true si le numéro est valide
    isValidPhonenumber(phonenumber){
        return this.regexPhone.test(phonenumber);
    }

    // Renvoi true si le codepostal est valide
    isValidPostalCode(postalcode){
        console.log("Valeur de l'input: ", postalcode);
        console.log("Test avec la regex", this.regexPostalCode.test(postalcode));
        console.log("")
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
}