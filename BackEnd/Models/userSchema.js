const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
      id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  std: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  age: {
    type: Number,
    required: true,
    min: 5,
    max: 20
  },
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
    required: true
  },
  school_name: {
    type: String,
    required: true,
    trim: true
  }
});

module.exports = mongoose.model("users",userSchema);