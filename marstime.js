

var earthUnixTimeInMilliseconds = Date.now();
// var earthUnixTimeInMilliseconds = new Date("2022-11-25T06:51:07"); // for testing
var millisecondsPerDay = 86400000; // 24*60*60*1000
var secondsPerDay = 86400; // 24*60*60
var earthUnixDate = earthUnixTimeInMilliseconds / millisecondsPerDay;

// https://www.giss.nasa.gov/tools/mars24/help/algorithm.html
// 2440587.5 + (millis / 8.64×10^7 ms/day)
var julianDateUT = 2440587.5 + earthUnixDate;
var roughTerrestrialTimeOffsetInSeconds = (earthUnixDate / 365) / 1.5; // 35.29001917385422 for test datetime
 // use 37 until calculated value is greater
if (roughTerrestrialTimeOffsetInSeconds < 37) { roughTerrestrialTimeOffsetInSeconds = 37; }
var roughTerrestrialTimeOffsetInDays = roughTerrestrialTimeOffsetInSeconds / secondsPerDay;
var julianDateTT = julianDateUT + roughTerrestrialTimeOffsetInDays;

// Calculate MSD
var marsSolDate = (julianDateUT + (roughTerrestrialTimeOffsetInSeconds / secondsPerDay) - 2405522.0025054) / 1.0274912517;

// Hour
var coordinatedMarsTimeInHours = (marsSolDate % 1) * 24;
var mtcHour = Math.floor(coordinatedMarsTimeInHours);
if(mtcHour < 10) { mtcHour = "0" + mtcHour; }

// Minute
var coordinatedMarsTimeInMinutes = (coordinatedMarsTimeInHours % 1) * 60;
var mtcMinute = Math.floor(coordinatedMarsTimeInMinutes);
if(mtcMinute < 10) { mtcMinute = "0" + mtcMinute; }

// Second
var coordinatedMarsTimeInSeconds = (coordinatedMarsTimeInMinutes % 1) * 60;
var mtcSecond = Math.floor(coordinatedMarsTimeInSeconds);
if(mtcSecond < 10) { mtcSecond = "0" + mtcSecond; }

// MTC formatting
var coordinatedMarsTime = mtcHour + ":" + mtcMinute + ":" + mtcSecond;

console.log(julianDateTT);
console.log(marsSolDate);
console.log(coordinatedMarsTime);


/*
https://en.wikipedia.org/wiki/Timekeeping_on_Mars
For example, at the time this page was last generated (25 Nov 2022, 06:51:07 UTC):
        2459908.7859259257
JDTT =  2459908.7863
        
        52931.626746740396
MSD =   52931.62675

        15:02:30
MTC =   15:02:31
*/

