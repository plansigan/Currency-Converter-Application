var app = new Vue({
    el: '#app',
    data: {
        selectedAmount: 0,
        selectedCurrency:'AFN',
        convertedAmount:0,
        convertedCurrency:'AFN',
        countries:{},
        countriesToConvert:{},
        formula:{}
    },
    mounted() {
        // run all the functions inside here
        // mostly just filling up the select tags
        this.getCountries() 
        this.onSelectCountry() 
    },
    methods:{
        // naming conventions in functions will be as simple as possible
        getCountries(){
            API.get('countries').then(
                response => this.countries = response.data.results
            )
        },
        addCountriesToConvert(){

        },
        onSelectCountry(){
            // getting the formula for the currencies
            var apiValue = "convert?q=" + this.selectedCurrency + "_" + this.convertedCurrency   
            API.get(apiValue).then(
                response => this.formula = response.data.results
            )
        }
    },
    watch:{
        selectedAmount(){
            var countries = this.selectedCurrency + "_" + this.convertedCurrency
            this.convertedAmount = this.selectedAmount * this.formula[countries].val
        }
    }
})