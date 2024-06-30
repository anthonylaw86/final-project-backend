const express = require("express");
const dotenv = require("dotenv");
const request = require("request");
const { URLSearchParams } = require("url");
const cors = require("cors");

const port = 3001;

global.access_token = "";

dotenv.config();

var spotify_client_id = "33984d71b68e4231b7db8088bd75ff17";
var spotify_client_secret = "ab56577e6e34483fb27804f8e4cacc6f";

var spotify_redirect_uri = "http://localhost:3001/auth/callback";

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var app = express();
app.use(cors());
app.options("*", cors());

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

  res.redirect(
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
      redirect_uri: spotify_redirect_uri,
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
    // if (!error && response.statusCode === 200) {

    //   res.redirect("/");
    // }
    access_token = body.access_token;
    if (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
    if (response.statusCode !== 200) {
      console.error("Failed to retrieve access token:", body);
      return res.status(response.statusCode).json(body);
    }

    res.redirect("http://localhost:3000/post-login?token=${token}");
  });
});

app.get("/auth/token", (req, res) => {
  res.json({ access_token: access_token });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
