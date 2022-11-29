const express = require('express')
const app = express()
const port = 3000

const MarsTime = require('./marstime.js').MarsTime

app.get('/', (req, res) => {
  var marstime = new MarsTime(Date.now())
  res.send('Mars Time: ' + marstime.getMTC() + ' -- ' + marstime.getMYTD() + ' days into year: ' + marstime.getMY())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
