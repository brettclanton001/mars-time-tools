
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
const solsPerYear = 668.61883;

class MarsTime {

  constructor(earthUnixTimeInMilliseconds) {
    this.earthUnixTimeInMilliseconds = earthUnixTimeInMilliseconds;
    this.earthUnixDate = earthUnixTimeInMilliseconds / millisecondsPerDay;
    this.earthJulianDateUT = this._getEarthJulianDateUT();
    this.earthJulianDateTT = this._getEarthJulianDateTT();
    this.deltaTJ2000 = this._getDeltaTJ2000();
  }

  // ========== Public Methods ==========

  // Mean Solar Time
  getMST() {
    // mod24 { 24 h × ( [(JDTT - 2451549.5) / 1.0274912517] + 44796.0 - 0.0009626 ) }
    return 24 * (((this.earthJulianDateTT - 2451549.5) / 1.0274912517) + 44796.0 - 0.0009626);
  }

  getMST24() {
    return this.getMST() % 24;
  }

  // Get Mars Sol Date
  getMSD() {
    return this.getMST() / 24;
  }

  // Get Mars Year
  getMYPrecise() {
    var solOffsetFromMSDToYearZero = 28223.595537367528;
    return (this.getMSD() - solOffsetFromMSDToYearZero) / solsPerYear;
  }

  getMY() {
    return Math.floor(this.getMYPrecise());
  }

  getMYTDPrecise() {
    return (this.getMYPrecise() % 1) * solsPerYear;
  }

  getMYTD() {
    // the first day is considered day 1, not day 0
    // not using Math.ceil because 1.0000 should still
    // be the start of day 2
    return Math.floor(this.getMYTDPrecise()) + 1;
  }

  // Mars Sols Until New Years
  getMSUNY() {
    return Math.ceil(solsPerYear) - this.getMYTD();
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

  // Get Local Mean Solar Time.
  getLMST(planetographicLongitude) {
    // LMST = mod24 { MST - Λ (24 h / 360°) } = mod24 { MST - Λ (1 h / 15°) }
    var mst = this.getMST();
    var lmst = mst - planetographicLongitude * (24 / 360);
    return lmst % 24;
  }


  // Get Local True Solar Time
  getLTST(planetographicLongitude) {
    // LTST = LMST + EOT (24 h / 360°) = LMST + EOT (1 h / 15°)
    var lmst = this.getLMST(planetographicLongitude);
    var eot = this._getEOT();
    return lmst + eot;
  }

  // ========== "Private" Methods ==========

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

  _getEarthJulianDateUT() {
    // JDUT = 2440587.5 + (millis / 8.64×107 ms/day)
    var julianDateOffsetFromUnix = 2440587.5;
    return julianDateOffsetFromUnix + this.earthUnixDate;
  }

  _getEarthJulianDateTT() {
    // JDTT = JDUT + [(TT - UTC) / 86400 s·day-1]
    return this.earthJulianDateUT + this._getTerrestrialTimeOffsetInDays();
  }

  _getDeltaTJ2000() {
    // ΔtJ2000 = JDTT - 2451545.0
    return this.earthJulianDateTT - 2451545.0;
  }

  _getMarsMeanAnomalyDegrees() {
    // M = 19.3871° + 0.52402073° ΔtJ2000
    var m = 19.3871 + (0.52402073 * this.deltaTJ2000);
    return m % 360;
  }

  _getAngleOfFictionMeanSunDegrees() {
    // αFMS = 270.3871° + 0.524038496° ΔtJ2000
    var a = 270.3871 + (0.524038496 * this.deltaTJ2000);
    return a % 360;
  }

  _getPerturbersDegrees() {
    // PBS = Σ(i=1,7) Ai cos [ (0.985626° ΔtJ2000 / τi) + φi]
    var ai = [0.0071, 0.0057, 0.0039, 0.0037, 0.0021, 0.0020, 0.0018];
    var ti = [2.2353, 2.7543, 1.1177, 15.7866, 2.1354, 2.4694, 32.8493];
    var oi = [49.409, 168.173, 191.837, 21.736, 15.704, 95.528, 49.095];
    var s = 0;
    var orbitalDegreesPerEarthDay = 0.9856262833675564; // 360 / 365.25 -- examples only included 6 decimal places
    for(let i = 0; i < 7; i++) {
      s += ai[i] * this._cos(((orbitalDegreesPerEarthDay * this.deltaTJ2000) / ti[i]) + oi[i]);
    }
    return s;
  }

  _getEquationOfCenter() {
    // ν - M = (10.691° + 3.0° × 10-7 ΔtJ2000) sin M + 0.623° sin 2M + 0.050° sin 3M + 0.005° sin 4M + 0.0005° sin 5M + PBS
    var m = this._getMarsMeanAnomalyDegrees();
    var s = 0;
    s += (10.691 + 3.0 * 0.0000001 * this.deltaTJ2000) * this._sin(m);
    s += 0.623 * this._sin(2 * m);
    s += 0.050 * this._sin(3 * m);
    s += 0.005 * this._sin(4 * m);
    s += 0.0005 * this._sin(5 * m);
    s += this._getPerturbersDegrees();
    return s;
  }

  // Get  Equation of Time
  _getEOT() {
    // EOT = 2.861° sin 2Ls - 0.071° sin 4Ls + 0.002° sin 6Ls - (ν - M)
    var ls = this._getAreocentricSolarLongitude();
    var eot = 2.861 * this._sin(2 * ls);
    eot -= 0.071 * this._sin(4 * ls);
    eot += 0.002 * this._sin(6 * ls);
    eot -= this._getEquationOfCenter();
    return eot * (24/360);
  }

  _getAreocentricSolarLongitude() {
    // Ls = αFMS + (ν - M)
    var l = this._getAngleOfFictionMeanSunDegrees() + this._getEquationOfCenter();
    return l % 360;
  }

  // ========== Helper Methods ==========

  // cosine returns radians in JS, but the scientific equations expect degrees
  _cos(value) {
    return Math.cos(value * (Math.PI / 180));
  }

  // sine returns radians in JS, but the scientific equations expect degrees
  _sin(value) {
    return Math.sin(value * (Math.PI / 180));
  }

  _formatTwoDigit(num) {
    var numString = num.toString();
    if(num < 10) {
      return "0" + numString;
    } else {
      return numString;
    }
  }
 }

module.exports = {
  MarsTime: MarsTime
}
