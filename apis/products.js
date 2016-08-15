'use strict';
var express = require('express'),
    db = require('../models'),
    logger = require('../helpers/logger'),
    config = require('config'),
    router = express.Router();

router.post('/createproduct', function(req, res){
        var Product = new db.Products(req.body);
        Product.save(function(error, new_product){
            if (error) {
                return res.status(406).send(JSON.stringify({error}));
            }
            // remove security attributes
            new_product = Product.toObject();

            res.send(JSON.stringify(new_product));
        });
    });
router.get('/get/:id',function(req,res){
  db.Products.findById(req.params.id,function(err,data){
    if(err) console.log(err);
    else {
        res.send(JSON.stringify(data));
    }
  });
});
// get list of products
router.get('/getlist/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.Products
    .find()
    .skip(skip)
    .limit(limit)
    .sort({'_id': 'desc'})
    .then(function(data) {
        res.send(JSON.stringify(data));
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});

module.exports = router;
