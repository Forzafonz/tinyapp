const express = require("express");
const app = express();
// const bodyParser = require("body-parser");
const PORT = 8080; // default port 8080
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

function generateRandomString() {
  const letters = 'abcdefghigklmnopqrstuvwxyzABCDEFGHIGKLMNOPQRSTUVWXYZ';
  let random = [];
  for (let i = 0; i < 6; i++) random.push(Math.floor(Math.random() * 53));
  let result = random.map(element => {
    return letters[element];
  });
  return result.join('');
}

function addToDatabase(shortUrl, longUrl) {
  urlDatabase[shortUrl] = longUrl;
}

function getFromDatabase(shortURL) {
  if (urlDatabase[shortURL] === 'undefined') {
    return false;
  }
  return urlDatabase[shortURL];
}

function removeFromDatabase(shortURL) {
  if (urlDatabase[shortURL] === 'undefined') {
    return false;
  }
  delete urlDatabase[shortURL];
}

app.get("/", (req, res) => {
  res.redirect('/urls/new');
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index.ejs', templateVars);
});

app.get("/urls/new", (req, res) =>{
  res.render('urls_new');
});

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
  console.log(req.body)
  let updateVal = req.params.shortID;
  if (getFromDatabase(updateVal)){
    addToDatabase(updateVal, req.body.longURL);
  }
  res.redirect("/urls");
})

app.post("/urls", (req, res) => {
  const shortString = generateRandomString();
  addToDatabase(shortString, req.body['longURL']);
  res.redirect(`/urls/${shortString}`);         // Respond with 'Ok' (we will replace this)
  console.log(urlDatabase);
});

//Route to edit existing shortURL - longURL pair
app.post("/urls/:shortURL", (req, res)=> {
  let toRemove = req.params.shortURL;
  removeFromDatabase(toRemove);
  res.redirect('/urls');
})

//Route to remove existing shortURL - longURL pair
app.post("/urls/:shortURL/delete", (req, res)=> {
  let toRemove = req.params.shortURL;
  removeFromDatabase(toRemove);
  res.redirect('/urls');
})

//Begin listening via PORT
app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});


