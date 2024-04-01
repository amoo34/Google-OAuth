// import required modules
const express = require("express");
const bodyParser = require("body-parser");
const { OAuth2Client } = require("google-auth-library");

// create express server instance
const app = express();

const PORT = process.env.port || 3000;

// add middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Create an OAuth2 client
const oAuth2Client = new OAuth2Client({
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  redirectUri: process.env.REDIRECT_URI,
});

// ENDPOINTS FOR GOOGLE OAUTH FLOW

// Redirect the user to Google's OAuth consent screen
app.get("/signin", (req, res) => {
  const authorizeUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/userinfo.profile",
    ],
  });
  res.json({ url: authorizeUrl });
});

// Handle the callback after the user grants authorization
app.get("/oauth2callback", async (req, res) => {
  const code = req.body.code;
  console.log("sdas", code);
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);

    res.json({ data: tokens });
  } catch (error) {
    console.error("Error retrieving access token:", error);
    res.status(500).send("Error retrieving access token");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
