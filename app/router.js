const express = require('express');
const pokemonController = require('./controllers/pokemonController');
const typeController = require('./controllers/typeController');

const router = express.Router();

router.get('/', pokemonController.homePage);
router.get('/pokemon/:id', pokemonController.detailsPage );

router.get('/type', typeController.typesPage );
router.get('/type/:type', typeController.pokemonByType );

// un pti middleware 404, en dernier !
router.use( (req, res) => {
  res.render('404', {pageTitle: "Not Found"});
});


module.exports = router;