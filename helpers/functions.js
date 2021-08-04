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

module.exports = {generateRandomString, addToDatabase, getFromDatabase, removeFromDatabase}