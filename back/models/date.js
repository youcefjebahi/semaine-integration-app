const mongoose = require("mongoose");

const dateSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
});

const Date = mongoose.model("Date", dateSchema);

module.exports = Date;
