const Pokemon = require('../models/pokemon');

const pokemonController = {

  homePage: async (req, res) => {
    try {
      const allPkmns = await Pokemon.find();

      res.render('list', {
        pageTitle: "Accueil",
        pokemonList: allPkmns
      });

    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },

  detailsPage: async (req, res, next) => {
    try {
      const targetId = req.params.id;
      const targetPkmn = await Pokemon.findOne({
        id: targetId
      });

      if (targetPkmn) {
        res.render('details', {
          pageTitle: "Détails de "+targetPkmn.name,
          pokemon: targetPkmn
        });
      } else {
        // pokemon pas trouvé => 404 !
        next();
      }

    } catch (error) {
      console.error(error);
      res.status(500).send(error.message);
    }
  },

};


module.exports = pokemonController;