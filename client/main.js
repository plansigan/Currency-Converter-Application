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
            //default items
            { amount: 0, currencyId: 'AFN',symbol:'؋', ratio:1 },
            { amount: 0, currencyId: 'XCD', symbol: '$', ratio: 0.035676 }
        ],
        formula:{},
        toCSV:{},
        message:''
    },
    mounted() {
        // run all the functions inside here
        // mostly just filling up the select tags
        this.getCountries() 
        this.onSelectCountryDropDown() 
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
                symbol:'؋',
                ratio:1
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

                if (typeof (this.formula[method].val) == 'undefined') {
                    this.errorMessage('Hi, please try that action again. This maybe cause of slow response of the api or your internet (LOL)')
                }
                temp.ratio = this.formula[method].val
                temp.amount = this.selected.amount * this.formula[method].val
                
                return temp;
            })
        },
        onSelectCountry(e){
            // getting the symbol for the currencies (for selected)
            if(e.target.options.selectedIndex > -1) {
                this.selected.symbol = e.target.options[e.target.options.selectedIndex].getAttribute('symbol')
            }
            this.onSelectCountryDropDown();
        },
        onSelectCountryToConvert(index, event) {
            // getting the symbol for the currencies
            if (event.target.options.selectedIndex > -1) {
                this.countriesToConvert[index].symbol = event.target.options[event.target.options.selectedIndex].getAttribute('symbol')
            }
            this.onSelectCountryDropDown();
        },
        onSelectCountryDropDown(){
            //creating a joined formula for the api is quite hard... quite.
            var joinedString = this.countriesToConvert.map((country) => {
                return this.selected.currencyId + "_" + country.currencyId
            }).join(",")

            var apiValue = "convert?q=" + joinedString

            //I use the might of google on this one. I never get used to regex T_T
            //just making some adjustments because of the limits of the api. I need to hack on this.
            //but with this you can convert currencies more than 6
            if (this.isOdd(joinedString.split(",").length)) {
                var arrayOfCountries = joinedString.match(/[^,]+/g);
            } else {
                var arrayOfCountries = joinedString.match(/[^,]+,[^,]+/g);
            }

            //I didn't round off the prices since you need the raw data of the amount inserted. so if ever it looks ugly i'm sorry for that.
            // so here I loop through the arrayOfCountries and combine it in a object all together to this.formula and call the api each time
            for (let countries of arrayOfCountries) {
                var apiValue = "convert?q=" + countries
                APICurrency.get(apiValue).then(
                    response => this.formula = Object.assign(response.data.results, this.formula)
                ).then(() => {
                    setTimeout(() => { this.calculateCurrency() }, 500)
                })
            }
        }
        ,
        isOdd(num){
            return num % 2;
        },
        formatToPrice(x){
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        },
        downloadToCSV(){
            //passing the object to the api for csv conversion
            //this.countriesToConvert.unshift(this.selected)
            let toCSV = []

            
            toCSV.push(this.countriesToConvert)
            toCSV[0].unshift({
                selectedAmount: this.selected.amount,
                selectedCurrency: this.selected.currencyId,
                selectedSymbol: this.selected.symbol
            })
            
            API.post('csv', toCSV).then(
                response => response.data ? window.open('/csvDownload') : alert(response.data)
            ).then(()=>{
                //for some magical reason this.countriesToConvert adds a new array wtf!?
                this.countriesToConvert.splice(0, 1)
            }).catch((err)=>{
                this.errorMessage("There's no response from the server (index.js) please make sure it is running.")
                this.countriesToConvert.splice(0, 1)
            })
        },
        errorMessage(message){
            this.message = message
            $('.small.modal').modal('show')
        }
    },
    watch:{
        //oohhhh deep watcher
        'selected.amount'(){
            this.calculateCurrency()
        }
    }
})