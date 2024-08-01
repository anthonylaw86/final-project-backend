require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
// const request = require("request");
const fetch = import("node-fetch");
const { URLSearchParams } = require("url");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const helmet = require("helmet");
const indexRouter = require("../routes/index");
const errorHandler = require("../middleware/errorHandler");
const limiter = require("../middleware/rateLimiter");

const { requestLogger, errorLogger } = require("../middleware/logger");

const app = express();
const { port = 3002 } = process.env;

mongoose
  .connect("mongodb://127.0.0.1:27017/beatapp")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

// RATE LIMITER
app.use(limiter);

// SET SECURITY HEADERS
app.use(helmet());

// BASIC REQUEST LOGGING
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});

// REQUEST LOGGER
app.use(requestLogger);

// ROUTES
app.use("/", indexRouter);

// ERROR LOGGER
app.use(errorLogger);

// CELEBRATE ERROR HANDLER
app.use(errors());

// CENTRALIZED ERROR HANDLER
app.use(errorHandler);

// SPOTIFY

global.access_token = "";

dotenv.config();

var spotify_client_id = "33984d71b68e4231b7db8088bd75ff17";
var spotify_client_secret = "ab56577e6e34483fb27804f8e4cacc6f";

var spotify_redirect_uri = "http://localhost:3002/auth/callback";

var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app.use(cors());
app.use(express.json());
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

  // request.post(authOptions, function (error, response, body) {
  //   // if (!error && response.statusCode === 200) {

  //   //   res.redirect("/");
  //   // }
  //   access_token = body.access_token;
  //   if (error) {
  //     console.error("Error:", error);
  //     return res.status(500).json({ error: "Internal Server Error" });
  //   }
  //   if (response.statusCode !== 200) {
  //     console.error("Failed to retrieve access token:", body);
  //     return res.status(response.statusCode).json(body);
  //   }

  //   res.redirect("http://localhost:3000/post-login?token=${token}");
  // });
});

app.post("/profile", async (req, res) => {
  const authOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " +
        new Buffer(spotify_client_id + ":" + spotify_client_secret).toString(
          "base64"
        ),
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: req.body.code,
      redirect_uri: redirect_uri,
    }),
  };

  try {
    const response = await fetch(
      "https://accounts.spotify.com/api/token",
      authOptions
    );
    const body = await response.json();

    if (!response.ok) {
      console.error("Failed to retrieve access token:", body);
      return res.status(response.status).json(body);
    }

    const access_token = body.access_token;
    res.redirect(`http://localhost:3000/post-login?token=${access_token}`);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/auth/token", (req, res) => {
  res.json({ access_token: access_token });
});

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
