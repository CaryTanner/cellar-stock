let express = require('express');
let router = express.Router();

// Require controller modules.

let producer_controller = require('../controllers/producerController');
let origin_controller = require('../controllers/originController');
let bottle_instance_controller = require('../controllers/bottleInstanceController');
let variety_controller = require('../controllers/varietyController');
let category_controller = require('../controllers/categoryController');

/// BOTTLE ROUTES ///

// GET catalog home page.
router.get('/', bottle_instance_controller.index);



/// Producer ROUTES ///

// GET request for creating producer. NOTE This must come before route for id (i.e. display producer).
router.get('/producer/create', producer_controller.producer_create_get);

// POST request for creating producer.
router.post('/producer/create', producer_controller.producer_create_post);

// GET request to delete producer.
router.get('/producer/:id/delete', producer_controller.producer_delete_get);

// POST request to delete producer.
router.post('/producer/:id/delete', producer_controller.producer_delete_post);

// GET request to update producer.
router.get('/producer/:id/update', producer_controller.producer_update_get);

// POST request to update producer.
router.post('/producer/:id/update', producer_controller.producer_update_post);

// GET request for producer.
router.get('/producer/:id', producer_controller.producer_detail);

// GET request for list of all producers.
router.get('/producers', producer_controller.producer_list);

/// Origin ROUTES ///

// GET request for creating a origin. NOTE This must come before route that displays origin (uses id).
router.get('/origin/create', origin_controller.origin_create_get);

//POST request for creating origin.
router.post('/origin/create', origin_controller.origin_create_post);

// GET request to delete origin.
router.get('/origin/:id/delete', origin_controller.origin_delete_get);

// POST request to delete origin.
router.post('/origin/:id/delete', origin_controller.origin_delete_post);

// GET request to update origin.
router.get('/origin/:id/update', origin_controller.origin_update_get);

// POST request to update origin.
router.post('/origin/:id/update', origin_controller.origin_update_post);

// GET request for one origin.
router.get('/origin/:id', origin_controller.origin_detail);

// GET request for list of all origin.
router.get('/origins', origin_controller.origin_list);

/// BOTTLEINSTANCE ROUTES ///

// GET request for creating a BottleInstance. NOTE This must come before route that displays BottleInstance (uses id).
router.get('/bottleinstance/create', bottle_instance_controller.bottleinstance_create_get);

// POST request for creating BottleInstance. 
router.post('/bottleinstance/create', bottle_instance_controller.bottleinstance_create_post);

// GET request to delete BottleInstance.
router.get('/bottleinstance/:id/delete', bottle_instance_controller.bottleinstance_delete_get);

// POST request to delete BottleInstance.
router.post('/bottleinstance/:id/delete', bottle_instance_controller.bottleinstance_delete_post);

// GET request to update BottleInstance.
router.get('/bottleinstance/:id/update', bottle_instance_controller.bottleinstance_update_get);

// POST request to update BottleInstance.
router.post('/bottleinstance/:id/update', bottle_instance_controller.bottleinstance_update_post);

// GET request for one BottleInstance.
router.get('/bottleinstance/:id', bottle_instance_controller.bottleinstance_detail);

// GET request for list of all BottleInstance.
router.get('/bottleinstances', bottle_instance_controller.bottleinstance_list);

module.exports = router;

/// VARIETY ROUTES ///

// GET request for creating a variety. NOTE This must come before route that displays variety (uses id).
router.get('/variety/create', variety_controller.variety_create_get);

//POST request for creating variety.
router.post('/variety/create', variety_controller.variety_create_post);

// GET request to delete variety.
router.get('/variety/:id/delete', variety_controller.variety_delete_get);

// POST request to delete variety.
router.post('/variety/:id/delete', variety_controller.variety_delete_post);

// GET request to update variety.
router.get('/variety/:id/update', variety_controller.variety_update_get);

// POST request to update variety.
router.post('/variety/:id/update', variety_controller.variety_update_post);

// GET request for one variety.
router.get('/variety/:varietyname', variety_controller.variety_detail);

// GET request for list of all variety.
router.get('/varieties/', variety_controller.varieties_list);

/// CATEGORY ROUTES ///


// GET request for one category.
router.get('/category/:name', category_controller.category_details);

