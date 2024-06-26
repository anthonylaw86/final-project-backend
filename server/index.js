const express = require("express");
const dotenv = require("dotenv");
const request = require("request");
const { URLSearchParams } = require("url");

const port = 5000;

dotenv.config();

var spotify_client_id = process.env.spotify_client_id;
var spotify_client_secret = process.env.spotify_client_secret;

var app = express();

app.get("/auth/login", (req, res) => {
  var scope = "streaming user-read-email user-read-private";
  var state = generateRandomString(16);

  var auth_query_parameters = new URLSearchParams({
    response_type: "code",
    client_id: spotify_client_id,
    scope: scope,
    redirect_uri: spotify_redirect_uri,
    state: state,
  });

  res_redirect(
    "https://accounts.spotify.com/authorize/?" +
      auth_query_parameters.toString()
  );
});

app.get("/auth/callback", (req, res) => {
  var code = req.query.code;

  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri: "http://localhost:3000/auth/callback",
      grant_type: "authorization_code",
    },
    headers: {
      Authorization:
        "Basic " +
        Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (response.statusCode !== 200) {
      console.error("Failed to retrieve access token:", body);
      return res.status(response.statusCode).json(body);
    }

    var access_token = body.access_token;
    res.redirect("/");
  });
});

app.get("/auth/token", (req, res) => {
  res.json({ access_token: access_token });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
