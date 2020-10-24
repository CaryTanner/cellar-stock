const Origin = require("../models/origin");
const { body, validationResult } = require("express-validator");
const BottleInstance = require("../models/bottleInstance");
const async = require("async");

// Display list of all origin.
exports.origin_list = (req, res) => {
  Origin.find({}, " country region village vineyard")

    .sort([["country", "ascending"]])
    .sort([["region", "ascending"]])
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
        Origin.findById(req.params.id).exec(cb);
      },
      origin_bottleInstances: (cb) => {
        BottleInstance.find({ origin: req.params.id }, cb)
          .populate("producer")
          .populate("origin")
          .populate("variety");
      },
    },
    (err, results) => {
      if (err) {
        return err;
      }
      if (results.origin == null) {
        // No results.
        var err = new Error("Origin not found");
        err.status = 404;
        return next(err);
      }
      res.render("origin_detail", { title: "Origin Detail", data: results });
    }
  );
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

    .withMessage("Country name must be specified"),

  body("region")
    .trim()

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
      //form values valid
      // check DB for repeats
      Origin.findOne({
        region: new RegExp("^" + req.body.region + "$", "i"),
      }).exec((err, found_region) => {
        console.log(found_region)
        if (err) {
          return next(err);
        }
        if (found_region) {
          //region exists redirect to page
          res.redirect("/catalog/origin/" + found_region._id);
        } else {
          origin.save((err) => {
            if (err) {
              return next(err);
            }
            res.redirect("/catalog/origin/" + origin._id);
          });
        }
      });
    }
  },
];

// Display origin delete form on GET.
exports.origin_delete_get = (req, res, next) => {
  async.parallel(
    {
      origin: (cb) => {
        Origin.findById(req.params.id).exec(cb);
      },
      origin_bottleInstances: (cb) => {
        BottleInstance.find({ origin: req.params.id })
          .populate("producer")
          .populate("origin")
          .populate("variety")
          .exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return err;
      }
      if (results.origin === null) {
        res.redirect("/catalog/origins");
      }
      res.render("origin_delete", {
        title: "Delete Origin",
        origin: results.origin,
        origin_bottleInstances: results.origin_bottleInstances,
      });
    }
  );
};

// Handle origin delete on POST.
exports.origin_delete_post = (req, res, next) => {
  async.parallel(
    {
      origin: (cb) => {
        Origin.findById(req.params.id).exec(cb);
      },
      origin_bottleInstances: (cb) => {
        BottleInstance.find({ origin: req.params.id })
          .populate("producer")
          .populate("origin")
          .populate("variety")
          .exec(cb);
      },
    },
    (err, results) => {
      if (err) {
        return err;
      }
      if (results.origin_bottleInstances.length > 0) {
        res.render("origin_delete", {
          title: "Delete Origin",
          origin: results.origin,
          origin_bottleInstances: results.origin_bottleInstances,
        });
      } else {
        Origin.findByIdAndRemove(req.body.originid, function deleteOrigin(err) {
          if (err) {
            return next(err);
          }
          res.redirect("/catalog/origins");
        });
      }
    }
  );
};
// Display origin update form on GET.
exports.origin_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: origin update GET");
};

// Handle origin update on POST.
exports.origin_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: origin update POST");
};
