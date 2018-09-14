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
        //console.log(csv)

        // then write the file to csv format 
        fs.writeFile('currency.csv', csv, 'utf8', function (err) {
            if (err) {
                console.log('Some error occured - file either not saved or corrupted file saved.');
            } else {
                res.download('currency.csv')
            }
        })
    }

    converter.json2csv(req.body, json2csv)
    
})

module.exports = router;