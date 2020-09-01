const mongoose = require('mongoose');

const deliverableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    project: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Project"
    },
    phase: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Phase"
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "User"
    },
    isComplete: {
      type: Boolean,
      default: false,
    },
    deadline: {
      type: Date,
      required: true,
    },
    logs: [ { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Log"
    }]
  }, 
  {timestamps: true}
);

const Deliverable = mongoose.model('Deliverable', deliverableSchema)

module.exports = Deliverable;