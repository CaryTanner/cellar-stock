const Producer = require("../models/producer");
const BottleInstance = require('../models/bottleInstance');
const { body, validationResult } = require("express-validator");
const async = require("async");

//display list of producers
exports.producer_list = (req, res, next) => {
  Producer.find()

    .sort([["name", "ascending"]])
    .exec((err, list_producers) => {
      if (err) {
        return next(err);
      }

      res.render("producer_list", {
        title: "Producer List",
        producer_list: list_producers,
      });
    });
};

// Display detail page for a specific producer.
exports.producer_detail = (req, res, next) => {
    async.parallel(
        {
          producer: (cb) => {
            Producer.findById(req.params.id)
            .exec(cb)
            
          },
          producer_bottleInstances: (cb) => {
            BottleInstance.find({ producer: req.params.id }).exec(cb);
          },
        },
        (err, results) => {
            console.log(results)
          if (err) {
            return err;}
        if (results.producer==null) { // No results.
                var err = new Error('Producer not found');
                err.status = 404;
                return next(err);
            } 
            res.render('producer_detail', {title: 'Producer Detail', data: results})
        })
};

// Display producer create form on GET.
exports.producer_create_get = (req, res, next) => {
  res.render("producer_form", { title: "Register a Producer" });
};

// Handle producer create on POST.
exports.producer_create_post = [
  // Validate and sanitise fields.
  body("name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Producer name must be specified")
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage("Producer name has non-alphanumeric characters."),
  body("region")
    .trim()
    .isLength({ min: 4 })
    .escape()
    .withMessage("Region must be 4 characters or longer")
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage("Region name has non-alphanumeric characters")
    .optional({ checkFalsy: true }),

  (req, res, next) => {
    const errors = validationResult(req);
    let producer = new Producer({
      name: req.body.name,
      region: req.body.region,
    });

    if (!errors.isEmpty()) {
      res.render("producer_form", {
        title: "Register a Producer",
        errors: errors.array(),
        name: req.body.name,
        region: req.body.region,
      });
      return;
    } else {
      // check DB for repeats
      Producer.findOne({
        name: new RegExp("^" + req.body.name + "$", "i"),
      }).exec((err, found_producer) => {
        if (err) {
          return next(err);
        }
        if (found_producer) {
          //producer exists redirect to page
          res.redirect(found_producer.url);
        } else {
          producer.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect('/catalog/producer/' + producer._id );
          });
        }
      });
    }
  },
];

// Display producer delete form on GET.
exports.producer_delete_get = (req, res, next) => {
  async.parallel(
    {
      producer: (cb) => {
        Producer.findById(req.params.id).exec(cb);
      },
      producer_bottleInstances: (cb) => {
        BottleInstance.find({ producer: req.params.id }).exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return err;
      }
      if (results.producer === null) {
        res.redirect("/catalog/producers");
      }
      res.render("producer_delete", {
        title: "Delete Producer",
        producer: results.producer,
        producer_bottleInstances: results.producer_bottleInstances,
      });
    }
  );
};

// Handle producer delete on POST.
exports.producer_delete_post = (req, res, next) => {
    async.parallel(
      {
        producer: (cb) => {
          Producer.findById(req.body.producerid).exec(cb);
        },
        producer_bottleInstances: (cb) => {
          BottleInstance.find({ producer: req.body.producerid }).exec(cb);
        },
      },
      (err, results) => {
        if (err) {
          return err;
        } 
        if(results.producer_bottleInstances.length > 0){
            res.render("producer_delete", {
                title: "Delete Producer",
                producer: results.producer,
                producer_bottleInstances: results.producer_bottleInstances,
              });
              return
        } else {
            Producer.findByIdAndRemove(req.body.producerid, function deleteProducer(err){
                if (err) {return next(err)}
                res.redirect('/catalog/producers')
            })
         }
    })
};

// Display producer update form on GET.
exports.producer_update_get = (req, res) => {
  res.send("Not ready: producer update GET");
};

// Handle producer update on POST.
exports.producer_update_post = (req, res) => {
  res.send("Not ready: producer update POST");
};
