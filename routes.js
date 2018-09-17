var express     = require('express'),
    router      = express.Router(),
    Json2csvParser = require('json2csv').Parser,
    fs = require('fs');

router.get('/', (req, res) => {
    res.render('index')
})

//csv route
router.post('/csv',(req,res)=>{

    let jsonBody = req.body[0];

    //setting up the fields
    let fields = [
        //selected
        {
            label: 'Amount',
            value: (row, field) => typeof (row.selectedSymbol) == 'undefined' ? '' : row.selectedSymbol + " " + row.selectedAmount,
            default: '',
            stringify: true
        },
        {
            label: 'Currency ID',
            value: 'selectedCurrency',
            default: ''
        },
        //to Convert
        {
            label: 'Converted Amount',
            value: (row, field) => typeof (row.symbol) == 'undefined' ? '' : row.symbol + " " + row.amount,
            default:'',
            stringify: true
        },
        {
            label:'Currency ID',
            value:'currencyId',
            default:''
        }
    ];

    const json2csvParser = new Json2csvParser({fields});
    const csv = json2csvParser.parse(jsonBody);

    // then write the file to csv format 
    fs.writeFile('currency.csv', csv, 'utf8', function (err) {
        if (err) {
            console.log('Some error occured - file either not saved or corrupted file saved.');
        } else {
            //sends true if csv is correct or no error
            res.send(true)
        }
    })
    
})

//finaly download the csv after json is converted
router.get('/csvDownload',(req,res)=>{
    res.download('currency.csv')
})

module.exports = router;