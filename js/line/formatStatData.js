function formatStatData(json){
    console.log(json)
    // import fishTypeNames from "../data/fishTypeNames"
	let yearLineObj = {};
    yearLineObj.marketStats = [];
    let maxPoint = 0;
    let parseTime = d3.timeParse("%b-%Y-%d-%a");
    let formatDate = d3.timeFormat("%B %d");

	/* Format data, each line/category must be an entry in the array */
	$.each(json.stats, function(date, objectDay){
		/* Within a particular day*/
    	//console.log(date +" + "+ JSON.stringify(objectDay))
    	//let fishTypeNames = Object.keys(objectDay); // array of just the names, doesnt need to run in this loop
        let numOfFishTypes = fishTypeNames.length;
    	date = parseTime(date);
        let runningTotalAvg = 0;
        let runningTotalStdDev = 0;
        let runningTotalSales = 0;
    	//console.log(date)

    	$.each(fishTypeNames, function(index, fishTypeName){
    		/* Within a particular fish type*/
    		// Just leave if its the timestamp
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
    console.log(yearLineObj)
    console.log(maxPoint)
    makeLineGraph(yearLineObj, maxPoint);
}
