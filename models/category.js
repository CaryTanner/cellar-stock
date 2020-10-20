const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const CategorySchema = new Schema({
    category: {type: String, required: true, enum: ['Red', 'White', 'Rose', 'Orange', 'Sweet', 'Fortified', 'Sparkling']}
});

CategorySchema.virtual('url').get(()=>{
    return '/catalog/category/' + this._id
})

module.exports = mongoose.model('Category', CategorySchema)