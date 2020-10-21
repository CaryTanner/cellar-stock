let Category = require("../models/category");
let BottleInstance = require("../models/bottleInstance");

// Display list of all category.
exports.category_list = (req, res) => {
  res.send("NOT IMPLEMENTED: category list");
};

// Display detail page for a specific category.
exports.category_details = (req, res) => {
   
    let categoryName = 
    req.params.name.charAt(0).toUpperCase() + req.params.name.slice(1);
    
  BottleInstance.find({})
    .populate('producer')
    .populate('origin')
    .populate('variety')
    .exec(
        (err, details_category) => {
      
      if (err) {
        return next(err);
      }
      let filteredList = details_category.filter(instance => instance.category === categoryName);
      //Successful, so render
      res.render("category_details", {
        title: ` ${categoryName} Wines in Stock`,
        category_details: filteredList,
      });
    }
  );
};

// Display category create form on GET.
exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category create GET");
};

// Handle category create on POST.
exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category create POST");
};

// Display category delete form on GET.
exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category delete GET");
};

// Handle category delete on POST.
exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category delete POST");
};

// Display category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category update POST");
};
