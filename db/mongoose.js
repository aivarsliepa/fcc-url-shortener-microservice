const mongoose = require("mongoose");
const { Schema } = mongoose;

mongoose.connect(process.env.MONGODB_URI);

const CounterSchema = new Schema({
  _id: {
    type: String,
    requireq: true
  },
  counter: {
    type: Number,
    default: 0
  }
});

const Counter = mongoose.model("counter", CounterSchema);

const UrlSchema = new Schema({
  original_url: String,
  urlId: Number
});

UrlSchema.pre("save", function(next) {
  const doc = this;
  Counter.findByIdAndUpdate("counter", {$inc: { counter: 1} }, {new: true, upsert: true})
    .then(counter => {
      doc.urlId = counter.counter;
      next();
    })
    .catch(error => console.error(error));
});

const Url = mongoose.model("url", UrlSchema);