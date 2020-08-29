const mongoose = require('mongoose');

const organizationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    excoMembers: [{ 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "User"
    }],
    owner: { 
      type: mongoose.Schema.Types.ObjectId,  
      ref: "User"
    }
  }, 
  {timestamps: true}
);

const Organization = mongoose.model('Organization', organizationSchema)

module.exports = Organization;