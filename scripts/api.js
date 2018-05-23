require('dotenv').config()

var express = require("express");
var bodyParser = require("body-parser");
var { addJob } = require("./master");

var app = express();

/**
 * Config
 */

const port = process.env.API_PORT || 3000;

/**
 * Middlewares
 */

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

/**
 * Merge all request data into one big object
 * so we can use this thru the whole routes
 */

app.use((req, res, next) => {
  req.setTimeout(60000);
  req.data = {
    ...(req.query || {}),
    ...(req.body || {}),
    ...(req.params || {}),
    ...{ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress}
  };

  // BYPASS CORS OPTIONS
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.send(200);
  }else{
    next()
  }
});

/**
 * Route handlers
 */

app.all("/", async function(req, res) {
  const result = await addJob({ data: req.data });
  res.send({ inputData: req.data, result });
});

/**
 * Listener
 */

app.listen(port, function(err) {
  console.log(`Server listening on port ${port}`);
});
