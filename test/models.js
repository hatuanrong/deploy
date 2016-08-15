var chai = require('chai');
var should = chai.should();
var User = require('../models/user');
var Products = require('../models/products');

// describe('User Model', function() {
//     it('should create a new user', function(done) {
//         var user = new User({
//             email: 'test1@gmail.com',
//             password: 'password'
//         });
//         user.save(function(err) {
//             if (err) return done(err);
//             done();
//         })
//     });
//     it('should delete a user', function(done) {
//         User.remove({
//             email: 'test@gmail.com'
//         }, function(err) {
//             if (err) return done(err);
//             done();
//         });
//     });
// });
// describe('Product Model', function() {
//     it('should create a new product', function(done) {
//         var product = new Products({
//             sku: 'xxxyyyzzz',
//             description:'test funxxx',
//             amount : 100
//         });
//         product.save(function(err) {
//             if (err) return done(err);
//             done();
//         })
//     });
// });

describe('Product Model', function() {
    it('should get product', function(done) {
        var id = '57a6aac6323267c01a2f6865';
        var page = 1, limit = 1;
        done();
    });
});
