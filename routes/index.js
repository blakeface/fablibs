var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['production']);
var bcrypt = require('bcryptjs');
var fs = require('fs');
var replace = require('stream-replace');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('auth', {
    title: 'Fablibs'
  });
});

router.get('/home/:username', function(req, res, next) {
  res.cookie('username', req.params.username);
  res.render('fablibs', {
    username: req.params.username
  });
});

router.get('/update', function(req, res, next) {
  res.render('users', {
    username: res.cookie.username
  });
});

router.post('/update', function(req, res, next) {
  knex('users')

    .where('userName', req.cookies.username)
    .then(function(user) {
      if(bcrypt.compareSync(req.body.password, user[0].password)){
        knex('users').where('id', user[0].id)
        .update({userName: req.body.userName})
        .then(function(response) {
          res.cookie('username', req.body.userName);
          console.log(req.body.userName);
          res.redirect('/home');
        })
      }
      console.log(bcrypt.compareSync(req.body.password, user[0].password));

    })

});


router.get('/home/:username', function(req, res, next) {
  res.cookie('username', req.params.username);
  var newWords = {
    noun: "",
    verb: "",
    adj: ""
  }
  knex.column('word').from('verbs').orderByRaw('random() limit 1').then(
    function(data){
      newWords.verb= data[0].word;
    });
  knex.column('word').from('adjectives').orderByRaw('random() limit 1').then(
    function(data){
      newWords.adj= data[0].word;
    });
  knex.column('word').from('nouns').orderByRaw('random() limit 1').then(
    function(data){
      newWords.noun =  data[0].word;
      var stream = fs.createReadStream('fablibs.txt').pipe(replace(/NOUN/g, newWords.noun))
      .pipe(replace(/VERB/g, newWords.verb)).pipe(replace(/ADJECTIVE/g, newWords.adj));
      var wStream = fs.createWriteStream('fablibbed.txt');

      stream.on("data", function(data){
        wStream.write(data);
        fs.readFile('fablibbed.txt','utf8', function( err, data ){
          if ( err ) res.send('error:' + err);
          res.render('fablibs', {
            output: data,
            username: req.params.username
          });
        })
      });
      stream.on("end", function(){
        wStream.end();
      })
    });
})

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
              res.redirect('/home/' + response.userName);
            } else {
              res.render('auth', {
                error: 'Invalid username or password'
              });
            }
          });
      });

      router.get('/home', function(req, res, next) {
        fs.readFile('fablibs.txt', 'utf8', function(err, data) {
          if (err) res.send('error:' + err);
          console.log(req.cookies.username);
          res.render('fablibs', {
            username: req.cookies.username
          });
        })
      });

      router.get('/logout', function(req, res, next) {
        res.clearCookie('username');
        res.redirect('/');
      });

      router.post('/addnoun', function(req, res, next) {
        knex('nouns')
          .insert(req.body)
          .then(function(response) {
            res.redirect('/home');
          })
      });
      router.post('/addverb', function(req, res, next) {
        knex('verbs')
          .insert(req.body)
          .then(function(response) {
            res.redirect('/home');
          })
      });
      router.post('/addadj', function(req, res, next) {
        knex('adjectives')
          .insert(req.body)
          .then(function(response) {
            res.redirect('/home');
          })
      });

      router.post('/translate', function(req, res, next) {
        fs.writeFile('fablibs.txt', req.body.fablibs, 'utf8', function(err) {
          if (err) res.send('error:' + err);
        });
        res.redirect('/home/'+req.cookies.username);
      });

      router.post('/delete', function(req, res, next) {
        knex('users')
          .where('userName', req.cookies.username)
          .del()
          .then(function(response) {
            res.clearCookie('username');
            res.redirect('/');
          })
      });


      module.exports = router;
