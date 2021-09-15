const express = require('express')
const app = express()
const port = 3001

// middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// routes
app.use(require('./routes/index'));

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})