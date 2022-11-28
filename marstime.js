
const millisecondsPerDay = 86400000; // 24*60*60*1000
const secondsPerDay = 86400; // 24*60*60
const marsTimeMultiplier = 1.0274912517; // a Mars second is 2.75% longer than an Earth second

class MarsTime {

  constructor(earthUnixTimeInMilliseconds) {
    this.earthUnixDate = earthUnixTimeInMilliseconds / millisecondsPerDay;
    this.earthJulianDateUTC = this._getEarthJulianDateUTC();
    this.earthJulianDateTT = this._getEarthJulianDateTT();
  }

  _getTerrestrialTimeOffsetInDays() {
    // Attempt to calculate leap seconds dynamically
    var ttTimeOffsetSeconds = (this.earthUnixDate / 365) / 1.5;
    // fallback to official value if it's greater than my calculated value
    // https://www.timeanddate.com/time/leapseconds.html
    if (ttTimeOffsetSeconds < 37) {
      ttTimeOffsetSeconds = 37;
    }
    return ttTimeOffsetSeconds / secondsPerDay;
  }

  _getEarthJulianDateTT() {
    return this.earthJulianDateUTC + this._getTerrestrialTimeOffsetInDays();
  }

  _getEarthJulianDateUTC() {
    // Julian date of the epoch in days
    var julianDateOffsetFromUnix = 2440587.5;
    // https://www.giss.nasa.gov/tools/mars24/help/algorithm.html
    return julianDateOffsetFromUnix + this.earthUnixDate;
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

/*
console.log('');
console.log('=== Current Time ===');
var marsTime = new MarsTime(Date.now());
console.log('       Total Sols: ' + marsTime.getMSD());
console.log('Current Mars Year: ' + marsTime.getMY());
console.log('Current Mars Time: ' + marsTime.getMTC());
*/