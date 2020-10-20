const Bottle = require("../models/bottle");

const Producer = require("../models/producer");
const Origin = require("../models/origin");
const BottleInstance = require("../models/bottleInstance");
const Variety = require("../models/variety");
const Category = require("../models/category");

const async = require("async");
const { body, validationResult } = require("express-validator");

// exports.index = (req, res) => {
//   async.parallel(
//     {
//       bottle_count: (cb) => {
//         Bottle.countDocuments({}, cb);
//       },
//       bottle_instance_count: (cb) => {
//         BottleInstance.countDocuments({}, cb);
//       },
//       bottle_instance_count_total: (cb) => {
//         BottleInstance.find({}, cb).exec();
//       },
//       bottle_instance_drink_count: (cb) => {
//         let drinkers = BottleInstance.countDocuments({ status: "Drink" }, cb);
//       },
//       bottle_instance_drinkorhold_count: (cb) => {
//         BottleInstance.countDocuments({ status: "Drink or Hold" }, cb);
//       },
//       producer_count: (cb) => {
//         Producer.countDocuments({}, cb);
//       },
//       varieties_count: (cb) => {
//         Variety.countDocuments({}, cb);
//       },
//       origins_count: (cb) => {
//         Origin.countDocuments({}, cb);
//       },
//     },
//     (err, results) => {
//       //get total number of bottles in cellar adding counts from every instance
//       let totalBottles = results.bottle_instance_count_total
//         .map((res) => res.count)
//         .reduce((acc, current) => {
//           return acc + current;
//         }, 0);
//       res.render("index", {
//         title: "Cellar Stock ",
//         subtitle: "Wine Cellar Tracker",
//         bottlesTotal: totalBottles,
//         error: err,
//         data: results,
//       });
//     }
//   );
// };

// Display list of all bottles.
exports.bottle_list = (req, res, next) => {
  Bottle.find({}, "producer origin classification category variety")
    .populate("producer")
    .populate("origin")
    .populate("variety")
    .exec((err, list_bottles) => {
      console.log(list_bottles.map((x) => x.variety.varietyName));
      if (err) {
        return next(err);
      }
      res.render("bottle_list", {
        title: "Registered Bottles",
        bottle_list: list_bottles,
      });
    });
};

// Display detail page for a specific bottle.
exports.bottle_detail = (req, res) => {
  res.send("NOT IMPLEMENTED: Bottle detail: " + req.params.id);
};

// Display bottle create form on GET.
exports.bottle_create_get = (req, res, next) => {
  async.parallel(
    {
      producers: (cb) => {
        Producer.find(cb);
      },
      origins: (cb) => {
        Origin.find(cb);
      },
      varities: (cb) => {
        Variety.find(cb);
      },
    },
    (err, results) => {
        if (err) { return next(err); }
      res.render("bottle_form", {
        titel: "Create a New Bottle",
        producers: results.producers,
        origins: results.origins,
        varieties: results.varieties,
      });
    }
  );
};

// Handle bottle create on POST.
exports.bottle_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Bottle create POST");
};

// Display bottle delete form on GET.
exports.bottle_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Bottle delete GET");
};

// Handle bottle delete on POST.
exports.bottle_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Bottle delete POST");
};

// Display bottle update form on GET.
exports.bottle_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Bottle update GET");
};

// Handle bottle update on POST.
exports.bottle_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Bottle update POST");
};
