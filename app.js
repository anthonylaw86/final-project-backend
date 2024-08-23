require("dotenv").config();
const express = require("express");
const dotenv = require("dotenv");
const fetch = require("node-fetch");

const { URLSearchParams } = require("url");
const cors = require("cors");
const mongoose = require("mongoose");
const { errors } = require("celebrate");
const helmet = require("helmet");
const routes = require("./routes/index");
const errorHandler = require("./middleware/errorHandler");
const limiter = require("./middleware/rateLimiter");

const { requestLogger, errorLogger } = require("./middleware/logger");

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
  // console.log(`${req.method} ${req.url} - ${JSON.stringify(req.body)}`);
  next();
});

// REQUEST LOGGER
app.use(requestLogger);

// SPOTIFY

dotenv.config();

var spotify_client_id = process.env.SPOTIFY_CLIENT_ID;
var spotify_client_secret = process.env.SPOTIFY_CLIENT_SECRET;

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

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      "https://beatapp.strangled.net",
      "htto://beatapp.strangled.net",
      "http://api.beatapp.strangled.net",
      "http://localhost:3000", // your frontend running locally
      "http://localhost:3002", // your backend running locally
    ];

    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      // Allow requests with no origin (like mobile apps or curl requests)
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(express.json());

app.options("*", cors(corsOptions));

app.get("/auth/token", (req, res) => {
  res.json({ access_token: access_token });
  console.log(access_token);
});

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

app.get("/auth/callback", async (req, res) => {
  const code = req.query.code;

  // prepare the request body and headers
  const body = new URLSearchParams({
    code: code,
    redirect_uri: spotify_redirect_uri,
    grant_type: "authorization_code",
  }).toString();

  const headers = {
    Authorization:
      "Basic " +
      Buffer.from(spotify_client_id + ":" + spotify_client_secret).toString(
        "base64"
      ),
    "Content-Type": "application/x-www-form-urlencoded",
  };

  try {
    // make the POST request to spotify's token endpoint
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: headers,
      body: body,
    });

    // check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }

    // Parse the JSON response
    const data = await response.json();
    const { access_token } = data;

    global.access_token = access_token;

    // do something with the tokens
    res.redirect(`http://localhost:3000/post-login?token=${access_token}`);
  } catch (error) {
    console.error("Error exchanging code for token:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// ROUTES
app.use("/", routes);

// ERROR LOGGER
app.use(errorLogger);

// CELEBRATE ERROR HANDLER
app.use(errors());

// CENTRALIZED ERROR HANDLER
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
