const { assert } = require('chai');
const {addToDatabase, getFromDatabase, removeFromDatabase, getUniqID, addUser, getUserID, extractID, userExists, urlsForUser, getLongUrl} = require('../helpers/functions');
const {users, urlDatabase} = require("../helpers/testData");

describe('addToDatabase', function () {

  it('should add a new object to improvised database. Operation is performed in-place, so there is no return value', function () {
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
    }
    const result = addToDatabase(urlDatabase, "sa2fd2","https://www.youtube.com/watch?v=kzH5RnM2R4g&t=28s&ab_channel=TALLDRAGON", "randomUser");
    
    assert.deepEqual(urlDatabase, expectedOutput);
  });
});


describe(`getLongUrl` , () => {

  it('if there is no https prefix in the link, it should return a link with https attached to it', function () {

    const expectedOutput = "https://www.youtube.com"
    const result = getLongUrl("www.youtube.com");
    assert.equal(result, expectedOutput);

  });

  it('if there is https prfix in the link, it should return the same link', function () {

    const expectedOutput = "https://www.youtube.com"
    const result = getLongUrl("https://www.youtube.com");
    assert.equal(result, expectedOutput);

  });
});

describe(`getLongUrl` , () => {

  it('if there is no https prefix in the link, it should return a link with https attached to it', function () {
  
    const expectedOutput = "https://www.youtube.com"
    const result = getLongUrl("www.youtube.com");
    assert.equal(result, expectedOutput);
  
  });
  
  it('if there is https prfix in the link, it should return the same link', function () {
  
    const expectedOutput = "https://www.youtube.com"
    const result = getLongUrl("https://www.youtube.com");
    assert.equal(result, expectedOutput);
  
  });
});