const { assert } = require('chai');
const {addToDatabase, getFromDatabase, removeFromDatabase, getUniqID, addUser, getUserID, extractID, userExists, urlsForUser, getLongUrl} = require('../helpers/functions');
const {users, urlDatabase} = require("../helpers/testData");

describe('addToDatabase', function() {

  it('should add a new object to improvised database. Operation is performed in-place, so there is no return value', function() {
    const expectedOutput = {

      "b2xVn2": {
        longURL: "http://www.lighthouselabs.ca",
        userID: "user2RandomID"
      },
      "9sm5xK": {
        longURL: "http://www.google.com",
        userID: "userRandomID"
      },
      "sgq3y6": {
        longURL: "https://support.mozilla.org/en-US/products/firefox",
        userID: "userRandomID"
      },
      "sa2fd2": {
        longURL:"https://www.youtube.com/watch?v=kzH5RnM2R4g&t=28s&ab_channel=TALLDRAGON",
        userID: "randomUser"
      }
    };
    let urlDatabaseTest = urlDatabase;
    const result = addToDatabase(urlDatabaseTest, "sa2fd2","https://www.youtube.com/watch?v=kzH5RnM2R4g&t=28s&ab_channel=TALLDRAGON", "randomUser");
    assert.deepEqual(urlDatabaseTest, expectedOutput);
    removeFromDatabase(urlDatabaseTest,"sa2fd2"); // <= needed to return databases back to its previous state;
  });
});


describe(`getLongUrl` , () => {

  it('if there is no https prefix in the link, it should return a link with https attached to it', function() {

    const expectedOutput = "https://www.youtube.com";
    const result = getLongUrl("www.youtube.com");
    assert.equal(result, expectedOutput);

  });

  it('if there is https prfix in the link, it should return the same link', function() {

    const expectedOutput = "https://www.youtube.com";
    const result = getLongUrl("https://www.youtube.com");
    assert.equal(result, expectedOutput);

  });
});

describe(`getFromDatabase` , () => {

  it('if there is an object in database with specified shortURL as a key it should return respective longURL', function() {
  
    const expectedOutput = "http://www.lighthouselabs.ca";
    const result = getFromDatabase({urlDatabase, shortURL: "b2xVn2"});
    assert.equal(result, expectedOutput);
  
  });
  
  it("if there is no object in database with specified shortURL as a key it should return 'false'", function() {
  
    const expectedOutput = false; // <= used here for consistency only
    const result = getFromDatabase({urlDatabase, shortURL: "b2xVn3"});
    assert.isFalse(result);
  
  });
});

describe(`removeFromDatabase` , () => {

  it('if there is an object in database with specified shortURL as a key it should be removed from the improvised database', function() {
  
    const expectedOutput = {
      "9sm5xK": {
        longURL: "http://www.google.com",
        userID: "userRandomID"
      },
      "sgq3y6": {
        longURL: "https://support.mozilla.org/en-US/products/firefox",
        userID: "userRandomID"
      }
    };
    let urlDatabaseTest = urlDatabase;
    const result = removeFromDatabase(urlDatabaseTest,"b2xVn2");
    assert.deepEqual(urlDatabaseTest, expectedOutput);
  
  });
  
  it("if there is no object in database with specified shortURL as a key it should return 'false'", function() {
    
    const expectedOutput = false; // <= used here for consistency only
    const result = removeFromDatabase({urlDatabase, shortURL: "b2xVn3"});
    assert.isFalse(result);
  
  });
});

describe(`addUser (to users Database)` , () => {

  it('if there is no existing user with the same userID then add a user to user Database', function() {
  
    const expectedOutput = {

      "userRandomID": {
        id: "userRandomID",
        email: "user@example.com",
        password: "purple-monkey-dinosaur"
      },
      "user2RandomID": {
        id: "user2RandomID",
        email: "user2@example.com",
        password: "dishwasher-funk"
      },
      "a53g6G": {
        id: "a53g6G",
        email: "anton@anton",
        password: "testpassword"
      }
    };
    
    addUser({data:users, id:"a53g6G", email: "anton@anton", password: "testpassword"});
    assert.deepEqual(users, expectedOutput);
  
  });
  
  it("if there is existing user with the same userID that is attempted to be added then return 'null'", function() {
  
    const expectedOutput = false; // <= used here for consistency only
    const result = addUser({data:users, id:"a53g6G", email: "anton@anton", password: "testpassword"});
    assert.isNull(result);
  
  });
});

describe(`getUserID` , () => {

  it('if there is an object in user database with specified email as a value it should return this user ID', function() {
  
    const expectedOutput = "userRandomID";
    const result = getUserID({data: users, email: "user@example.com"});
    assert.equal(result, expectedOutput);
  
  });
  
  it("If there is no object in user database with specified email as a value it should return this user ID", function() {
  
    const expectedOutput = null; // <= used here for consistency only
    const result = getUserID({data: users, email: "user@example.com2"});
    assert.isNull(result);
  
  });
});

describe(`extractID from cookies file` , () => {

  it('if cookies object is not empty and have a userid parameter - return value of userid parameter', function() {
  
    const expectedOutput = "g4si1B";
    const result = extractID({userid: 'g4si1B'});
    assert.equal(result, expectedOutput);
  
  });
  
  it("if cookies object is empty or does not have a userid parameter - return null", function() {
  
    const expectedOutput = null; // <= used here for consistency only
    const result = extractID({});
    assert.isNull(result);
  
  });
});

describe(`userExists` , () => {

  it('if a specified email exists in users database return true', function() {
  
    const expectedOutput = true; // <= used here for consistency only
    const result = userExists({users, email: "user2@example.com" });
    assert.isTrue(result, expectedOutput);
  
  });
  
  it("if a specified email does not exist in users database return false", function() {
  
    const expectedOutput = false; // <= used here for consistency only
    const result = userExists({users, email: "user210@example.com" });
    assert.isFalse(result);
  
  });
});

describe(`urlsForUser ` , () => {

  it('Return a list of URLs that were created by specified user if there are such URLs in databaseURL', function() {
    //Prepare dataset//
    addToDatabase(urlDatabase, "sa2fd2","https://www.youtube.com", "randomUser");
    addToDatabase(urlDatabase, "sa2fd5","https://stackoverflow.com", "randomUser");
    addToDatabase(urlDatabase, "sa2fd6","https://www.reddit.com", "userRandomID");
    //End of dataset preparation//
    const expectedOutput = {

      "sa2fd6": {
        longURL: "https://www.reddit.com",
        userID: "userRandomID"
      },

      "9sm5xK": {
        longURL: "http://www.google.com",
        userID: "userRandomID"
      },
      "sgq3y6": {
        longURL: "https://support.mozilla.org/en-US/products/firefox",
        userID: "userRandomID"
      }
    };

      
    const result = urlsForUser({data: urlDatabase, userID: "userRandomID"});
    assert.deepEqual(result, expectedOutput);
  
  });
  
  it("Return 'null' if there is no URL in databaseURL created by specified user", function() {
  
    const expectedOutput = null; // <= used here for consistency only
    const result = urlsForUser({data: urlDatabase, userID: "NoOneIsGoingToUseThisIDinPROD"});
    assert.isNull(result);
  
  });
});

