const express = require('express');
const controller = require('../controllers/clothesController');

const router = express.Router();

//GET /clothes: send all clothes to the user
router.get('/', controller.index);

//GET /clothes/new: send html form for creating a new story
router.get('/new',controller.new);

//POST /clothes: create a new clothing item
router.post('/', controller.create);

router.get('/search', controller.search);

//GET /clothes/:id clothes with a root parameter is used to send details of clothes identified by id
router.get('/:id', controller.show);


//GET /clothes/:id.edit: send html form for editing an existing clothes
router.get('/:id/edit', controller.edit);

//PUT /clothes/:id: updatethe clothes identified by id
router.put('/:id', controller.update);

//DELETE /clothess/:id. delete clothes identified by id
router.delete('/:id', controller.delete);




module.exports = router;
