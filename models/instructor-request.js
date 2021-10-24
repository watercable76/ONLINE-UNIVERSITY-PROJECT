const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const instructorRequestSchema = new Schema({
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userPurpose: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("InstructorRequest", instructorRequestSchema);
