const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require("mongoose");
require('dotenv').config();
const cors = require('cors');
const app = express();

const apiRoutes = require('./src/modules/routes/routes');


try {
  mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });
} catch(error) {
  res.status(500).send('Internal server error');
}

app.use(bodyParser());
app.use(cors());
app.use("/", apiRoutes);

app.listen(process.env.PORT, () => {
  console.log(`The server is working on port ${process.env.PORT}.`);
});
