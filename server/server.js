const express = require("express");
const OktaJwtVerifier = require("@okta/jwt-verifier");
var cors = require("cors");
const users = [
  {
    id: 1,
    email: "test@test.com"
  },
  {
    id: 2,
    email: "second@test.com"
  }
];

const oktaJwtVerifier = new OktaJwtVerifier({
  issuer: "https://dev-464496.okta.com/oauth2/default",
  clientId: "0oad45f9yb3qknHIh356",
  assertClaims: {
    aud: "api://default"
  }
});

/**
 * A simple middleware that asserts valid access tokens and sends 401 responses
 * if the token is not present or fails validation.  If the token is valid its
 * contents are attached to req.jwt
 */
function authenticationRequired(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    return res.status(401).end();
  }

  const accessToken = match[1];

  return oktaJwtVerifier
    .verifyAccessToken(accessToken)
    .then(jwt => {
      req.jwt = jwt;
      next();
    })
    .catch(err => {
      res.status(401).send(err.message);
    });
}

const app = express();

/**
 * For local testing only!  Enables CORS for all domains
 */
app.use(cors());

/**
 * An example route that requires a valid access token for authentication, it
 * will echo the contents of the access token if the middleware successfully
 * validated the token.
 */
app.get("/secure", authenticationRequired, (req, res) => {
  res.json(req.jwt);
});

app.get("/api/users", authenticationRequired, (req, res) => {
  res.json(users);
});

/**
 * Another example route that requires a valid access token for authentication, and
 * print some messages for the user if they are authenticated
 */
app.get("/api/messages", authenticationRequired, (req, res) => {
  res.json([
    {
      message: "Hello, word!"
    }
  ]);
});

app.listen(3001, () => {
  console.log("Serve Ready on port 3001");
});