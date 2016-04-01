var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);
var bcrypt = require('bcryptjs');
var fs = require('fs');
var replace = require('stream-replace');


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
  knex.column('word').from('nouns').orderByRaw('random() limit 1').then(
    function(data){
      console.log(data[0].word);
      var noun =  data[0].word;
      var stream = fs.createReadStream('fablibs.txt').pipe(replace(/NOUN/g, noun));
      var wStream = fs.createWriteStream('fablibbed.txt');

      stream.on("data", function(data){
        wStream.write(data);
        fs.readFile('fablibbed.txt','utf8', function( err, data ){
          if ( err ) res.send('error:' + err);
          res.render('fablibs', {output: data});
        })
      });
      stream.on("end", function(){
        wStream.end();
      })
    }
  )
})

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
