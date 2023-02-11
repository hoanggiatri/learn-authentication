import express from "express";
import dotenv from 'dotenv'
import createHttpError from "http-errors";
dotenv.config();
const app = express();

app.get('/', (req, res) => {
  console.log('a::', a)
  res.send('Home page')
});

app.use((err, req, res, next) => {
  //const error = new Error('Not Found');
  //error.status = 500;
  next(createHttpError.NotFound('This page does not exist'));
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