let express = require('express');
let router = express.Router();
let Sighting = require('../db').import('../models/sighting');
let validateSession = require('../Middleware/validate-session');

/**************************
 **** VIEW ALL UPLOADS ****
 **************************/

router.get("/", (req, res) => {
    Sighting.findAll()
      .then(sightings => res.status(200).json(sightings))
      .catch(err => res.status(500).json({ error: err }));
  });

/***********************
 **** DELETE UPLOAD ****
 **********************/

router.delete('/:id', validateSession, function (req, res) {
    const query = {where: { id: req.params.id, owner_id: req.user.id}};

    Sighting.destroy(query)
    .then(() => res.status(200).json({message: "Upload has been removed"}))
    .catch((err) => res.status(500).json({error: err}))
})


router.post('/sighting', validateSession, (req, res) => {
  const sightingEntry = {
      bird: req.body.sighting.bird,
      location: req.body.sighting.location,
      time: req.body.sighting.time,
      date: req.body.sighting.date,
      description: req.body.sighting.description,
      image: req.body.sighting.image,
      rarity: req.body.sighting.rarity,
      private1: req.body.sighting.private1,
      owner_id: req.user.id,
      likes: 0
  }
  Sighting.create(sightingEntry)
    .then(sighting => res.status(200).json(sighting))
    .catch(err => res.status(500).json({ error: err }))
})

router.get('/mine', validateSession, (req, res) => {
    let userid = req.user.id
    Sighting.findAll({
        where: { owner_id: userid }
    })
    .then(log => res.status(200).json(log))
    .catch(err => res.status(500).json({ error: err }))
})

router.put('/update/:id', validateSession, function (req, res)
{
  const updateSighting = {
    bird: req.body.sighting.bird,
    location: req.body.sighting.location,
    time: req.body.sighting.time,
    date: req.body.sighting.date,
    description: req.body.sighting.description,
    image: req.body.sighting.image,
    rarity: req.body.sighting.rarity,
    private1: req.body.sighting.private1,
    owner_id: req.user.id
  };

  
  const query = { where: { id: req.params.id, owner_id: req.user.id} };
  Sighting.update(updateSighting, query)
    .then((sightings) => res.status(200).json(sightings))
    .catch((err) => res.status(500).json({ error: err }));  
});

router.put('/updatelikes/:id', function (req, res) {
  const updateLikes = {
    likes: req.body.sighting.likes
  };
  
  const query = { where: { id: req.params.id, owner_id: req.params.id} };
  Sighting.update(updateLikes, query)
    .then((sightings) => res.status(200).json(sightings))
    .catch((err) => res.status(500).json({ error: err }));  
});


module.exports = router