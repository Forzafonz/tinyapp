const express = require("express");
const cookieParser = require("cookie-parser");
const {users, urlDatabase} = require("./helpers/data");
const {PORT} = require("./helpers/constants");
const {generateRandomString, addToDatabase, getFromDatabase, removeFromDatabase, getUniqID, addUser, getUserID} = require('./helpers/functions');

//Express and its Middleware set-up

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

//======================================================================================================================================================================
//==============================================="GET" ROUTES FOR OPERATIONS WITH longURL and shortURL==================================================================
//======================================================================================================================================================================

// A GET route which redirects from an empty resource request
app.get("/", (req, res) => {

  res.redirect('/urls/new');

});

//A GET route to show a list of all shortURL and longURL in the "database"
app.get("/urls", (req, res) => {

  const templateVars = { urls: urlDatabase, 'username': JSON.parse(JSON.stringify(req.cookies))};
  res.render('urls_index.ejs', templateVars);

});

//A GET route used to direct a client to a template which allows creation of new shortURL - longURL pair
app.get("/urls/new", (req, res) =>{

  const templateVar = { 'username': JSON.parse(JSON.stringify(req.cookies))};
  res.render('urls_new', templateVar);

});

//A GET route which shows information about specified shortURL
app.get("/urls/:shortURL", (req, res) => {

  const templateVar = { 'shortURL': req.params.shortURL, 'longURL': urlDatabase[req.params.shortURL], 'username': JSON.parse(JSON.stringify(req.cookies))};
  res.render("urls_show", templateVar);

});

//A  GET route to redirect a user to a website using a shortURL
app.get("/u/:shortURL", (req, res) => {

  const longURL = getFromDatabase(urlDatabase, req.params.shortURL);
  if (longURL) res.redirect(longURL);

});

//======================================================================================================================================================================
//==============================================="GET" ROUTES TO TAKE CARE OF COOKIES AND LOGING ACTIVITIES==============================================================
//======================================================================================================================================================================

// A GET route to show registration page
app.get('/register', (req, res) => {

  res.render("urls_register");

});

//======================================================================================================================================================================
// ================================================ "POST" ROUTES FOR MODIFYING longURL and shortURL======================================================================
//======================================================================================================================================================================

// POST route to update a longURL for a specified shortURL
app.post('/urls/:shortID', (req, res) => {

  let updateVal = req.params.shortID;

  if (getFromDatabase(urlDatabase, updateVal)) {
    addToDatabase(urlDatabase, updateVal, req.body.longURL);
  }
  res.redirect("/urls");

});

// A POST route to generate and add a new shortURL - longURL pair to database
app.post("/urls", (req, res) => {

  const shortString = generateRandomString();
  addToDatabase(urlDatabase, shortString, req.body['longURL']);
  res.redirect('/urls');

});

//A POST route to edit existing shortURL - longURL pair
app.post("/urls/:shortURL", (req, res)=> {

  let toRemove = req.params.shortURL;
  removeFromDatabase(urlDatabase, toRemove);
  res.redirect('/urls');

});

//A POST route to remove existing shortURL - longURL pair
app.post("/urls/:shortURL/delete", (req, res)=> {

  let toRemove = req.params.shortURL;
  removeFromDatabase(urlDatabase, toRemove);
  res.redirect('/urls');

});

//======================================================================================================================================================================
//==============================================="POST" ROUTES TO TAKE CARE OF COOKIES AND LOGING ACTIVITIES==============================================================
//======================================================================================================================================================================

// A POST route to submit username to save cookies:
app.post('/login', (req, res) => {

  const userEmail = req.body.email;
  const userID = getUserID({users, userEmail});

  res
    .cookie('userid', userID)
    .redirect('/urls');

});

// A POST route to logout and clear cookies:
app.post('/logout', (req, res) => {

  res
    .clearCookie('username')
    .redirect('/urls');

});

//A POST route for registration:
app.post('/register', (req, res)=> {

  const {email, password} = req.body;
  const id = getUniqID(users);
  if (addUser({data:users, email, password, id}) !==  null) {
    console.log(users);
    res.redirect('/urls');
  }
  
});

//======================================================================================================================================================================
//=====================================================================Listening Server=================================================================================
//======================================================================================================================================================================

//Begin listening via PORT
app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});


