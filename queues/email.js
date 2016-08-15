'use strict';
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var config = require('config');
var consumer = {};
var transporter = nodemailer.createTransport(smtpTransport(config.get('mailer')));
var logger = require('../helpers/logger');
consumer.name = 'email';

// var EmailTemplate = require('email-templates').EmailTemplate;
var path = require('path');

consumer.task = function(job, done){
    var data = job.data;
        try{
            logger.debug('Send email', data.title);
            transporter.sendMail({
                from: config.get('mailer.from'),
                to: data.to,
                subject: data.title,
                html: 'hi hatuanrong'
            });
        } catch(e) {
            logger.error(e);
        }
    done();
};

module.exports = consumer;
