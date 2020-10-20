const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const BottleSchema = new Schema(
    {
        producer: { type: Schema.Types.ObjectId, ref: 'Producer', require: true},
        
        origin: { type: Schema.Types.ObjectId, ref: 'Origin', require: true },
        classification: {type: String},
        category: {type: String, required: true, enum: ['Red', 'White', 'Rose', 'Orange', 'Sweet', 'Fortified', 'Sparkling']},
        variety: [{ type:Schema.Types.ObjectId, ref: 'Variety'}],
        price: {type: Number},
        rating: {type: Number},
        notes: {type: String}

    }
);

BottleSchema.virtual('url').get(()=>{
    return '/catalog/bottle/' + this._id;
})

module.exports = mongoose.model('Bottle', BottleSchema)