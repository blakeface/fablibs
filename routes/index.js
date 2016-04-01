var express = require('express');
var router = express.Router();
var knex = require('knex')(require('../knexfile')['development']);


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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



module.exports = router;
