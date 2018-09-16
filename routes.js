var express     = require('express'),
    router      = express.Router(),
    converter   = require('json-2-csv'),
    fs = require('fs');

router.get('/', (req, res) => {
    res.render('index')
})

//csv route
router.post('/csv',(req,res)=>{

    var json2csv = (err,csv)=>{
        if(err) throw err;
        

        // then write the file to csv format 
        fs.writeFile('currency.csv', csv, 'utf8', function (err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
                console.log(csv)
                res.send(true)
                //window.open('/csvDownload')
            }
        })
    }

    converter.json2csv(req.body, json2csv)
    
})

//finaly download the csv after json is converted
router.get('/csvDownload',(req,res)=>{
    res.download('currency.csv')
})

module.exports = router;