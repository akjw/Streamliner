const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true
    },
    lastname:  {
      type: String,
      required: true
    },
    email:  {
      type: String,
      required: true,
      unique: true
    },
    password:  {
      type: String,
      required: true,
      minlength: 6,
    },
    organization : { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Organization"
    },
  }, 
  {timestamps: true}
);

const User = mongoose.model('User', userSchema)

module.exports = User;