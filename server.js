const express = require("express");
require("dotenv").config();
const createError = require("http-errors");
const route = require("./routes/User.route.js")
const app = express();
require('./helpers/connections_redis');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/user', route);

app.get('/', (req, res, next) => {
  console.log('a:::', a);
  res.send('Home page')
});

app.use((req, res, next) => {
  //const error = new Error('Not Found');
  //error.status = 500;
  next(createError.NotFound('This route does not exist'));
});

app.use((err, req, res, next) => {
  res.json({
    status: err.status || 500,
    message: err.message,
  })
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});