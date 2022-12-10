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
const MarsTime = require('mars-time-tools').MarsTime
var marstime = new MarsTime(Date.now())
console.log(
  'Mars Time: ' + marstime.getMTC() + ' -- ' +
  marstime.getMYTD() + ' sols into year: ' + marstime.getMY() + ' -- ' +
  marstime.getMSUNY() + ' sols until newyears!'
)
```

..That will output something like this:
```
Mars Time: 06:29:36 -- 644 sols into year: 36 -- 25 sols until newyears!
```

---

## Contribute to this project

To test this package:
```
npm test
```
