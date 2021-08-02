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

app.get("/", (req, res) => {
  res.render('index');
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render('urls_index.ejs', templateVars);
});

app.get("/hello", (req, res) => {
  const test1 = {fruits: ['peach', 'pear', 'apple']};
  res.render('about', test1);
});

app.get("/urls/new", (req, res) =>{
  res.render('urls_new');
});

app.get("/urls/:shortURL", (req, res) => {

  const templateVar = { 'shortURL': req.params.shortURL, 'longURL': urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVar);

});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
