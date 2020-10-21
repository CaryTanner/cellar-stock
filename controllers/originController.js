const Origin = require("../models/origin");
const { body, validationResult } = require("express-validator");
const BottleInstance = require('../models/bottleInstance');
const async = require("async");
// Display list of all origin.
exports.origin_list = (req, res) => {
  Origin.find({}, " country region village vineyard")

    .sort([["country", "ascending"]])
    .exec((err, list_origins) => {
      if (err) {
        return next(err);
      }

      res.render("origin_list", {
        title: "Origin List",
        origin_list: list_origins,
      });
    });
};

// Display detail page for a specific origin.
exports.origin_detail = (req, res, next) => {
    async.parallel(
        {
          origin: (cb) => {
            Origin.findById(req.params.id)
            .exec(cb)
            
          },
          origin_bottleInstances: (cb) => {
            BottleInstance.find({ origin: req.params.id }).exec(cb);
          },
        },
        (err, results) => {
            console.log(results)
          if (err) {
            return err;}
        if (results.origin==null) { // No results.
                var err = new Error('Origin not found');
                err.status = 404;
                return next(err);
            } 
            res.render('origin_detail', {title: 'Origin Detail', data: results})
        })
};

// Display origin create form on GET.
exports.origin_create_get = (req, res, next) => {
  res.render("origin_form", { title: "Create a New Origin" });
};

// Handle origin create on POST.
exports.origin_create_post = [
  // Validate and sanitise fields.
  body("country")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Country name must be specified")
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage("Country name has non-alphanumeric characters."),
  body("region")
    .trim()
    .escape()
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage("Region name has non-alphanumeric characters")
    .optional({ checkFalsy: true }),
  

  (req, res, next) => {
    const errors = validationResult(req);
    let origin = new Origin({
      country: req.body.country,
      region: req.body.region,
      
    });

    if (!errors.isEmpty()) {
      res.render("origin_form", {
        title: "Create a New Origin",
        errors: errors.array(),
        country: req.body.country,
        region: req.body.region,
       
      });
      return;
    } else {
          origin.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect('/catalog/origin/' + origin._id );
          });
        }
    }
      
   
];

// Display origin delete form on GET.
exports.origin_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: origin delete GET");
};

// Handle origin delete on POST.
exports.origin_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: origin delete POST");
};

// Display origin update form on GET.
exports.origin_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: origin update GET");
};

// Handle origin update on POST.
exports.origin_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: origin update POST");
};
