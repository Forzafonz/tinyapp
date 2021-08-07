# TinyApp Description 

This is a Full Stack Application which allows users to shorten long URLs much like TinyURL.com and bit.ly do. This application support creation, editing and deletion of short URL for a given long URL. Users can only modify short URLs which were created by them. However, all users can use short URL to be redirected to a target website. 

# Dependencies

  * Node.js
  * Express
  * EJS
  * bcrypt
  * cookie-session
  * Bootstrap
  * mocha/chai (_for testing purposes only_)

# Getting Started

1. Clone repository in your local folder: `git clone git@github.com:Forzafonz/tinyapp.git tinyApp`
1. Switch into tinyApp directory. `cd tinyApp`
1. Install all dependencies (using the `npm install` command). 
1. Run the development web server using the `node express_server.js` command.
1. Make sure there is no active cookie-session created by another tinyApp (if you run multiple)
1. Go to `localhost:8080` in your browser of choice

# Screenshots
## Landing Page:
![Welcome Page](/Images/Welcome.png)
## Registration Page:
![Register Page](/Images/Register.png)
## Login Page:
![Login Page](/Images/Login.png)
## Links View Page:
![Links View Page](/Images/Links.png)
## Links View Page if no links created by a user:
![Links View Page](/Images/BlankLinks.png)

# Functional Requirements

## Display Requirements

### Site Header:

* if a user is logged in, the header shows:
  * the user's email
  * a logout button which makes a POST request to ```/logout```
* if a user is not logged in, the header shows:
  * a link to the login page (```/login```)
  * a link to the registration page (```/register```)

## Behaviour Requirements:

```GET /```

* _if user is logged in:_
  * (_Minor_) redirect to ```/urls```
* _if user is not logged in:_
  * (_Minor_) redirect to ```/login```

```GET /urls```

* if user is logged in: returns HTML with:
    1. the site header (see Display Requirements above)
    2. a list (or table) of URLs the user has created, each list item containing:
    3. a short URL
    4. the short URL's matching long URL
    5. an edit button which makes a GET request to ```/urls/:id```
    6. a delete button which makes a POST request to ```/urls/:id/delete```
    7. (_Minor_) a link to "Create a New Short Link" which makes a ```GET``` request to ```/urls/new```
* if user is not logged in:
  * returns HTML with a relevant error message

```GET /urls/new```

  * if user is logged in returns HTML with:
    1. the site header (see Display Requirements above)
    1. a form which contains:
        * a text input field for the original (long) URL
        * a submit button which makes a ```POST``` request to ```/urls```

  * if user is not logged in:
    redirects to the ```/login``` page

```GET /urls/:id```

  * if user is logged in and owns the URL for the given ID returns HTML with:
    1. the site header (see Display Requirements above)
    1. the short URL (for the given ID)
    1. a form which contains:

      * the corresponding long URL
      * an update button which makes a POST request to ```/urls/:id```
      * if a URL for the given ID does not exist:
          * (_Minor_) returns HTML with a relevant error message
      * if user is not logged in:
          * returns HTML with a relevant error message
      * if user is logged it but does not own the URL with the given ID:
          * returns HTML with a relevant error message


```GET /u/:id```

  * if URL for the given ID exists:
    * redirects to the corresponding long URL
  * if URL for the given ID does not exist:
    * (_Minor_) returns HTML with a relevant error message

```POST /urls```

  * if user is logged in:
    * generates a short URL, saves it, and associates it with the user
    * redirects to /urls/:id, where :id matches the ID of the newly saved URL

  * if user is not logged in:
    * (_Minor_) returns HTML with a relevant error message

```POST /urls/:id```


  * if user is logged in and owns the URL for the given ID:
    * updates the URL
    * redirects to ```/urls```

  * if user is not logged in:
    * (_Minor_) returns HTML with a relevant error message
  * if user is logged it but does not own the URL for the given ID:
    * (_Minor_) returns HTML with a relevant error message

```POST /urls/:id/delete```

  * if user is logged in and owns the URL for the given ID:
    * deletes the URL
    * redirects to ```/urls```

  * if user is not logged in:
    * (_Minor_) returns HTML with a relevant error message
  * if user is logged it but does not own the URL for the given ID:
    * (_Minor_) returns HTML with a relevant error message

```GET /login```

  * if user is logged in:
    * (_Minor_) redirects to ```/urls```

  * if user is not logged in:
    * returns HTML with a form which contains:
      1. input fields for email and password
      1. ```submit``` button that makes a POST request to /login

```GET /register```

  * if user is logged in:
    (_Minor_) redirects to /urls

  * if user is not logged in returns HTML with a form which contains:
    * input fields for email and password
    * a register button that makes a POST request to ```/register```

```POST /login```

  * if email and password params match an existing user:
    1. sets a cookie
    2. redirects to ```/urls```

  * if email and password params don't match an existing user:
    * returns HTML with a relevant error message

```POST /register```

  * if email or password are empty: returns HTML with a relevant error message

  * if email already exists: returns HTML with a relevant error message
  * otherwise:
    1. creates a new user
    2. encrypts the new user's password with ```bcrypt```
    3. sets a cookie
    4. redirects to ```/urls```

```POST /logout```

  * deletes cookie
  * redirects to /urls
