var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);
var bcrypt = require('bcryptjs');
var fs = require('fs');
<<<<<<< HEAD
var replace = require('stream-replace');
=======
var setCookie = require('set-cookie-parser');
>>>>>>> 2199eba41608572e772090df9e4b56744a089581

var max = knex('nouns');
// var noun = knex('nouns')
// .where('id', Math.floor(Math.random() * nounMax)
//   verb,
//   adj;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('auth', {
    title: 'Express'
  });
});

router.get('/home/:username', function(req, res, next) {
  res.cookie('username', req.body.username);
  res.render('fablibs', {username: req.params.username});
});



router.post('/user/register', function(req, res, next) {
  var hash = bcrypt.hashSync(req.body.password, 8);
  knex('users')
  .insert({
    'userName': req.body.username.toLowerCase(),
    'password': hash
  })
  .then(function(response) {
    res.redirect('/');
  })
});

router.post('/user/login', function(req, res, next) {
  knex('users')
  .where('userName', '=', req.body.username.toLowerCase())
  .first()
  .then(function(response) {
    if (response && bcrypt.compareSync(req.body.password, response.password)) {
      res.redirect('/home/:username');
    } else {
      res.render('auth', {
        error: 'Invalid username or password'
      });
    }
  });
});


router.get('/home', function(req, res, next) {
  fs.readFile('fablibs.txt','utf8', function( err, data ){
    if ( err ) res.send('error:' + err);

    res.render('fablibs', {output: data});
});

router.post('/addnoun', function(req, res, next) {
  knex('nouns')
  .insert(req.body)
  .then(function ( response ){
    res.redirect('/home');
  })
});
router.post('/addverb', function(req, res, next) {
  knex('verbs')
  .insert(req.body)
  .then(function ( response ){
    res.redirect('/home');
  })
});
router.post('/addadj', function(req, res, next) {
  knex('adjectives')
  .insert(req.body)
  .then(function ( response ){
    res.redirect('/home');
  })
});

router.post('/translate', function(req, res, next) {
  console.log(req.params.userName);
  fs.writeFile('fablibs.txt', req.body.fablibs, 'utf8', function( err ){
    if ( err ) res.send('error:' + err);
  });
  res.redirect('/home');
});


module.exports = router;
