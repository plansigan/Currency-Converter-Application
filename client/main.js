var app = new Vue({
    el: '#app',
    data: {
        selectedAmount: 0,
        selectedCurrency:'AFN',
        convertedAmount:0,
        convertedCurrency:'AFN',
        countries:{},
        countriesToConvert:[
            //default item
            { amount: 0, currencyId: 'AFN' },
            { amount: 0, currencyId: 'XCD' }
        ],
        formula:{}
    },
    mounted() {
        // run all the functions inside here
        // mostly just filling up the select tags
        this.getCountries() 
        this.onSelectCountry() 
    },
    methods:{
        // naming conventions in functions will be as simple as possible so that I don't have to provide a comment.
        getCountries(){
            API.get('countries').then(
                response => this.countries = response.data.results
            )
        },
        addCountry(){
            var elem = document.createElement('tr')
            this.countriesToConvert.push({
                amount:0,
                currencyId:"AFN"
            })
        },
        removeCountry(index){
            this.countriesToConvert.splice(index,1)
        },
        calculateCurrency(){
            this.countriesToConvert = this.countriesToConvert.map(country => {
                var temp = Object.assign({}, country)
                var method = this.selectedCurrency + "_" + temp.currencyId
                temp.amount = this.selectedAmount * this.formula[method].val

                return temp;
            })
        },
        onSelectCountry(){
            // getting the formula for the currencies
            //creating a joined formula for the api is quite hard... quite.
            var joinedString = this.countriesToConvert.map((country)=>{
                return  this.selectedCurrency + "_" + country.currencyId
            }).join(",")

            var apiValue = "convert?q=" + joinedString

            //I use the might of google on this one. I never get used to regex T_T
            //just making some adjustments because of the limits of the api. I need to hack on this.
            if (this.isOdd(joinedString.split(",").length)){
                var arrayOfCountries = joinedString.match(/[^,]+/g);
            } else {
                var arrayOfCountries = joinedString.match(/[^,]+,[^,]+/g);
            }
            
            // so here I loop through the api and combine it in a object all together to this.formula
            for (let countries of arrayOfCountries ){
                var apiValue = "convert?q=" + countries
                API.get(apiValue).then(
                    response => this.formula = Object.assign(response.data.results, this.formula)
                ).then(()=>{
                    this.calculateCurrency()
                })
            }
        },
        isOdd(num){
            return num % 2;
        }
    },
    watch:{
        selectedAmount(){
            this.calculateCurrency()
        }
    }
})