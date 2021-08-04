//Function to generate random strings which will be used as an shortURL
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
const addToDatabase = function(urlDatabase, shortUrl, longUrl) {

  urlDatabase[shortUrl] = longUrl;

};

// Function returns longURL from the database based on shortURL
const getFromDatabase = function(urlDatabase, shortURL) {

  if (urlDatabase[shortURL] === 'undefined') {
    return false;
  }
  return urlDatabase[shortURL];
};

// Function which removes longURL and shortURL pair from the database
const removeFromDatabase = function(urlDatabase, shortURL) {

  if (urlDatabase[shortURL] === 'undefined') {
    return false;
  }
  delete urlDatabase[shortURL];

};

// Function to generate userID:
const getUniqID = function (data){
  let uniqueKey = `user${Math.floor(Math.random() * 100)}randomID`;
  if (data[uniqueKey] === undefined) return uniqueKey;
  return getUniqID();
}

//Function to add user to "database":
const addUser = function ({data, id, email, password}) {
  if (data[id] === undefined) {
    data[id] = {id, email, password};
  } else {
    return null;
  };
};

//Function to get user id by e-mail:

const getUserID = function ({data, email}) {

  for (let key in data) {
    if (data[key]['email'] === email) {
      return data[key]['id'];
    }
  }
  return null;
}

// Function to check and extract ID from cookies:

const extractID = function (cookies) {
  const result = cookies ? cookies : {}
  if (cookies['userid'] !== undefined) {
    return cookies['userid'];
  }
  return null;
}

// Function to check if user already exists in "users" object (for registration):

const userExists = function ({email, users}) {
  for (const key in users) {
    if (users[key]['email'] === email){
      return true;
    }
  }
  return false;
}

module.exports = {generateRandomString, addToDatabase, getFromDatabase, removeFromDatabase, getUniqID, addUser, getUserID, extractID, userExists}