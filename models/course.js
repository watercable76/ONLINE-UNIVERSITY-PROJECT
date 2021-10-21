const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  maxStudents: {
    type: Number,
    required: true,
  },
  registeredStudents: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  instructorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Course", courseSchema);
