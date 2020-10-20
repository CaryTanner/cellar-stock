const BottleInstance = require('../models/bottleInstance');
const Bottle = require("../models/bottle");

const Producer = require("../models/producer");
const Origin = require("../models/origin");

const Variety = require("../models/variety");
const Category = require("../models/category");

const async = require("async");
const { body, validationResult } = require("express-validator");

exports.index = (req, res) => {
  async.parallel(
    {
      bottle_count: (cb) => {
        Bottle.countDocuments({}, cb);
      },
      bottle_instance_count: (cb) => {
        BottleInstance.countDocuments({}, cb);
      },
      bottle_instance_count_total: (cb) => {
        BottleInstance.find({}, cb).exec();
      },
      bottle_instance_drink_count: (cb) => {
        let drinkers = BottleInstance.countDocuments({ status: "Drink" }, cb);
      },
      bottle_instance_drinkorhold_count: (cb) => {
        BottleInstance.countDocuments({ status: "Drink or Hold" }, cb);
      },
      producer_count: (cb) => {
        Producer.countDocuments({}, cb);
      },
      varieties_count: (cb) => {
        Variety.countDocuments({}, cb);
      },
      origins_count: (cb) => {
        Origin.countDocuments({}, cb);
      },
    },
    (err, results) => {
      //get total number of bottles in cellar adding counts from every instance
      let totalBottles = results.bottle_instance_count_total
        .map((res) => res.count)
        .reduce((acc, current) => {
          return acc + current;
        }, 0);
      res.render("index", {
        title: "Cellar Stock ",
        subtitle: "Wine Cellar Tracker",
        bottlesTotal: totalBottles,
        error: err,
        data: results,
      });
    }
  );
};


// Display list of all bottleInstances.
exports.bottleinstance_list = (req, res) => {
    
        BottleInstance.find({} )
        .populate('producer')
        .populate('origin')
        .populate('variety')
        .exec( (err, list_bottleInstance) => {
            // console.log(list_bottleInstance.map( x => x.bottle.variety[0]['varietyName'] ))
            list_bottleInstance.sort((a, b) => { return a.bin - b.bin})
            if (err) {return next(err)}
            res.render('bottleInstance_list', {title: 'Bottle Stock', bottleInstance_list: list_bottleInstance})
        })
        
      };


// Display detail page for a specific bottleInstance.
exports.bottleinstance_detail = (req, res) => {
    res.send('NOT IMPLEMENTED: bottleInstance detail: ' + req.params.id);
};

// Display bottleInstance create form on GET.
exports.bottleinstance_create_get = (req, res) => {
    async.parallel({
        producers: (cb) => {
            Producer.find(cb)
        },
        origins: (cb)=> {
            Origin.find(cb)
        },
        varieties: (cb) => {
            Variety.find(cb)
        },
    }, (err, results) => {
        
        res.render('bottle_instance_form', {title: "Add a New Bottle", data: results})

    })
};

// Handle bottleInstance create on POST.
exports.bottleinstance_create_post = (req, res) => {
    res.send('NOT IMPLEMENTED: bottleInstance create POST');
};

// Display bottleInstance delete form on GET.
exports.bottleinstance_delete_get = (req, res) => {
    res.send('NOT IMPLEMENTED: bottleInstance delete GET');
};

// Handle bottleInstance delete on POST.
exports.bottleinstance_delete_post = (req, res) => {
    res.send('NOT IMPLEMENTED: bottleInstance delete POST');
};

// Display bottleInstance update form on GET.
exports.bottleinstance_update_get = (req, res) => {
    res.send('NOT IMPLEMENTED: bottleInstance update GET');
};

// Handle bottleinstance update on POST.
exports.bottleinstance_update_post = (req, res) => {
    res.send('NOT IMPLEMENTED: bottleInstance update POST')
};