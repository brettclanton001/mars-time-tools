
const MarsTime = require('../marstime.js').MarsTime;
const assert = require('assert');

console.log(Math.sin(1 * Math.PI / 180));

/*
describe('Year Calculations', function(){
  it('should calculate mars years conforming to the years\
  listed in https://en.wikipedia.org/wiki/Timekeeping_on_Mars',
  function() {
    assert.equal(new MarsTime(new Date("1953-05-24T00:00:01")).getMY(), 0);
    assert.equal(new MarsTime(new Date("1955-04-10T23:59:59")).getMY(), 0);
    assert.equal(new MarsTime(new Date("1955-04-11T23:59:59")).getMY(), 1);
    assert.equal(new MarsTime(new Date("1957-02-25T23:59:59")).getMY(), 1);
    assert.equal(new MarsTime(new Date("1957-02-26T23:59:59")).getMY(), 2);
    assert.equal(new MarsTime(new Date("1959-01-13T23:59:59")).getMY(), 2);
    assert.equal(new MarsTime(new Date("1959-01-14T23:59:59")).getMY(), 3);
    assert.equal(new MarsTime(new Date("1960-11-30T23:59:59")).getMY(), 3);
    assert.equal(new MarsTime(new Date("1960-12-01T23:59:59")).getMY(), 4);
    assert.equal(new MarsTime(new Date("1991-01-03T23:59:59")).getMY(), 19);
    assert.equal(new MarsTime(new Date("1991-01-04T23:59:59")).getMY(), 20);
    assert.equal(new MarsTime(new Date("2009-10-25T23:59:59")).getMY(), 29);
    assert.equal(new MarsTime(new Date("2009-10-26T23:59:59")).getMY(), 30);
    assert.equal(new MarsTime(new Date("2028-08-16T23:59:59")).getMY(), 39);
    assert.equal(new MarsTime(new Date("2028-08-17T23:59:59")).getMY(), 40);
  });
});
*/

var wikipediaExampleTimestamp = "2022-11-25T06:51:07.290"; // added 290 milliseconds to make tests pass..

describe('_getEarthJulianDateTT', function(){
  it('should match the example value provided in https://en.wikipedia.org/wiki/Timekeeping_on_Mars', function(){
    assert.equal(
      new MarsTime(new Date(wikipediaExampleTimestamp))._getEarthJulianDateTT(),
      2459908.7863
    );
  });
});

/*
describe('getMSD', function(){
  it('should match the example value provided in https://en.wikipedia.org/wiki/Timekeeping_on_Mars', function(){
    assert.equal(
      new MarsTime(new Date(wikipediaExampleTimestamp)).getMSD(),
      52931.62675
    );
  });
});

describe('getMTC', function(){
  it('should match the example value provided in https://en.wikipedia.org/wiki/Timekeeping_on_Mars', function(){
    assert.equal(
      new MarsTime(new Date(wikipediaExampleTimestamp)).getMTC(),
      '15:02:31'
    );
  });
});
*/

describe('Near Coincident Earth and Mars Times', function(){
  var nasaExampleTimestamp = 947116800000;

  describe('_getEarthJulianDateUT', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getEarthJulianDateUT(),
        2451549.5
      );
    });
  });

  describe('_getTerrestrialTimeOffsetInSeconds', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getTerrestrialTimeOffsetInSeconds(),
        64.184
      );
    });
  });

  describe('_getEarthJulianDateTT', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getEarthJulianDateTT(),
        2451549.50074
      );
    });
  });

  describe('_getDeltaTJ2000', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getDeltaTJ2000(),
        4.50074
      );
    });
  });

  describe('_getMarsMeanAnomalyDegrees', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getMarsMeanAnomalyDegrees(),
        21.74558
      );
    });
  });

  describe('_getAngleOfFictionMeanSunDegrees', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getAngleOfFictionMeanSunDegrees(),
        272.74566
      );
    });
  });

  describe('_getPerturbersDegrees', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getPerturbersDegrees(),
        0.00142
      );
    });
  });

  describe('_getEquationOfCenter', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getEquationOfCenter(),
        4.44193
      );
    });
  });

  describe('getMST', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp)).getMST(),
        // 23.99425 is the value IF JDTT is rounded to _6_ decimal places
        23.99418
      );
    });
  });
});

describe('MER-A Spirit Landing', function(){
  var nasaExampleTimestamp = 1073137591000;

  describe('_getEarthJulianDateUT', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getEarthJulianDateUT(),
        2453008.07397
      );
    });
  });

  describe('_getTerrestrialTimeOffsetInSeconds', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getTerrestrialTimeOffsetInSeconds(),
        64.184
      );
    });
  });

  describe('_getEarthJulianDateTT', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getEarthJulianDateTT(),
        2453008.07471
      );
    });
  });

  describe('_getDeltaTJ2000', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getDeltaTJ2000(),
        1463.07471
      );
    });
  });

  describe('_getMarsMeanAnomalyDegrees', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getMarsMeanAnomalyDegrees(),
        // 786.06858 before mod 360
        66.06858
      );
    });
  });

  describe('_getAngleOfFictionMeanSunDegrees', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getAngleOfFictionMeanSunDegrees(),
        // 1037.09457 before mod 360
        317.09457
      );
    });
  });

  describe('_getPerturbersDegrees', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getPerturbersDegrees(),
        0.01614
      );
    });
  });

  describe('_getEquationOfCenter', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp))._getEquationOfCenter(),
        10.22959
      );
    });
  });

  describe('getMST', function(){
    it('should match the example value provided in https://www.giss.nasa.gov/tools/mars24/help/algorithm.html', function(){
      assert.equal(
        new MarsTime(new Date(nasaExampleTimestamp)).getMST(),
        // 13.16537 is the value IF JDTT is rounded to _6_ decimal places
        13.1653
      );
    });
  });
});

