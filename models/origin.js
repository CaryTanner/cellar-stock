const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const OriginSchema = new Schema(
    {
        country: { type: String, required: true, maxlength: 150},
        region: { type: String, required: true, maxlength: 150},
        village: { type: String,  maxlength: 150},
        vineyard: { type: String,  maxlength: 150},
    }
);

//Virtual for full origin 

OriginSchema.virtual('origin').get(() => {

    let fullOrigin = ''
    if (this.region){
        fullOrigin + this.region
    }
    if (this.village){
        fullOrigin + this.village
    }
    if (this.vineyard){
        fullOrigin + this.vineyard
    }
    return fullOrigin
});

OriginSchema.virtual('url').get(()=>{
    return '/catalog/origin/' + this._id
})

module.exports = mongoose.model('Origin', OriginSchema)