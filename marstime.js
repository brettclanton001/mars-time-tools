
const millisecondsPerDay = 86400000; // 24*60*60*1000
const secondsPerDay = 86400; // 24*60*60
const marsTimeMultiplier = 1.0274912517; // a Mars second is 2.75% longer than an Earth second
const leapSeconds = {
  78796799000: 11,    // 1972-06-30T23:59:59
  94694399000: 12,    // 1972-12-31T23:59:59
  126230399000: 13,   // 1973-12-31T23:59:59
  157766399000: 14,   // 1974-12-31T23:59:59
  189302399000: 15,   // 1975-12-31T23:59:59
  220924799000: 16,   // 1976-12-31T23:59:59
  252460799000: 17,   // 1977-12-31T23:59:59
  283996799000: 18,   // 1978-12-31T23:59:59
  315532799000: 19,   // 1979-12-31T23:59:59
  362793599000: 20,   // 1981-06-30T23:59:59
  394329599000: 21,   // 1982-06-30T23:59:59
  425865599000: 22,   // 1983-06-30T23:59:59
  489023999000: 23,   // 1985-06-30T23:59:59
  567993599000: 24,   // 1987-12-31T23:59:59
  631151999000: 25,   // 1989-12-31T23:59:59
  662687999000: 26,   // 1990-12-31T23:59:59
  709948799000: 27,   // 1992-06-30T23:59:59
  741484799000: 28,   // 1993-06-30T23:59:59
  773020799000: 29,   // 1994-06-30T23:59:59
  820454399000: 30,   // 1995-12-31T23:59:59
  867715199000: 31,   // 1997-06-30T23:59:59
  915148799000: 32,   // 1998-12-31T23:59:59
  1136073599000: 33,  // 2005-12-31T23:59:59
  1230767999000: 34,  // 2008-12-31T23:59:59
  1341100799000: 35,  // 2012-06-30T23:59:59
  1435708799000: 36,  // 2015-06-30T23:59:59
  1483228799000: 37   // 2016-12-31T23:59:59
};

class MarsTime {

  constructor(earthUnixTimeInMilliseconds) {
    this.earthUnixTimeInMilliseconds = earthUnixTimeInMilliseconds;
    this.earthUnixDate = earthUnixTimeInMilliseconds / millisecondsPerDay;
    this.earthJulianDateUT = this._getEarthJulianDateUT();
    this.earthJulianDateTT = this._getEarthJulianDateTT();
  }

  _getTerrestrialTimeOffsetInSeconds() {
    var additionalTTValue = 32.184;
    var ttTimeOffsetSeconds = 0;
    for (const [key, value] of Object.entries(leapSeconds)) {
      if (key <= this.earthUnixTimeInMilliseconds) {
        ttTimeOffsetSeconds = value;
      }
    }
    return ttTimeOffsetSeconds + additionalTTValue;
  }

  _getTerrestrialTimeOffsetInDays() {
    return this._getTerrestrialTimeOffsetInSeconds() / secondsPerDay;
  }

  _getEarthJulianDateTT() {
    return Number((this.earthJulianDateUT + this._getTerrestrialTimeOffsetInDays()).toFixed(5));
  }

  _getEarthJulianDateUT() {
    var julianDateOffsetFromUnix = 2440587.5;
    return Number((julianDateOffsetFromUnix + this.earthUnixDate).toFixed(5));
  }

  _getDeltaTJ2000() {
    return Number((this._getEarthJulianDateTT() - 2451545.0).toFixed(5));
  }

  _getMarsMeanAnomalyDegrees() {
    return Number((19.3871 + (0.52402073 * this._getDeltaTJ2000())).toFixed(5));
  }

  _getAngleOfFictionMeanSunDegrees() {
    return Number((270.3871 + (0.524038496 * this._getDeltaTJ2000())).toFixed(5));
  }

  _getPerturbersDegrees() {
    // Σ(i=1,7) Ai cos [ (0.985626° ΔtJ2000 / τi) + φi]
    var ai = [0.0071, 0.0057, 0.0039, 0.0037, 0.0021, 0.0020, 0.0018];
    var ti = [2.2353, 2.7543, 1.1177, 15.7866, 2.1354, 2.4694, 32.8493];
    var oi = [49.409, 168.173, 191.837, 21.736, 15.704, 95.528, 49.095];
    var summedValue = 0;
    for(let i = 0; i < 7; i++) {
      summedValue += ai[i] * Math.cos(((0.985626 * this._getDeltaTJ2000()) / ti[i]) + oi[i]);
    }
    return summedValue;
  }

  // Get Mars Sol Date
  getMSD() {
    var mysteryAdjustment = 2405522.0025054;
    return (this.earthJulianDateTT - mysteryAdjustment) / marsTimeMultiplier;
  }

  getMY() {
    var solsPerYear = 668.61883;
    var solOffsetFromMSDToYearZero = 28223.59595415963;
    return Math.floor((this.getMSD() - solOffsetFromMSDToYearZero) / solsPerYear);
  }

  _formatTwoDigit(num) {
    var numString = num.toString();
    if(num < 10) {
      return "0" + numString;
    } else {
      return numString;
    }
  }

  // Get Coordinated Mars Time
  getMTC() {
    // Hour
    var coordinatedMarsTimeInHours = (this.getMSD() % 1) * 24;
    var mtcHour = Math.floor(coordinatedMarsTimeInHours);
    // Minute
    var coordinatedMarsTimeInMinutes = (coordinatedMarsTimeInHours % 1) * 60;
    var mtcMinute = Math.floor(coordinatedMarsTimeInMinutes);
    // Second
    var coordinatedMarsTimeInSeconds = (coordinatedMarsTimeInMinutes % 1) * 60;
    var mtcSecond = Math.floor(coordinatedMarsTimeInSeconds);
    // MTC formatting
    var coordinatedMarsTime = 
      this._formatTwoDigit(mtcHour) + ":" + 
      this._formatTwoDigit(mtcMinute) + ":" +
      this._formatTwoDigit(mtcSecond);
    return coordinatedMarsTime;
  }
}

module.exports = {
  MarsTime: MarsTime
}
