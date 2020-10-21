const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const VarietySchema = Schema(
    {
        varietyName: { type: String, required: true, maxlength: 80},
        
}
)

//virtual for variety URL

VarietySchema
    .virtual('url')
    .get( () => {
        return '/catalog/variety/' + varietyName;
})


module.exports = mongoose.model('Variety', VarietySchema)