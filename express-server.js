const express = require("express");
const cookieParser = require("cookie-parser");
const {users, urlDatabase} = require("./helpers/data");
const {PORT} = require("./helpers/constants");
const {generateRandomString, addToDatabase, getFromDatabase, removeFromDatabase, getUniqID, addUser, getUserID, extractID, userExists} = require('./helpers/functions');

//Express and its Middleware set-up

const app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());
app.use( express.static( "public" ) );

//======================================================================================================================================================================
//==============================================="GET" ROUTES FOR OPERATIONS WITH longURL and shortURL==================================================================
//======================================================================================================================================================================

// A GET route which redirects from an empty resource request
app.get("/", (req, res) => {

  const id = extractID(req.cookies);

  if (id) {

    res
    .status(200)
    .redirect('/urls')

  } else {

  res
  .status(401)
  .render('welcome', {message: "Please login or register in order to be able to see links"});

  }

});

//A GET route to show a list of all shortURL and longURL in the "database"
app.get("/urls", (req, res) => {

  const id = extractID(req.cookies)
  const templateVars = { urls: urlDatabase, 'userid': id, users};

  if (id) {

  res
  .status(200)
  .render('urls_index.ejs', templateVars);
  
  } else {

  res
  .status(401)
  .render('welcome', {message: "Please login or register in order to be able to see links"});
  
  }

});

//A GET route used to direct a client to a template which allows creation of new shortURL - longURL pair
app.get("/urls/new", (req, res) =>{

  const id = extractID(req.cookies)
  

  if (id === null) {

    res
    .status(401)
    .render('urls_registration-error', {error: "Error 403: You need to be logged to be able to create new short URLs!"});
    return;
  }

  const templateVar = { 'userid': id, users};
  res
  .status(200)
  .render('urls_new', templateVar);

});

//A GET route which shows information about specified shortURL
app.get("/urls/:shortURL", (req, res) => {

  const id = extractID(req.cookies)
  if (id) {

  const templateVar = { 'shortURL': req.params.shortURL, 'longURL': getFromDatabase({urlDatabase, shortURL: req.params.shortURL}), 'userid': id, users};
  res
  .status(200)
  .render("urls_show", templateVar);

  } else {

    res
    .status(401)
    .render('urls_registration-error', {error: "Error 403: You need to be logged to be able to see information about the link"});
    return;

  }

});

//A  GET route to redirect a user to a website using a shortURL
app.get("/u/:shortURL", (req, res) => {

  const longURL = getFromDatabase({urlDatabase, shortURL: req.params.shortURL});
  if (longURL) res.redirect(longURL);

});

//======================================================================================================================================================================
//==============================================="GET" ROUTES TO TAKE CARE OF COOKIES AND LOGING ACTIVITIES==============================================================
//======================================================================================================================================================================

// A GET route to show registration page:
app.get('/register', (req, res) => {

  res.status(200).render("urls_register");

});

// A GET route to show login page:
app.get('/login', (req, res) => {

  res.render("urls_login");

});

//======================================================================================================================================================================
// ================================================ "POST" ROUTES FOR MODIFYING longURL and shortURL======================================================================
//======================================================================================================================================================================

// POST route to update a longURL for a specified shortURL
app.post('/urls/:shortID', (req, res) => {

  let updateVal = req.params.shortID;
  const id = extractID(req.cookies)

  if (id) {
    // if the link specified by user to modify in the database, then we modify it and re-direct a user back to main page. Else we show them error-page
    if (getFromDatabase({urlDatabase, shortURL:updateVal})) {

      addToDatabase(urlDatabase, updateVal, req.body.longURL, id );

    } else {

      res
      .status(401)
      .render('urls_registration-error', {error: `Error 404: There is no such link in our database`});
      return;
    }

  res
  .status(200)
  .redirect("/urls");

  } else {

    res
     .status(401)
     .render('urls_registration-error', {error: `Error 401: You need to be logged to be able to update the shortID: ${updateVal}` });

  }

});

// A POST route to generate and add a new shortURL - longURL pair to database
app.post("/urls", (req, res) => {

  const id = extractID(req.cookies)

  if (id === null) {  

    res
    .status(403)
    .render('urls_registration-error', {error: `Error 401: You need to be logged to be able to generate newID!` });

 }  else {

    
    const shortString = generateRandomString();
    addToDatabase(urlDatabase, shortString, req.body.longURL, id);
    res
    .status(200)
    .redirect('/urls');
    
  }
});

// A POST route to edit existing shortURL - longURL pair
app.post("/urls/:shortURL", (req, res)=> {

  const id = extractID(req.cookies);
  let toEdit = req.params.shortURL;

  if (id === null) {  

    res
    .status(403)
    .render('urls_registration-error', {error: `Error 401: You need to be logged to be able to edit existing URL: ${toEdit}` });

 }  else {

    
    removeFromDatabase(urlDatabase, toEdit);
    res
    .status(200)
    .redirect('/urls');
  
 }   

});

// A POST route to remove existing shortURL - longURL pair
app.post("/urls/:shortURL/delete", (req, res)=> {

  const id = extractID(req.cookies);
  let toRemove = req.params.shortURL;

  if (id === null) {  

    res
    .status(403)
    .render('urls_registration-error', {error: `Error 401: You need to be logged in to be able to remove this URL: ${toRemove}`});

 }  else {

  
  removeFromDatabase(urlDatabase, toRemove);
  res
    .status(200)
    .redirect('/urls');

 }

});

//======================================================================================================================================================================
//==============================================="POST" ROUTES TO TAKE CARE OF COOKIES AND LOGING ACTIVITIES==============================================================
//======================================================================================================================================================================

// A POST route to submit username to save cookies:
app.post('/login', (req, res) => {

  const {email, password} = req.body;
  const userID = getUserID({data:users, email});
  
  if (email === "") {
    res
      .status(403)
      .render('urls_registration-error', {error: "Error 403: E-mail cannot be blank please try again!"});
      return;
  }
  
  if (userID !== null) {

    if (users[userID]['password'] !== password) {
      res
      .status(403)
      .render('urls_registration-error', {error: "Error 403: The username and password you entered did not match our records. Please double-check and try again!"});
      return;
    }

  res
    .cookie('userid', userID)
    .redirect('/urls');

  } else {
    res
      .status(403)
      .render('urls_registration-error', {error: "Error 403: Unfortunately there is no user with this email address!"});
      return;
  }

});

// A POST route to logout and clear cookies:
app.post('/logout', (req, res) => {

  res
    .clearCookie('userid')
    .redirect('/');

});

// A POST route for registration:
app.post('/register', (req, res)=> {

  const {email, password} = req.body;
  if (email === '' || password === '') {
    res
      .status(400)
      .render('urls_registration-error', {error: "Error 400: Email or Password field cannot be empty!"});
    return;
  } else if (userExists({email, users}) === true) {
    res
    .status(400)
    .render('urls_registration-error', {error: "Error 400: User with this email already exists!"});
  }

  const id = getUniqID(users);
  if (addUser({data:users, email, password, id}) !==  null) {
    res.redirect(307, '/login');
  }
  
});

//======================================================================================================================================================================
//=====================================================================Listening Server=================================================================================
//======================================================================================================================================================================

//Begin listening via PORT
app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});


