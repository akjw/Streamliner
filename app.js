//==== require all dependencies 
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const path = require("path")



//==== add all middleware
app.use(express.static(path.join(__dirname, "client", "build")))
require('./config/db'); //calls mongoose connection; reduces clutter in this file
app.use(express.json()); //allows you to receive JSON files from HEADER of REQUEST
app.use(cors()); //allows all requests from outside servers or apps



//=== setup routes
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/projects', require('./routes/project.route'));
app.use('/api/organizations', require('./routes/organization.route'));
app.use('/api/users', require('./routes/user.route'));
app.use('/api/phases', require('./routes/phase.route'));
app.use('/api/deliverables', require('./routes/deliverable.route'));

//==== 404 errors
app.get('*', (req, res) => {
  res.status(404).json({ message: "404: Not Found" , code: 'EB404'})
})

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});
//=== setup server part
app.listen(process.env.PORT, () => console.log(`running on ${process.env.PORT}`));