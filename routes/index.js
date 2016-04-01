var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);
var bcrypt = require('bcryptjs');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('auth', {
    title: 'Express'
  });
});

router.get('/home', function(req, res, next) {
  res.render('index');
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
        res.redirect('/home');
      } else {
        res.render('auth', {
          error: 'Invalid username or password'
        });
      }
    });
});

router.get('/fablibs', function(req, res, next) {
  res.render('fablibs');
});

router.post('/addnoun', function(req, res, next) {
  knex('nouns')
  .insert(req.body)
  .then(function ( response ){
    res.redirect('/fablibs');
  })
});
router.post('/addverb', function(req, res, next) {
  knex('verbs')
  .insert(req.body)
  .then(function ( response ){
    res.redirect('/fablibs');
  })
});
router.post('/addadj', function(req, res, next) {
  knex('adjectives')
  .insert(req.body)
  .then(function ( response ){
    res.redirect('/fablibs');
  })
});



module.exports = router;
