
const millisecondsPerDay = 86400000; // 24*60*60*1000
const secondsPerDay = 86400; // 24*60*60

class MarsClock {

        constructor(earthUnixTimeInMilliseconds) {
                this.earthUnixDate = earthUnixTimeInMilliseconds / millisecondsPerDay;
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
                // https://www.giss.nasa.gov/tools/mars24/help/algorithm.html
                var julianDateUT = 2440587.5 + this.earthUnixDate;
                return julianDateUT + this._getTerrestrialTimeOffsetInDays();
        }

        // Get Mars Sol Date
        getMSD() {
                return (this.earthJulianDateTT - 2405522.0025054) / 1.0274912517;
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

console.log('');
console.log('=== Current Time ===');
var marsClock = new MarsClock(Date.now());
console.log('       Total Sols: ' + marsClock.getMSD());
console.log('Current Mars Year: ' + marsClock.getMY());
console.log('Current Mars Time: ' + marsClock.getMTC());

function testingYearCalculations() {
        if(new MarsClock(new Date("1953-05-24T00:00:01")).getMY() != 0){ return false; }
        if(new MarsClock(new Date("1955-04-10T23:59:59")).getMY() != 0){ return false; }
        if(new MarsClock(new Date("1955-04-11T23:59:59")).getMY() != 1){ return false; }
        if(new MarsClock(new Date("1957-02-25T23:59:59")).getMY() != 1){ return false; }
        if(new MarsClock(new Date("1957-02-26T23:59:59")).getMY() != 2){ return false; }
        if(new MarsClock(new Date("1959-01-13T23:59:59")).getMY() != 2){ return false; }
        if(new MarsClock(new Date("1959-01-14T23:59:59")).getMY() != 3){ return false; }
        if(new MarsClock(new Date("1960-11-30T23:59:59")).getMY() != 3){ return false; }
        if(new MarsClock(new Date("1960-12-01T23:59:59")).getMY() != 4){ return false; }
        if(new MarsClock(new Date("1991-01-03T23:59:59")).getMY() != 19){ return false; }
        if(new MarsClock(new Date("1991-01-04T23:59:59")).getMY() != 20){ return false; }
        if(new MarsClock(new Date("2009-10-25T23:59:59")).getMY() != 29){ return false; }
        if(new MarsClock(new Date("2009-10-26T23:59:59")).getMY() != 30){ return false; }
        if(new MarsClock(new Date("2028-08-16T23:59:59")).getMY() != 39){ return false; }
        if(new MarsClock(new Date("2028-08-17T23:59:59")).getMY() != 40){ return false; }
        return true;
}

if(!testingYearCalculations()){
        console.log('');
        console.log('!!!!!! Date Tests Failing !!!!!!');
}

// https://en.wikipedia.org/wiki/Timekeeping_on_Mars
console.log('');
console.log('=== Calibration ===');
var testMarsClock = new MarsClock(new Date("2022-11-25T06:51:07"));
console.log('JDTT');
console.log('calculated: ' + testMarsClock._getEarthJulianDateTT());
console.log('     fixed: 2459908.7863');
console.log('MSD');
console.log('calculated: ' + testMarsClock.getMSD());
console.log('     fixed: 52931.62675');
console.log('MTC');
console.log('calculated: ' + testMarsClock.getMTC());
console.log('     fixed: 15:02:31');

