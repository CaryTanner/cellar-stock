const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ProducerSchema = Schema(
    {
        name: { type: String, required:true, maxlength: 150},
        region: { type: String, maxlength: 150}
        
}
)

//virtual for producer's URL

ProducerSchema
    .virtual('url')
    .get( () => {
        return (this._id);
})


module.exports = mongoose.model('Producer', ProducerSchema)