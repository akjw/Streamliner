const User = require("../models/user.model");
const Organization = require("../models/organization.model");
const bcrypt = require('bcrypt');


require("../config/db");
let db = [
  {
    firstname: "Helen",
    lastname: "Troy",
    email: "helen@email.com",
    password: "password",
    organization: "Trojan"
  },
  {
    firstname: "Perseph",
    lastname: "One",
    email: "percyn@email.com",
    password: "password",
    organization: "Umbra"
  },
];

db.forEach((ele, i) => {
  Organization.create({ name: ele.organization }).then((organization) => {
    let user = new User({ firstname: ele.firstname, lastname: ele.lastname, email: ele.email, organization: organization._id });
    bcrypt.hash(ele.password, 10)
    .then((codedPass) => {
        user.password = codedPass;
        User.create(user)
        .then((e) => {
          console.log(`${i} entry complete`);
        })
        .catch(() => {
          process.exit(1);
        });
    })
  });
});
