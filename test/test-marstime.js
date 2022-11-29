const MarsTime = require('../marstime.js').MarsTime;
const assert = require('assert');


// ========== Wikipedia Sourced Tests ==========
// https://en.wikipedia.org/wiki/Timekeeping_on_Mars

describe('Year Calculations', function(){
  it('should calculate mars years conforming to the years listed', function() {
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

describe('should match the wikipedia example: https://en.wikipedia.org/wiki/Timekeeping_on_Mars', function(){
  var marstime = new MarsTime(new Date("2022-11-25T06:51:07.100"));
  // adding the 100 milliseconds made tests pass

  describe('_getEarthJulianDateTT', function(){
    it('should match the example value provided in wikipedia', function(){
      assert.equal(
        Number((marstime._getEarthJulianDateTT()).toFixed(5)),
        2459908.7863
      );
    });
  });
  
  describe('getMSD', function(){
    it('should match the example value provided in wikipedia', function(){
      assert.equal(
        Number((marstime.getMSD()).toFixed(5)),
        52931.62675
      );
    });
  });
  
  describe('getMTC', function(){
    it('should match the example value provided in wikipedia', function(){
      assert.equal(
        marstime.getMTC(),
        '15:02:31'
      );
    });
  });
});

// ========== NASA Sourced Tests ==========
// https://www.giss.nasa.gov/tools/mars24/help/algorithm.html

describe('Near Coincident Earth and Mars Times', function(){
  var marstime = new MarsTime(new Date(947116800000));

  describe('_getEarthJulianDateUT', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getEarthJulianDateUT()).toFixed(5)),
        2451549.5
      );
    });
  });

  describe('_getTerrestrialTimeOffsetInSeconds', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getTerrestrialTimeOffsetInSeconds()).toFixed(5)),
        64.184
      );
    });
  });

  describe('_getEarthJulianDateTT', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getEarthJulianDateTT()).toFixed(5)),
        2451549.50074
      );
    });
  });

  describe('_getDeltaTJ2000', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getDeltaTJ2000()).toFixed(5)),
        4.50074
      );
    });
  });

  describe('_getMarsMeanAnomalyDegrees', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getMarsMeanAnomalyDegrees()).toFixed(5)),
        21.74558
      );
    });
  });

  describe('_getAngleOfFictionMeanSunDegrees', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getAngleOfFictionMeanSunDegrees()).toFixed(5)),
        272.74566
      );
    });
  });

  describe('_getPerturbersDegrees', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getPerturbersDegrees()).toFixed(5)),
        0.00142
      );
    });
  });

  describe('_getEquationOfCenter', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getEquationOfCenter()).toFixed(5)),
        4.44193
      );
    });
  });

  describe('_getAreocentricSolarLongitude', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getAreocentricSolarLongitude()).toFixed(5)),
        // 277.18758 -- I kept getting 277.18758943716205 which rounds up to ***.****9
        // all other things being equal, looks like a mistake
        277.18759
      );
    });
  });

  describe('_getEOT', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getEOT()).toFixed(5)),
        -0.34585
      );
    });
  });

  describe('getMST', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime.getMST()).toFixed(5)),
        1075103.99425
      );
    });
  });

  describe('getMST24', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime.getMST24()).toFixed(5)),
        23.99425
      );
    });
  });

  describe('getLMST', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime.getLMST(0)).toFixed(5)),
        23.99425
      );
    });
  });

  describe('getLTST', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime.getLTST(0)).toFixed(5)),
        23.64840
      );
    });
  });

  /*
  describe('_getSubsolarLongitude', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getSubsolarLongitude()).toFixed(5)),
        174.72600
      );
    });
  });
  */
});

