var express = require('express');
var router = express.Router();
const connection = require('../system/connection').con;

router.get('/:uid/:amount', function (req, res, next) {
    req.params.amount = parseInt(req.params.amount);
    if (req.params.uid && req.params.amount) {
        connection.query(`SELECT *
                          FROM study_times
                          WHERE uid = '${req.params.uid}'
                          ORDER BY date DESC LIMIT ${req.params.amount}`, function (err, result) {
            if (err) {
                res.json({data: [{error: "Error"}]})
                //console.error(err);
            } else {
                res.json({data: result})
            }
        });
    } else {
        res.json({data: [{error: "Invalid values"}]})
    }
});

//invalid URL
router.all("*", (req, res) => {
    res.json({data: [{error: "Invalid URL"}]})
});

module.exports = router;