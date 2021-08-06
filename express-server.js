const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const {users, urlDatabase} = require("./helpers/data");
const {PORT} = require("./helpers/constants");
const {generateRandomString, addToDatabase, getFromDatabase, removeFromDatabase, getUniqID, addUser, getUserID, extractID, userExists, urlsForUser, hushPasswords} = require('./helpers/functions');


//Express and its Middleware set-up

const app = express();
hushPasswords(users); // <= needed to hashify unhashed passwords of users that already exist in improvised database
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']}));
app.use(express.static("public"));

//======================================================================================================================================================================
//==============================================="GET" ROUTES FOR OPERATIONS WITH longURL and shortURL==================================================================
//======================================================================================================================================================================

// A GET route which redirects from an empty resource request
app.get("/", (req, res) => {

  const id = extractID(req.session);
  // Check if user is logged in and if not return 401 error
  if (id) {

    res
      .status(200)
      .redirect('/urls');

  } else {

    res
      .status(401)
      .render('welcome', {message: "Please login or register in order to be able to see links"});

  }

});

//A GET route to show a list of all shortURL and longURL in the "database"
app.get("/urls", (req, res) => {
  
  const id = extractID(req.session);
  const urlDatabaseFiltered = urlsForUser({data:urlDatabase, userID: id});
  const templateVars = { urls: urlDatabaseFiltered, 'userid': id, users};
  // Check if user is logged in and if not return 401 error
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

  const id = extractID(req.session);
  
  // Check if user is logged in and if not return 403 error
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

  const id = extractID(req.session);
  const urlDatabaseFiltered = urlsForUser({data:urlDatabase, userID: id});
  //Check if the link which a user tries to edit was created by them. If not - return 403 status and redirct to permission denied template
  if (urlDatabase[req.params.shortURL]['userID'] !== id) {

    res
      .status(403)
      .render('urls_prohibited', {error: "Error 403: You don't have permissions to modify this link"});
    return;
  }
  //Check if user is logged
  if (id) {

    const templateVar = { 'shortURL': req.params.shortURL, 'longURL': getFromDatabase({'urlDatabase':urlDatabaseFiltered, shortURL: req.params.shortURL}), 'userid': id, users};
    res
      .status(200)
      .render("urls_show", templateVar);

  } else {

    res
      .status(401)
      .render('urls_registration-error', {error: "Error 401: You need to be logged to be able to see information about the link"});
    return;

  }

});

//A GET route to redirect a user to a website using a shortURL
app.get("/u/:shortURL", (req, res) => {

 
  const longURL = getFromDatabase({urlDatabase, shortURL: req.params.shortURL});
  //Check if requested shortURL is in database. If not - show an error message and return status 404.
  if (longURL) {
    res
      .status(200)
      .redirect(longURL);
  } else {

    res
      .status(404)
      .render('urls_registration-error', {error: "Error 404: No such shortURL in our database."});
  }

});

//======================================================================================================================================================================
//==============================================="GET" ROUTES TO TAKE CARE OF COOKIES AND LOGING ACTIVITIES==============================================================
//======================================================================================================================================================================

// A GET route to show registration page:
app.get('/register', (req, res) => {

  res
    .status(200)
    .render("urls_register");

});

// A GET route to show login page:
app.get('/login', (req, res) => {

  res
    .status(200)
    .render("urls_login");

});

//======================================================================================================================================================================
// ================================================ "POST" ROUTES FOR MODIFYING longURL and shortURL======================================================================
//======================================================================================================================================================================

