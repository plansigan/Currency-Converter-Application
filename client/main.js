var app = new Vue({
    el: '#app',
    data: {
        selected:{
            amount:0,
            currencyId:'AFN',
            symbol:'؋'
        },
        convertedAmount:0,
        convertedCurrency:'AFN',
        countries:{},
        countriesToConvert:[
            //default item
            { amount: 0, currencyId: 'AFN',symbol:'؋' },
            { amount: 0, currencyId: 'XCD',symbol:'$' }
        ],
        formula:{},
        toCSV:{}
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
            APICurrency.get('countries').then(
                response => this.countries = response.data.results
            )
        },
        addCountry(){
            var elem = document.createElement('tr')
            this.countriesToConvert.push({
                amount:0,
                currencyId:"AFN",
                symbol:'؋'
            })
        },
        removeCountry(index){
            if (this.countriesToConvert.length >= 2){
                this.countriesToConvert.splice(index, 1)
            }
        },
        calculateCurrency(){
            this.countriesToConvert = this.countriesToConvert.map(country => {

                //change the currency sign of selected currency
                var temp = Object.assign({}, country)
                var method = this.selected.currencyId + "_" + temp.currencyId
                temp.amount = this.selected.amount * this.formula[method].val
                
                return temp;
            })
        },
        onSelectCountry(e){
            // getting the symbol for the currencies (for selected)
            if(e.target.options.selectedIndex > -1) {
                this.selected.symbol = e.target.options[e.target.options.selectedIndex].getAttribute('symbol')
            }
            //creating a joined formula for the api is quite hard... quite.
            var joinedString = this.countriesToConvert.map((country)=>{
                return  this.selected.currencyId + "_" + country.currencyId
            }).join(",")

            var apiValue = "convert?q=" + joinedString

            //I use the might of google on this one. I never get used to regex T_T
            //just making some adjustments because of the limits of the api. I need to hack on this.
            if (this.isOdd(joinedString.split(",").length)){
                var arrayOfCountries = joinedString.match(/[^,]+/g);
            } else {
                var arrayOfCountries = joinedString.match(/[^,]+,[^,]+/g);
            }
            
            // so here I loop through the arrayOfCountries and combine it in a object all together to this.formula and call the api each time
            for (let countries of arrayOfCountries ){
                var apiValue = "convert?q=" + countries
                APICurrency.get(apiValue).then(
                    response => this.formula = Object.assign(response.data.results, this.formula)
                ).then(()=>{
                    setTimeout(() => { this.calculateCurrency()},500)
                })
            }
        },
        onSelectCountryToConvert(index,event){
            // getting the symbol for the currencies
            if(event.target.options.selectedIndex > -1) {
                this.countriesToConvert[index].symbol = event.target.options[event.target.options.selectedIndex].getAttribute('symbol')
            }
            //creating a joined formula for the api is quite hard... quite.
            var joinedString = this.countriesToConvert.map((country)=>{
                return  this.selected.currencyId + "_" + country.currencyId
            }).join(",")

            var apiValue = "convert?q=" + joinedString

            //I use the might of google on this one. I never get used to regex T_T
            //just making some adjustments because of the limits of the api. I need to hack on this.
            if (this.isOdd(joinedString.split(",").length)){
                var arrayOfCountries = joinedString.match(/[^,]+/g);
            } else {
                var arrayOfCountries = joinedString.match(/[^,]+,[^,]+/g);
            }
            
            // so here I loop through the arrayOfCountries and combine it in a object all together to this.formula and call the api each time
            for (let countries of arrayOfCountries ){
                var apiValue = "convert?q=" + countries
                APICurrency.get(apiValue).then(
                    response => this.formula = Object.assign(response.data.results, this.formula)
                ).then(()=>{
                    setTimeout(() => { this.calculateCurrency()},500)
                })
            }
        },
        isOdd(num){
            return num % 2;
        },
        formatToPrice(x){
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        downloadToCSV(){
            //passing the object to the api for csv conversion
            //this.countriesToConvert.unshift(this.selected)
            var toCSV = []
            
            toCSV.push(this.countriesToConvert)
            toCSV.unshift(this.selected.amount)
            toCSV.unshift(this.selected.currencyId)
            console.log(toCSV)
            API.post('csv', toCSV).then(
                response => response.data ? window.open('/csvDownload') : alert(response.data)
            )
        }
    },
    watch:{
        //oohhhh deep watcher
        'selected.amount'(){
            this.calculateCurrency()
        }
    }
})