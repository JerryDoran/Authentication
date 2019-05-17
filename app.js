// This line of code will help keep API's, passwords, and other sensitive information private.
require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');

const app = express();

console.log(process.env.SECRET_KEY);

//MIDDLEWARE
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

//CONNECT TO MONGODB WITH MONGOOSE
mongoose.connect('mongodb://localhost:27017/userDB', { useNewUrlParser: true });

//SET UP MONGOOSE ENCRYPTION
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET_KEY,
  encryptedFields: ['password']
});

const User = new mongoose.model('User', userSchema);

// CREATE OUR ROUTES
app.get('/', (req, res) => {
  res.render('home');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/register', (req, res) => {
  res.render('register');
});

app.post('/register', (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password
  });

  // Mongoose will encrypt the password when saving it to the database on saving.
  newUser.save(err => {
    if (err) {
      console.log(err);
    } else {
      res.render('authenticate');
    }
  });
});

app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  // Mongoose will de-crypt the password on 'find' retrieving it from the database.
  User.findOne({ email: username }, (err, foundUser) => {
    if (err) {
      console.log(err);
    } else {
      if (foundUser) {
        if (foundUser.password === password) {
          res.render('authenticate');
        }
      }
    }
  });
});
PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on ${PORT}`));
