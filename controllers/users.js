require('dotenv').config();
const User = require('../models/User');

const passportJWT = require('passport-jwt');
const jwt = require('jsonwebtoken');

const ExtractJWT = passportJWT.ExtractJwt;
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = process.env.SECRET;

module.exports.controller = (app) => {
  app.post('/users/register', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const newUser = new User({
      name, email, password
    });
    User.createUser(newUser, (error, user) => {
      if (error) {
        res.status(422).json({message: 'Something went wrong. Please try again later!'});
      }
      res.send({ user });
    });
  });

  app.post('/users/login', (req, res) => {
    if (req.body.email && req.body.password) {
      const email = req.body.email;
      const password = req.body.password;
      User.getUserByEmail(email, (err, user) => {
        if (!user) {
          res.status(404).json({ message: 'The user does not exists! '});
        } else {
          User.comparePassword(password, user.password, (error, isMatch) => {
            if (error) throw (error);
            if (isMatch) {
              const payload = { id: user.id };
              const token = jwt.sign(payload, jwtOptions.secretOrKey);
              res.json({ message: 'ok', token });
            } else {
              res.status(401).json({ message: 'The password is incorrect!' });
            }
          });
        }
      })
    }
  });
};
