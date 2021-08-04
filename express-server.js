const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const PORT = 8080;

//Middleware set-up
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
// app.use(cookieParser);

const urlDatabase = {

  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"

};

const generateRandomString = function() {

  const letters = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
  let random = [];
  for (let i = 0; i < 6; i++) random.push(Math.floor(Math.random() * 53));
  let result = random.map(element => {
    return letters[element];
  });
  return result.join('');

};

//Function which is used to add/update longUrl in the database based on shortUrl
const addToDatabase = function(shortUrl, longUrl) {

  urlDatabase[shortUrl] = longUrl;

};

// Function returns longURL from the database based on shortURL
const getFromDatabase = function(shortURL) {

  if (urlDatabase[shortURL] === 'undefined') {
    return false;
  }
  return urlDatabase[shortURL];
};

// Function which removes longURL and shortURL pair from the database
const removeFromDatabase = function(shortURL) {

  if (urlDatabase[shortURL] === 'undefined') {
    return false;
  }
  delete urlDatabase[shortURL];
};

// A basic redirect for an empty resource request
app.get("/", (req, res) => {

  res.redirect('/urls/new');
});

//A get request to show a list of all shortURL and longURL in the "database"
app.get("/urls", (req, res) => {

  const templateVars = { urls: urlDatabase };
  res.render('urls_index.ejs', templateVars);
});

//A get request used to direct a client to a template which allows creation of new shortURL - longURL pair
app.get("/urls/new", (req, res) =>{

  res.render('urls_new');
});

//A get request which shows information about specified shortURL
app.get("/urls/:shortURL", (req, res) => {

  const templateVar = { 'shortURL': req.params.shortURL, 'longURL': urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVar);

});

// GET route to redirect a user to a website using a shortURL
app.get("/u/:shortURL", (req, res) => {

  const longURL = getFromDatabase(req.params.shortURL);
  if (longURL) res.redirect(longURL);

});

// POST route to update a longURL for a specified shortURL
app.post('/urls/:shortID', (req, res) => {
  let updateVal = req.params.shortID;

  if (getFromDatabase(updateVal)) {
    addToDatabase(updateVal, req.body.longURL);
  }
  res.redirect("/urls");

});

// A post route to generate and add a new shortURL - longURL pair to database
app.post("/urls", (req, res) => {

  const shortString = generateRandomString();
  addToDatabase(shortString, req.body['longURL']);
  res.redirect(`/urls/${shortString}`);

});

//Route to edit existing shortURL - longURL pair
app.post("/urls/:shortURL", (req, res)=> {

  let toRemove = req.params.shortURL;
  removeFromDatabase(toRemove);
  res.redirect('/urls');

});

//Route to remove existing shortURL - longURL pair
app.post("/urls/:shortURL/delete", (req, res)=> {

  let toRemove = req.params.shortURL;
  removeFromDatabase(toRemove);
  res.redirect('/urls');

});

// A post route to submit username to save cookies:
app.post('/login', (req, res) => {
  // console.log(req.cookies.uName)
  let username = req.body.uName;
  console.log(username)
  res.redirect('/urls');
})

//Begin listening via PORT
app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});


