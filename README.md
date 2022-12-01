[![Node.js CI](https://github.com/brettclanton001/mars-time-tools/actions/workflows/node.js.yml/badge.svg)](https://github.com/brettclanton001/mars-time-tools/actions/workflows/node.js.yml)

# Mars Time Tools

This project will solve problems for future Martians and the Earthlings that interact with them.

This tool is meant to be a precise 1 to 1 match with [Nasa's Mars24 Java program](https://www.giss.nasa.gov/tools/mars24/help/algorithm.html),
using their specifications as requirements.  Test coverage confirms accuracy matching Nasa's programs.

The intention is to continue to add highly accurate functionality in the future.

---

To install this package:

```
npm i --save mars-time-tools
```

Example Usage:
```
const express = require('express')
const MarsTime = require('mars-time-tools').MarsTime
const app = express()
const port = 3000

app.get('/', (req, res) => {
  var marstime = new MarsTime(Date.now())
  res.send('Mars Time: ' + marstime.getMTC())
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```
```
Mars Time: 06:26:37
```


To test this package:
```
npm test
```
