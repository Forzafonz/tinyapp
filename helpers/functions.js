const bcrypt = require('bcrypt');
const {letters, numbers} = require('../helpers/constants');

//Function to generate random strings which will be used as an shortURL
const generateRandomString = function() {

  let random = [];
  for (let i = 0; i < 6; i++) random.push(Math.floor(Math.random() * 52));
  let result = random.map(element => {
    return letters[element];
  });
  return result.join('');

};

//Function which is used to add/update longUrl in the database based on shortUrl
const addToDatabase = function(urlDatabase, shortUrl, longUrl, id) {

  let standUrl = getLongUrl(longUrl);
  urlDatabase[shortUrl] = {longURL:standUrl, userID: id};

};

// Function returns longURL from the database based on shortURL
const getFromDatabase = function({urlDatabase, shortURL}) {

  if (urlDatabase[shortURL] === undefined) {
    return false;
  }
  return urlDatabase[shortURL]['longURL'];

};

// Function which removes longURL and shortURL pair from the database
const removeFromDatabase = function(urlDatabase, shortURL) {

  if (urlDatabase[shortURL] === undefined) {
    return false;
  }
  delete urlDatabase[shortURL];

};

// Function to generate userID:
const getUniqID = function(data) {

  let uniqueKey = [];
  let symbols = letters + numbers;
  for (let i = 0; i < 6; i++) uniqueKey.push(Math.floor(Math.random() * 62));
  uniqueKey = uniqueKey.map(element => {
    return symbols[element];
  });
  if (data[uniqueKey.join('')] === undefined) {

    return uniqueKey.join('');
    
  } else {
    return getUniqID(data);
  }

};

//Function to add user to "database":
const addUser = function({data, id, email, password}) {
  if (data[id] === undefined) {
    data[id] = {id, email, password};
  } else {
    return null;
  }
};

//Function to get user id by e-mail:

const getUserID = function({data, email}) {

  for (let key in data) {
    if (data[key]['email'] === email) {
      return data[key]['id'];
    }
  }
  return null;
};

// Function to check and extract ID from cookies:

const extractID = function(cookies) {
 
  const result = cookies ? cookies : {};
  if (result['userid'] !== undefined) {
    return result['userid'];
  }
  return null;
};

// Function to check if user already exists in "users" object (for registration):

const userExists = function({email, users}) {
  for (const key in users) {
    if (users[key]['email'] === email) {
      return true;
    }
  }
  return false;
};

// Function to check if a longURL includes http part in it. If not - add it.

const getLongUrl = function(url) {
  return url.substring(0,4) === 'http' ? url : 'https://' + url;
};

// Function which returns URLS where the userID is equal to the id of the currently logged-in user:

const urlsForUser = function({data, userID}) {
  let urlsForUser = {};
  let showKeys = Object.keys(data)
    .filter(key => {
      if (data[key]['userID'] === userID) {
        return true;
      }
    });
  if (showKeys.length > 0) {
    showKeys.forEach(key => {
      urlsForUser[key] = data[key];
    });
  } else {
    return null;
  }

  return urlsForUser;
};

//Function to hushify all existing passwords in the database:

const hashPasswords = function(data) {
  
  for (let key in data) {
    const hushedPassword = bcrypt.hashSync(data[key]['password'], 10);
    data[key]['password'] = hushedPassword;
  }
  
};

module.exports = {generateRandomString, addToDatabase, getFromDatabase, removeFromDatabase, getUniqID, addUser, getUserID, extractID, userExists, urlsForUser, getLongUrl, hashPasswords };