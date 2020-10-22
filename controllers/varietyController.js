let Variety = require("../models/variety");
let BottleInstance = require("../models/bottleInstance");
const { body, validationResult } = require("express-validator");
const async = require("async");

//Display list of all variety.
exports.varieties_list = function (req, res, next) {
  Variety.find({})
    .sort([["varietyName", "ascending"]])
    .exec((err, list_varieties) => {
      
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
exports.variety_detail = (req, res, next) => {
    async.parallel(
        {
            variety: (cb) => {
            Variety.find({varietyName: req.params.varietyname})
            .exec(cb);
            },
            variety_bottleInstances: (cb) => {
            BottleInstance.find({})
            .populate("producer")
            .populate("origin")
            .populate("variety")
            .exec(cb);
            },
        }, (err, results) => {
            if (err) {return next(err)}
            /*
* account for bottle with multiple grapes?? 
*
* */
            let filteredList = results.variety_bottleInstances.filter( bottle => bottle.variety[0].varietyName == req.params.varietyname)
      
    console.log(results.variety)
          //Successful, so render
          res.render("variety_details", {
            title:  req.params.varietyname,
            variety_details: filteredList,
            varietyName: req.params.varietyname,
            variety: results.variety[0]
            
          });
        });
        }
      

    


// Display variety create form on GET.
exports.variety_create_get = (req, res, next) => {
  res.render("variety_form", { title: "Register a Variety" });
};


// Handle variety create on POST.
exports.variety_create_post = [
  //check name and 'sanitise'
  body("varietyName", "Variety Name Required")
    .trim()
    .isLength({ min: 3 }),

  //continue request cycle
  (req, res, next) => {
    const errors = validationResult(req);
    console.log(req.body.varietyName)
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
exports.variety_delete_get = (req, res, next) => {
    async.parallel(
      {
        variety: (cb) => {
          Variety.findById(req.params.id).exec(cb);
        },
        variety_bottleInstances: (cb) => {
          BottleInstance.find({ variety: req.params.id })
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
        if (results.variety === null) {
          res.redirect("/catalog/varieties");
        }
        res.render("variety_delete", {
          title: "Delete Variety",
          variety: results.variety,
          variety_bottleInstances: results.variety_bottleInstances,
        });
      }
    );
  };

// Handle variety delete on POST.
exports.variety_delete_post = (req, res, next) => {
    async.parallel(
      {
        variety: (cb) => {
          Variety.findById(req.params.id).exec(cb);
        },
        variety_bottleInstances: (cb) => {
          BottleInstance.find({ variety: req.params.id })
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
        if (results.variety_bottleInstances.length > 0) {
            res.render("variety_delete", {
                title: "Delete Variety",
                variety: results.variety,
                variety_bottleInstances: results.variety_bottleInstances,
              });
              return
        } else {
            Variety.findByIdAndRemove(req.params.id, function deleteVariety(err){
                if (err) {return next(err)}
                res.redirect('/catalog/varieties')
            })
        }
        
        });
      }
  




// Display variety update form on GET.
exports.variety_update_get = function (req, res) {
  res.send("NOT IMPLEMENTED: variety update GET");
};

// Handle variety update on POST.
exports.variety_update_post = function (req, res) {
  res.send("NOT IMPLEMENTED: variety update POST");
};
