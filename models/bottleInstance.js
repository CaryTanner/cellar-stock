const mongoose = require("mongoose");
let moment = require("moment");

const Schema = mongoose.Schema;

const BottleInstanceSchema = new Schema({
  producer: { type: Schema.Types.ObjectId, ref: "Producer", require: true },

  origin: { type: Schema.Types.ObjectId, ref: "Origin", require: true },
  village: { type: String },
  vineyard: { type: String },
  classification: { type: String },
  category: {
    type: String,
    required: true,
    enum: ["Red", "White", "Rose", "Orange", "Sweet", "Fortified", "Sparkling"],
  },
  variety: [{ type: Schema.Types.ObjectId, ref: "Variety" }],

  notes: { type: String },
  age: { type: Number, require: true },
  count: { type: Number, require: true },
  bin: { type: Number, require: true },
  status: {
    type: String,
    required: true,
    enum: ["Drink", "Hold", "Drink or Hold"],
    default: "Hold",
  },
});


BottleInstanceSchema.virtual("url").get(function () {
  return "/catalog/bottleinstance/" + this._id;
});

module.exports = mongoose.model("BottleInstance", BottleInstanceSchema);
