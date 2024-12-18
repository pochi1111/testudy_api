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
                res.status(500);
                res.json({data: [{error: "Error : Failed to select"}]})
                //console.error(err);
            } else {
                res.json({data: result})
            }
        });
    } else {
        res.status(400);
        res.json({data: [{error: "Invalid values"}]})
    }
});

router.post('/', function (req, res, next) {
    if (req.body.uid && req.body.date && req.body.time) {
        if (isNaN(req.body.time) || isNaN(Date.parse(req.body.date))) {
            res.status(400);
            res.json({data: [{error: "Invalid values"}]})
            return;
        }
        if (req.body.time < 0) {
            res.status(400);
            res.json({data: [{error: "Invalid values"}]})
            return;
        }
        //日時がすでにあるかを確認する
        connection.query(`SELECT *
                          FROM study_times
                          WHERE uid = '${req.body.uid}' AND date = '${req.body.date}'`, function (err, result) {
            if (err) {
                res.status(500);
                res.json({data: [{error: "Error : Failed to check if the date already exists"}]})
                console.error(err);
            } else {
                if (result.length === 0) {
                    connection.query(`INSERT INTO study_times (uid,date,studytime)
                                      VALUES ('${req.body.uid}','${req.body.date}',${req.body.time})`, function (err, result) {
                        if (err) {
                            res.status(500);
                            res.json({data: [{error: "Error : Failed to insert"}]})
                            console.error(err);
                        } else {
                            res.status(201);
                            res.json({data: [{success: "Success"}]})
                        }
                    });
                } else {
                    //console.log(result[0].studytime);
                    connection.query(`UPDATE study_times
                                      SET studytime = ${req.body.time+result[0].studytime}
                                      WHERE uid = '${req.body.uid}' AND date = '${req.body.date}'`, function (err, result) {
                        if (err) {
                            res.status(500);
                            res.json({data: [{error: "Error : Failed to update"}]})
                            console.error(err);
                        } else {
                            res.status(201);
                            res.json({data: [{success: "Success"}]})
                        }
                    });
                }
            }
        });
    } else {
        res.status(400);
        res.json({data: [{error: "Invalid values"}]})
    }
});

//invalid URL
router.all("*", (req, res) => {
    res.status(400);
    res.json({data: [{error: "Invalid URL"}]})
});

module.exports = router;