const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    members: [{ 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "User"
    }],
    organization: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Organization"
    },
    createdBy: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "User"
    },
    phases: [{ 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "Phase"
    }],
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  }, 
  {timestamps: true}
);

const Project= mongoose.model('Project', projectSchema)

module.exports = Project;