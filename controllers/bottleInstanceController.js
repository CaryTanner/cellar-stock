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

/*   can't reselect dropdown/select inputs when data needs to be re-entered
*    recheck varieties from list of varieties??
*
* */


exports.bottleinstance_create_get = (req, res) => {
    async.parallel({
        producers: (cb) => {
            Producer.find(cb)
            .sort([["name", "ascending"]])
        },
        origins: (cb)=> {
            Origin.find(cb)
            .sort([["country", "ascending"]])
        },
        varieties: (cb) => {
            Variety.find(cb)
            .sort([["varietyName", "ascending"]])
        },
    }, (err, results) => {
        
        res.render('bottle_instance_form', {title: "Add a New Bottle", producers: results.producers, origins: results.origins, varieties: results.varieties})

    })
};

// Handle bottleInstance create on POST.
exports.bottleinstance_create_post = [
   
    // (req, res, next) => {
    //     if(!(req.body.varieties instanceof Array)){
    //         if(typeof req.body.varieties ==='undefined')
    //         req.body.varieties = [];
    //         else
    //         req.body.varieties = new Array(req.body.varieties);
    //     }
    //     console.log('log of variety ids' + req.body.varieties)
    //     next();
    // },
    
     // Validate and sanitise fields.
     
body('age', 'Age is required')
    .trim()
    .isLength({min:'4', max:'4'})
    .withMessage('Year must be 4 numbers - YYYY')
    .isNumeric()
    .withMessage('May only contain numbers')
    .escape(),

body("village")
    .trim()
    .escape()
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage("Village name has non-alphanumeric characters")
    .optional({ checkFalsy: true }),
  body("vineyard")
    .trim()
    .escape()
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage("Vineyard name has non-alphanumeric characters")
    .optional({ checkFalsy: true }),
body("classification")
    .trim()
    .escape()
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage("Classification has non-alphanumeric characters")
    .optional({ checkFalsy: true }),
body('notes')
    .trim()
    .escape(),

    (req, res, next) => {
        
        //collect errors
        const errors = validationResult(req)
        
        //create new bottleInstance with proper data
        let bottleInstance = new BottleInstance({
            producer: req.body.producer,
            origin: req.body.origin,
            village: req.body.village,
            vineyard: req.body.vineyard,
            classification: req.body.classification,
            category: req.body.category,
            variety: req.body.varieties,
            notes: req.body.notes,
            age: req.body.age,
            count: req.body.count,
            bin: req.body.bin,
            status: req.body.status ,
            notes: req.body.notes
        })
        console.log( 'this is the bottle instance' + bottleInstance)
        if(!errors.isEmpty()){
            async.parallel({
                producers: (cb) => {
                    Producer.find(cb)
                    .sort([["name", "ascending"]])
                },
                origins: (cb)=> {
                    Origin.find(cb)
                    .sort([["country", "ascending"]])
                },
                varieties: (cb) => {
                    Variety.find(cb)
                    .sort([["varietyName", "ascending"]])
                },
            }, (err, results) => {
                
                if(err){return next(err)}

                // // Mark our selected varieties as checked.
                // for (let i = 0; i < results.varieties.length; i++) {
                //     if (bottleInstance.variety.indexOf(results.varieties[i]._id) > -1) {
                //         return results.varieties[i].checked='true';
                //     }
                // }
                //     (console.log('results log' + results))
                
                res.render('bottle_instance_form', {title: "Add a New Bottle", producers: results.producers, origins: results.origins, varieties: results.varieties, data: req.body, errors: errors.array()})
        
            })
            return
        } else {
            bottleInstance.save((err)=> {
                if (err){return next(err)}
                res.redirect(bottleInstance.url)
            })
        }


    }
    
];

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