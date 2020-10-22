let Category = require("../models/category");
let BottleInstance = require("../models/bottleInstance");



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
        title: categoryName ,
        category_details: filteredList,
      });
    }
  );
};

