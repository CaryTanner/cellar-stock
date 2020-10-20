#! /usr/bin/env node

console.log('This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0-mbdj7.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
let userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
let async = require('async')
let Bottle = require('./models/bottle')
let Producer = require('./models/producer')
let Origin = require('./models/origin')
let BottleInstance = require('./models/bottleInstance')
let Variety = require('./models/variety')
let Category = require('./models/category')


let mongoose = require('mongoose');
let mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

let producers = []
let origins = []
let bottles = []
let bottleinstances = []
let varieties = []
let categories = []
let classifications = []

function producerCreate(name, region, cb) {
  producerdetail = {name: name}
  if (region != false) producerdetail.region = region;
 
  
  var producer = new Producer(producerdetail);
       
  producer.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Producer: ' + producer);
    producers.push(producer)
    cb(null, producer)
  }  );
}

function originCreate(country, region, village, vineyard, cb) {
  originDetail = ({
    country: country, 
    region: region
  })
  if (village != false) originDetail.village = village;
  if (vineyard != false) originDetail.vineyard = vineyard;
  var origin = new Origin(originDetail);
       
  origin.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New origin: ' + origin);
    origins.push(origin)
    cb(null, origin);
  }   );
}

function bottleCreate(producer, origin, classification, category, variety, price, rating, notes, cb) {
  bottledetail = { 
    producer: producer,
    origin: origin,
    category: category,
    
  }
  if (classification != false) bottledetail.classification = classification;
  if (variety != false) bottledetail.variety = variety;
  if (price != false) bottledetail.price = price;
  if (rating != false) bottledetail.rating = rating;
  if (notes != false) bottledetail.notes = notes;

    
  var bottle = new Bottle(bottledetail);    
  bottle.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Bottle: ' + bottle);
    bottles.push(bottle)
    cb(null, bottle)
  }  );
}


function bottleInstanceCreate(bottle, age, count, bin, status, drink_from, drink_before, cb) {
  bottleinstancedetail = { 
    bottle: bottle,
    age: age,
    count: count,
    bin,
  }    
  if (drink_from != false) bottleinstancedetail.drink_from = drink_from
  if (drink_before != false) bottleinstancedetail.drink_before = drink_before
  if (status != false) bottleinstancedetail.status = status
    
  var bottleinstance = new BottleInstance(bottleinstancedetail);    
  bottleinstance.save(function (err) {
    if (err) {
      console.log('ERROR CREATING BottleInstance: ' + bottleinstance);
      cb(err, null)
      return
    }
    console.log('New BottleInstance: ' + bottleinstance);
    bottleinstances.push(bottleinstance)
    cb(null, bottle)
  }  );
}

function varietyCreate(name, cb) {
  var variety = new Variety({ varietyName: name });
       
  variety.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Variety: ' + variety);
    varieties.push(variety)
    cb(null, variety);
  }   );
}


function createProducersVarietiesOrigins(cb) {
    async.series([
        function(callback) {
          producerCreate("Domain de l'Arlot", 'Bourgogne', callback);
        },
        function(callback) {
          producerCreate('Trediberri', 'Piemont', callback);
        },
        function(callback) {
          producerCreate('Emmerich Knoll', 'Wachau', callback);
        },
        function(callback) {
          producerCreate('Andre Jacquart', 'Champagne', callback);
        },
        function(callback) {
          producerCreate('Hannes Sabathi', "Sudsteiermark", callback);
        },
        function(callback) {
          varietyCreate("Cabernet Sauvignon", callback);
        },
        function(callback) {
          varietyCreate("Pinot Noir", callback);
        },
        function(callback) {
          varietyCreate("Riesling", callback);
        },
        function(callback) {
          varietyCreate("Nebbiolo", callback);
        },
        function(callback) {
          varietyCreate("Sauvignon Blanc", callback);
        },
        function(callback) {
          varietyCreate("Chardonnay", callback);
        },
        function(callback) {
          varietyCreate("Grüner Veltliner", callback);
        },
        function(callback) {
          originCreate("France", 'Bourgogne', 'Nuits St George', 'Clos des Forets', callback);
        },
        function(callback) {
          originCreate("Italy", 'Piemonte', false, false, callback);
        },
        function(callback) {
          originCreate("Austria", 'Sudsteiermark', 'Gamlitz', false, callback);
        },
        function(callback) {
          originCreate("Austria", 'Wachau', false, 'Kellerberg', callback);
        },
        function(callback) {
          originCreate("France", 'Champagne', 'Vertus', false, callback);
        },



        ],
        // optional callback
        cb);
}


