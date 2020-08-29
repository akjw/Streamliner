//==== require all dependencies 
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()



//==== add all middleware
require('./config/db'); //calls mongoose connection; reduces clutter in this file
app.use(express.json()); //allows you to receive JSON files from HEADER of REQUEST
// app.use(morgan(':id :method :url :response-time'))
app.use(cors()); //allows all requests from outside servers or apps



//=== setup routes
// app.use('/api/items', require('./routes/item.route'));
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/projects', require('./routes/project.route'));

//==== 404 errors
app.get('*', (req, res) => {
  res.status(404).json({ message: "404: Not Found" , code: 'EB404'})
})

//=== setup server part
app.listen(process.env.PORT, () => console.log(`running on ${process.env.PORT}`));