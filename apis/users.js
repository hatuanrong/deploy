'use strict';
var express = require('express'),
    db = require('../models'),
    logger = require('../helpers/logger'),
    moment = require('moment'),
    config = require('config'),
    crypto = require('crypto'),
    cache = require('../helpers/cache'),
    nodemailer = require('nodemailer'),
    smtpTransport = require('nodemailer-smtp-transport'),
    q = require('../queues'),
    router = express.Router();


// create a new user
router.post('/create', function(req, res){
    var user = new db.User(req.body);
    user.save(function(error, new_user){
        if (error) {
            return res.status(406).send(JSON.stringify({error}));
        }
        // var transporter = nodemailer.createTransport(smtpTransport(config.get('mailer')));
        // logger.info('send email to user',new_user.email);
        // transporter.sendMail({
        //   from:config.get('mailer.from'),
        //   to:new_user.email,
        //   subject:'thanh you',
        //   html:'hi thanh you'
        // });
        // send email to queue message system
        logger.debug('send a mess to queue',new_user.email);
        q.create('email',{
            title:'[Site Admin] thank you',
            to:new_user.email
          }).priority('high').save();
        // remove security attributes
        new_user = user.toObject();
        if (new_user) {
            delete new_user.hashed_password;
            delete user.salt;
        }
        res.send(JSON.stringify(new_user));
    });
});

router.put('/update/:id',function(req,res){
  db.User.findById(req.params.id,function(err,data){
    if(err) console.log(err);
    data.username = req.body.username;
    data.email    = req.body.email;
    data.password = req.body.password;
    data.save(function(err){
      if(err) console.log('not found');
        res.send(data);
    });
  });
});
// get list of users
router.get('/list/:page/:limit', function(req, res){
    var limit = (req.params.limit)? parseInt(req.params.limit): 10;
    var skip = (req.params.page)? limit * (req.params.page - 1): 0;
    db.User
    .find()
    .skip(skip)
    .limit(limit)
    .sort({'_id': 'desc'})
    .then(function(users) {
        res.send(JSON.stringify(users));
    }).catch(function(e) {
        res.status(500).send(JSON.stringify(e));
    });
});
// get a user by id
router.get('/get/:id', function(req, res){
    logger.debug('Get User By Id', req.params.id);
    cache.get('get_user_by_id' + req.params.id, function(err,reply){
      if(!err && reply){
        logger.debug('return data from cache');
        return res.send(reply);
      }
      else{
        db.User.findOne({
            _id: req.params.id
        }).then(function(user){
            // remove security attributes
            user = user.toObject();
            if (user) {
                delete user.hashed_password;
                delete user.salt;
            }
            // save to cache
            logger.debug("save user to cache ", req.params.id)
            cache.set('get_user_by_id' + req.params.id, JSON.stringify(user));
            res.send(JSON.stringify(user));
        }).catch(function(e){
            res.status(500).send(JSON.stringify(e));
        });
      }
    })
});

// login
router.post('/login', function(req, res){
    var username = req.body.username;
    var password = req.body.password;
    db.User.findOne({
        username: username
    }).then(function(user){
        if (!user.authenticate(password)) {
            throw false;
        }
        db.Token.findOne({
            username: username
        }).then(function(t){
            if (!t){
                crypto.randomBytes(64, function(ex, buf) {
                    var token = buf.toString('base64');
                    var today = moment.utc();
                    var tomorrow = moment(today).add(config.get('token_expire'), 'seconds').format(config.get('time_format'));
                    var token = new db.Token({
                        username: username,
                        token: token,
                        expired_at: tomorrow.toString()
                    });
                    token.save(function(error, to){
                        return res.send(JSON.stringify(to));
                    });
                });
            }
            res.send(JSON.stringify({
                token: t.token,
                id: user.id,
                expired_at: t.expired_at
            }));
        });
    }).catch(function(e){
        res.status(401).send(JSON.stringify(e));
    });
});
module.exports = router;
