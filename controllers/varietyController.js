let Variety = require("../models/variety");
let BottleInstance = require("../models/bottleInstance");
const { body, validationResult } = require("express-validator");

//Display list of all variety.
exports.varieties_list = function (req, res, next) {
  Variety.find({})
    .sort([["varietyName", "ascending"]])
    .exec((err, list_varieties) => {
      console.log(list_varieties);
      if (err) {
        return next(err);
      }
      //Successful, so render
      res.render("varieties_list", {
        title: "Varieties List",
        varieties_list: list_varieties,
      });
    });
};

// Display detail page for a specific variety.
exports.variety_detail = function (req, res, next) {
  let varietyNameParam = req.params.varietyname;
  console.log(varietyNameParam);
  BottleInstance.find({})
    .populate({ path: "bottle", path: "category" })
    .populate({
      path: "bottle",
      populate: {
        path: "producer",
      },
    })
    .populate({
      path: "bottle",
      populate: {
        path: "origin",
      },
    })
    .populate({
      path: "bottle",
      populate: {
        path: "variety",
      },
    })
    .exec((err, details_variety) => {
      if (err) {
        return next(err);
      }

      let filteredList = details_variety.filter(
        (x) => x.bottle.variety[0].varietyName === varietyNameParam
      );

      //Successful, so render
      res.render("variety_details", {
        title: `  ${varietyNameParam} Wines in Stock`,
        variety_details: filteredList,
        varietyNameParam
      });
    });
};

// Display variety create form on GET.
exports.variety_create_get = (req, res, next) => {
  res.render("variety_form", { title: "Register a Variety" });
};


// Handle variety create on POST.
exports.variety_create_post = [
  //check name and 'sanitise'
  body("varietyName", "Variety Name Required")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .matches(/^[a-z0-9 ]+$/i)
    .withMessage('May not contain non-alphanumeric characters'),

  //continue request cycle
  (req, res, next) => {
    const errors = validationResult(req);
    
    let variety = new Variety({
      varietyName: req.body.varietyName,
    });
    //if there are errors send them back to form
    if (!errors.isEmpty()) {
      res.render("variety_form", {
        title: "Register a Variety",
        varietyName: variety,
        errors: errors.array(),
      });
      return;
    } else {
      //form values valid
      // check DB for repeats
      Variety.findOne({ varietyName: new RegExp('^'+req.body.varietyName+'$', "i") }).exec(
        (err, found_variety) => {
          if (err) {
            return next(err);
          }
          if (found_variety) {
            //variety exists redirect to page
            res.redirect("/catalog/variety/" + found_variety.varietyName);
          } else {
            variety.save((err) => {
              if (err) {
                return next(err);
              }
              res.redirect("/catalog/variety/" + variety.varietyName);
            });
          }
        }
      );
    }
  },
];

// Display variety delete form on GET.
exports.variety_delete_get = function (req, res) {
  res.send("NOT IMPLEMENTED: variety delete GET");
};

// Handle variety delete on POST.
exports.variety_delete_post = function (req, res) {
  res.send("NOT IMPLEMENTED: variety delete POST");
};

// Display variety update form on GET.
exports.variety_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: variety update GET");
};

// Handle variety update on POST.
exports.variety_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: variety update POST");
};
