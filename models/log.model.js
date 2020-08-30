const mongoose = require('mongoose');

const logSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    deliverable: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Deliverable"
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "User"
    },
  }, 
  {timestamps: true}
);

const Log = mongoose.model('Log', logSchema)

module.exports = Log;