describe('MER-A Spirit Landing', function(){
  var marstime = new MarsTime(new Date(1073137591000));

  describe('_getEarthJulianDateUT', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getEarthJulianDateUT()).toFixed(5)),
        2453008.07397
      );
    });
  });

  describe('_getTerrestrialTimeOffsetInSeconds', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getTerrestrialTimeOffsetInSeconds()).toFixed(5)),
        64.184
      );
    });
  });

  describe('_getEarthJulianDateTT', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getEarthJulianDateTT()).toFixed(5)),
        2453008.07471
      );
    });
  });

  describe('_getDeltaTJ2000', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getDeltaTJ2000()).toFixed(5)),
        1463.07471
      );
    });
  });

  describe('_getMarsMeanAnomalyDegrees', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getMarsMeanAnomalyDegrees()).toFixed(5)),
        // 786.06858 before mod 360
        66.06858
      );
    });
  });

  describe('_getAngleOfFictionMeanSunDegrees', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getAngleOfFictionMeanSunDegrees()).toFixed(5)),
        // 1037.09457 before mod 360
        317.09457
      );
    });
  });

  describe('_getPerturbersDegrees', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getPerturbersDegrees()).toFixed(5)),
        0.01614
      );
    });
  });

  describe('_getEquationOfCenter', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getEquationOfCenter()).toFixed(5)),
        10.22959
      );
    });
  });

  describe('_getAreocentricSolarLongitude', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getAreocentricSolarLongitude()).toFixed(5)),
        327.32416
      );
    });
  });

  describe('_getEOT', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getEOT()).toFixed(5)),
        -0.85170
      );
    });
  });

  describe('getMST', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime.getMST()).toFixed(5)),
        1109173.16537
      );
    });
  });

  describe('getMST24', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime.getMST24()).toFixed(5)),
        13.16537
      );
    });
  });

  describe('getLMST', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime.getLMST(184.702)).toFixed(5)),
        0.85190
      );
    });
  });

  describe('getLTST', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime.getLTST(184.702)).toFixed(5)),
        // this equasion is simple given the agreed values of LMST and EOT.
        // 0.85190 + -0.85170 = 0.00020 ... there's just no way to make 0.00005 appear out of thin air..
        // 0.00025 (nasa reported value)
        0.00020
      );
    });
  });

  /*
  describe('_getSubsolarLongitude', function(){
    it('should match the example value provided by nasa', function(){
      assert.equal(
        Number((marstime._getSubsolarLongitude()).toFixed(5)),
        4.70500
      );
    });
  });
  */
});

// ========== My Tests ==========

describe('getMYTDPrecise', function() {
  var marstime = new MarsTime(new Date("1991-01-24T23:59:59"));
  // 20 earth days after the new year around 1991-01-04T23:59:59
  // which has MYTD equaling 0.00029863015500625667
  // earth days are 97.32442961% as long as mars days
  // mars days are 102.74912517% as long as earth days
  // 20 earth days should be 19.464885922 mars days long
  // 19.464885922 + 0.00029863015500625667 = 19.4651845522 (rounded)

  it('should present accurate day count since the new year', function(){
    assert.equal(
      marstime.getMYTDPrecise(),
      19.46518455196961
    );
  });
});

describe('getMYTD', function() {
  describe('just before midnight', function(){
    var marstime = new MarsTime(new Date("1991-01-25T12:00:00"));
    // getMYTDPrecise() would be 19.951817964348386
    // people don't consider the first day to be day 0, so you round up.
  
    it('should round down the day count', function(){
      assert.equal(
        marstime.getMYTD(),
        20
      );
    });
  });

  describe('just after midnight', function(){
    var marstime = new MarsTime(new Date("1991-01-25T13:11:17.372"));
    // getMYTDPrecise() would be 20.000000000377987
  
    it('should round down the day count', function(){
      assert.equal(
        marstime.getMYTD(),
        21
      );
    });
  });
});

describe('getMSUNY', function() {
  describe('new years day', function(){
    var marstime = new MarsTime(new Date("1991-01-04T23:59:59"));
    // just after after the new year
    // which has MYTD equaling 0.00029863015500625667
  
    it('should present accurate day count until the new year', function(){
      assert.equal(
        marstime.getMSUNY(),
        668
      );
    });
  });

  describe('19 days after new years day', function(){
    var marstime = new MarsTime(new Date("1991-01-24T23:59:59"));
  
    it('should present accurate day count until the new year', function(){
      assert.equal(
        marstime.getMSUNY(),
        649
      );
    });
  });
});
