const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contentCreatorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  register_date: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Consumer", "Content Creator"],
    default: "Consumer",
  },
  kits: [{ type: Schema.Types.ObjectId, ref: "Kit" }],
});

const contentCreator = mongoose.model("contentCreator", contentCreatorSchema);

module.exports = contentCreator;
