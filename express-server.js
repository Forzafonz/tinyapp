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

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
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

app.get("/u/:shortURL", (req, res) => {
  const longURL = getFromDatabase(req.params.shortURL);
  if (longURL) res.redirect(longURL);
});


app.post("/urls", (req, res) => {
  const shortString = generateRandomString();
  addToDatabase(shortString, req.body['longURL']);
  console.log(req.body);  // Log the POST request body to the console
  res.redirect(`/urls/${shortString}`);         // Respond with 'Ok' (we will replace this)
  console.log(urlDatabase);
});





app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});


