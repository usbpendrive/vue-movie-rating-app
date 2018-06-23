require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const serveStatic = require('serve-static');
const passportJWT = require('passport-jwt');
const ExtractJWT = passportJWT.ExtractJwt;
const JWTStrategy = passportJWT.Strategy;
const history = require('connect-history-api-fallback');
const jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('jwt');
jwtOptions.secretOrKey = process.env.SECRET;

const app = express();
const router = express.Router();


app.use(morgan('combined'));
app.use(express.json());
app.use(cors());
app.use(passport.initialize());

const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASSWORD;

mongoose.connect(`mongodb://${dbUser}:${dbPass}@${dbHost}/${dbName}`, function () {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('App starting error', err.stack);
    process.exit(1);
  });

fs.readdirSync("controllers").forEach(function (file) {
  if (file.substr(-3) === ".js") {
    const route = require('./controllers/' + file);
    route.controller(app);
  }
});

app.use(history());
app.use(serveStatic(__dirname + "/dist"));

router.get('/', function (req, res) {
  res.json({ message: 'Welcome to Movie Rating API' });
});

const port = process.env.PORT || 8081;
app.use('/', router);
app.listen(port, function () {
  console.log(`API running on port ${port}`);
});
