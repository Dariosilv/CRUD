let express = require('express');
let db = require('../utils/db');
let router = express.Router();


/* Rota principal usando a view index.ejs. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CRUD' });
});



/*router.get('/autores/add', function(req, res) {
    res.render('autores-add');

});
*/
module.exports = router;