function createBottles(cb) {
    async.parallel([
        function(callback) {
          //bottleCreate(producer, origin, classification, category, variety, price, rating, notes, cb)
          bottleCreate(producers[0], origins[0], '1er Cru', 'Red', varieties[1], false, false, 'Delicious', callback);
        },
        function(callback) {
          //bottleCreate(producer, origin, classification, category, variety, price, rating, notes, cb)
          bottleCreate(producers[0], origins[0], 'Village', 'Red', varieties[1], false, false, 'Simple but worth the price ', callback);
        },
        function(callback) {
          //bottleCreate(producer, origin, classification, category, variety, price, rating, notes, cb)
          bottleCreate(producers[1], origins[1], 'Langhe', 'Red', varieties[3], 20, 3.9, 'Too young', callback);
        },
        function(callback) {
          //bottleCreate(producer, origin, classification, category, variety, price, rating, notes, cb)
          bottleCreate(producers[1], origins[1], 'Barolo Cannubi', 'Red', varieties[1], 50, 4.8, 'Delicious', callback);
        },
        function(callback) {
          //bottleCreate(producer, origin, classification, category, variety, price, rating, notes, cb)
          bottleCreate(producers[2], origins[3], 'Smaragd', 'White', varieties[3], false, false, false, callback);
        },
        function(callback) {
          //bottleCreate(producer, origin, classification, category, variety, price, rating, notes, cb)
          bottleCreate(producers[2], origins[3], 'Federspiel', 'White', varieties[6], false, false, 'white pepper!', callback);
        },
        function(callback) {
          //bottleCreate(producer, origin, classification, category, variety, price, rating, notes, cb)
          bottleCreate(producers[3], origins[4], '1er Cru', 'Sparkling', varieties[5], false, false, 'big & round', callback);
        },
        
        ],
        // optional callback
        cb);
}


function createBottleInstances(cb) {
    async.parallel([

        function(callback) {
          //bottleInstanceCreate(bottle, age, count, bin,  status, drink_from, drink_before, cb)
          bottleInstanceCreate(bottles[0], 2015, 3, 10, 'Drink or Hold', false, false, callback)
        },
        function(callback) {
          bottleInstanceCreate(bottles[1], 2018, 12, 11, 'Drink or Hold', false, false, callback)
        },
        function(callback) {
          bottleInstanceCreate(bottles[2], 2018, 12, 24, 'Hold', false, false, callback)
        },
        function(callback) {
          bottleInstanceCreate(bottles[3], 2000, 1, 25, 'Drink or Hold', false, false, callback)
        },
        function(callback) {
          bottleInstanceCreate(bottles[4], 2010, 2, 7, 'Drink', false, false, callback)
        },
        function(callback) {
          bottleInstanceCreate(bottles[5], 2017, 12, 7, 'Drink or Hold', false, false, callback)
        },
        function(callback) {
          bottleInstanceCreate(bottles[6], 2012, 6, 1, 'Drink or Hold', false, false, callback)
        }
        
    
        ],
        // Optional callback
        cb);
}



async.series([
  createProducersVarietiesOrigins,  
  
    createBottles,
    createBottleInstances
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+err);
    }
    else {
        console.log('BottlesInstances: '+ bottleinstances);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




