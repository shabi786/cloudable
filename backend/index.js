const express = require('express')
const MongoConnect = require('./db')
MongoConnect();
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello Shabi Abbas!')
})
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port, () => {
  console.log(`Example app listening on http://localhost:${port}`)
})