// POST route to update a longURL for a specified shortURL
app.post('/urls/:shortID', (req, res) => {

  let updateVal = req.params.shortID;
  const id = extractID(req.session);
  const urlDatabaseFiltered = urlsForUser({data:urlDatabase, userID: id});
  // Check if the current user have permissions to modify this link, if not - show an error.
  if (urlDatabase[updateVal]['userID'] !== id) {

    res
      .status(403)
      .render('urls_prohibited', {error: "Error 403: You don't have permissions to modify this link"});
    return;

  }

  if (id) {
    // if the link specified by user to modify is in the database, then we modify it and re-direct a user back to main page. Else we show them error-page
    if (getFromDatabase({'urlDatabase':urlDatabaseFiltered, shortURL:updateVal})) {

      addToDatabase(urlDatabase, updateVal, req.body.longURL, id);

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
    // This check is implemented to prohibit curl POST requests;
    res
      .status(401)
      .render('urls_registration-error', {error: `Error 401: You need to be logged to be able to update the shortID: ${updateVal}` });

  }

});

// A POST route to generate and add a new shortURL - longURL pair to database
app.post("/urls", (req, res) => {

  const id = extractID(req.session);
  // Check if user is logged in before proceeding
  if (id === null) {

    res
      .status(401)
      .render('urls_registration-error', {error: `Error 401: You need to be logged to be able to generate newID!` });

  }  else {

    
    const shortString = generateRandomString();
    addToDatabase(urlDatabase, shortString, req.body.longURL, id);
    res
      .status(201)
      .redirect('/urls');
    
  }
});

// A POST route to edit existing shortURL - longURL pair
app.post("/urls/:shortURL", (req, res)=> {

  const id = extractID(req.session);
  let toEdit = req.params.shortURL;
  const urlDatabaseFiltered = urlsForUser({data:urlDatabase, userID: id});
  // Check if user have permissions to modify a link
  if (urlDatabase[toEdit]['userID'] !== id) {

    res
      .status(403)
      .render('urls_prohibited', {error: "Error 403: You don't have permissions to edit this link"});
    return;

  }

  if (id === null) {

    res
      .status(401)
      .render('urls_registration-error', {error: `Error 401: You need to be logged to be able to edit existing URL: ${toEdit}` });

  }  else {

    
    removeFromDatabase(urlDatabaseFiltered, toEdit);
    res
      .status(200)
      .redirect('/urls');
  
  }

});

// A POST route to remove existing shortURL - longURL pair
app.post("/urls/:shortURL/delete", (req, res)=> {

  const id = extractID(req.session);
  let toRemove = req.params.shortURL;
  // Check if user have permissions to modify the link
  if (urlDatabase[toRemove]['userID'] !== id) {

    res
      .status(403)
      .render('urls_prohibited', {error: "Error 403: You don't have permissions to remove this link"});
    return;

  }
  // Check if user is logged
  if (id === null) {

    res
      .status(401)
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
  // Check is there was any value enteres in email field as our application uses e-mail to retrive the rest of information from user
  if (email === "") {
    res
      .status(400)
      .render('urls_registration-error', {error: "Error 400: E-mail cannot be blank please try again!"});
    return;
  }
  // Check if there is a user with such email address in our users Database
  if (userID !== null) {
  
    if (!bcrypt.compareSync(password, users[userID]['password'])) {
      res
        .status(400)
        .render('urls_registration-error', {error: "Error 400: The username and password you entered did not match our records. Please double-check and try again!"});
      return;
    }
    //filter database to show only URLs created by user:
    req.session.userid = userID;
    res
      .redirect('/urls');

  } else {
    res
      .status(400)
      .render('urls_registration-error', {error: "Error 400: Unfortunately there is no user with this email address!"});
    return;
  }

});

// A POST route to logout and clear cookies:
app.post('/logout', (req, res) => {
  // Clear session cookies after user logout.
  req.session = null;
  res
    .redirect('/');

});

// A POST route for registration:
app.post('/register', (req, res)=> {

  const {email, password} = req.body;
  //Check if user provided both email and password. If any of them was not provided - return an error
  if (email === '' || password === '') {
    res
      .status(400)
      .render('urls_registration-error', {error: "Error 400: Email or Password field cannot be empty!"});
    return;
  // Check if user with this email already exists in the user Database. if so, return an error
  } else if (userExists({email, users}) === true) {
    res
      .status(400)
      .render('urls_registration-error', {error: "Error 400: User with this email already exists!"});
  }

  const id = getUniqID(users);
  const hushedPassword = bcrypt.hashSync(password, 10);
  if (addUser({data:users, email, password:hushedPassword , id}) !==  null) {
    res.redirect(307, '/login');
  }
  
});

//======================================================================================================================================================================
//=====================================================================Listening Server=================================================================================
//======================================================================================================================================================================

//Begin listening on a specified PORT
app.listen(PORT, () => {

  console.log(`Example app listening on port ${PORT}!`);

});


