const express = require("express");

const { PORT = 3001 } = process.env;

const app = express();

app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
