const fs = require('fs');

const dailyStats = require('../data/daily-stats.json');
const fishTypeNames =  ["fw", "fwanabantoid", "fwangelfish", "fwapisto", "fwarowana", "fwbettas", "fwbettasct", "fwbettasd", "fwbettasdt", "fwbettashm", "fwbettashmp", "fwbettasvt", "fwbettaswt", "fwcatfish", "fwcatfishc", "fwcatfishl", "fwcatfishp", "fwcharacins", "fwcichlidc", "fwcichlidsm", "fwcichlidsmh", "fwcichlidsmmb", "fwcichlidsmp", "fwcichlidso", "fwcichlidst", "fwcichlidsv", "fwcichlidsw", "fwcyprinids", "fwdiscus", "fwflowerhorn", "fwgoldfish", "fwguppies", "fwinverts", "fwkillifish", "fwkillifishe", "fwkoi", "fwlivebearers", "fwlivebearersw", "fwmixed", "fwrainbows", "fwsnails", "fwstringray", "fwusnative", "timestamp"]
const d3 = require("d3-time-format");
const _ = require("lodash")

fs.writeFile('yearLine.json', JSON.stringify(formatStatData(dailyStats)), (err) => {  
    // throws an error, you could also catch it here
    if (err){
    	console.log(err)
    	throw err
    } 

    // success case, the file was saved
    console.log('Object Written!');
});

function formatStatData(json){
	let yearLineObj = {};
    yearLineObj.marketStats = [];
    let maxPoint = 0;
    let parseTime = d3.timeParse("%b-%Y-%d-%a");
    let formatDate = d3.timeFormat("%B %d");
    console.log(fishTypeNames)
	/* Format data, each line/category must be an entry in the array */
	_.forEach(json.stats, function(objectDay, date){
		/* Within a particular day*/
    	//console.log(date +" + "+ JSON.stringify(objectDay))
        let numOfFishTypes = fishTypeNames.length;
    	date = parseTime(date);
        let runningTotalAvg = 0;
        let runningTotalStdDev = 0;
        let runningTotalSales = 0;
    	// console.log(date) correct

    	_.forEach(fishTypeNames, function(fishTypeName, index){
    		/* Within a particular fish type*/
    		// Just leave if its the timestamp
    		//console.log(fishTypeName)
    		//console.log(index)
    		if(fishTypeName === "timestamp"){ return;}
    		// Create the empty array if there isn't an array there yet
    		if(yearLineObj[fishTypeName] === undefined){
    			yearLineObj[fishTypeName] = [];
    		}

    		let avg = objectDay[fishTypeName].avg;
            // Check the max point for y domain
            if(avg > maxPoint){ maxPoint = avg;}

            // Create stats
    		let item = fishTypeName;
    		let currentDate = date;
    		let stdDev = objectDay[fishTypeName].stdDev;
    		let salesVolume = objectDay[fishTypeName].salesVolume;

    		lineFishTypeObj = {
		        "avg": avg,
		        "item": item,
		        "stdDev": stdDev,
		        "date": currentDate,
		        "salesVolume": salesVolume
		     };
            // Add that days stats to the array for the fishtype within the 30day obj
			yearLineObj[fishTypeName].push(lineFishTypeObj);
            // For the averages of averages, add to the running total
            runningTotalAvg += avg;
            runningTotalStdDev += stdDev;
            runningTotalSales += salesVolume;
    	});
         // Create the market averages for the day
        let dayAvg = runningTotalAvg/numOfFishTypes;
        let dayStdDev = runningTotalStdDev/numOfFishTypes;
        let daySalesVol = runningTotalSales/numOfFishTypes;
        // Add the stats to the day
        yearLineObj.marketStats.push({avg:+dayAvg.toFixed(2), item:"Market Stats", date:date, stdDev:+dayStdDev.toFixed(2), salesVolume:+daySalesVol.toFixed(2)});
       
      });
	yearLineObj.maxPoint = maxPoint;
	console.log(maxPoint)
    return yearLineObj;
}

