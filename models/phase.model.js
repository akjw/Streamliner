const mongoose = require('mongoose');

const phaseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    project: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Project"
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    deliverables: [ { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Deliverable"
    }]
  }, 
  {timestamps: true}
);

const Phase = mongoose.model('Phase', phaseSchema)

module.exports = Phase;