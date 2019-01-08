const fs = require('fs');

const monthlySales = require('../data/monthly-sales.json');
const fishTypeNames =  ["fw", "fwanabantoid", "fwangelfish", "fwapisto", "fwarowana", "fwbettas", "fwbettasct", "fwbettasd", "fwbettasdt", "fwbettashm", "fwbettashmp", "fwbettasvt", "fwbettaswt", "fwcatfish", "fwcatfishc", "fwcatfishl", "fwcatfishp", "fwcharacins", "fwcichlidc", "fwcichlidsm", "fwcichlidsmh", "fwcichlidsmmb", "fwcichlidsmp", "fwcichlidso", "fwcichlidst", "fwcichlidsv", "fwcichlidsw", "fwcyprinids", "fwdiscus", "fwflowerhorn", "fwgoldfish", "fwguppies", "fwinverts", "fwkillifish", "fwkillifishe", "fwkoi", "fwlivebearers", "fwlivebearersw", "fwmixed", "fwrainbows", "fwsnails", "fwstringray", "fwusnative", "timestamp"]
const d3 = require("d3-time-format");
const _ = require("lodash")



let findHighestVolume = (monthlySales) => {
	let volumeObj = {};
	fishTypeNames.forEach((fishTypeName) => {
	  console.log(fishTypeName)
	  volumeObj[fishTypeName] = 0
	})

	_.forEach(monthlySales, (monthObj, month) => {
		//console.log(month)
		_.forEach(monthlySales[month],(dayObj, day) => {
			//console.log(day)
			//console.log(monthlySales[month][day]) // obj with hash
			let hash = Object.keys(monthlySales[month][day])[0]
			//console.log(hash)
			_.forEach(monthlySales[month][day][hash].allAuctions, (sales, fishType) => {
				//console.log(fishType)
				_.forEach(monthlySales[month][day][hash].allAuctions[fishType], (saleObj, saleIndex) => {
				  //console.log(saleObj)
				 //console.log(parseFloat(saleObj.bPrice.replace(/\$/g, '')))
				  if(saleObj.bPrice != "---" && saleObj.reserveMet != "No Bids"){
				  	volumeObj[fishType]++
				  }
				 
				})
			})

		})

	})
	console.log(volumeObj)


	let sorted = [];
	for (let x in volumeObj) {
	    sorted.push([x, volumeObj[x]]);
	}

	sorted.sort(function(a, b) {
	    return a[1] - b[1];
	}).reverse();

	console.log(sorted)
	return sorted;
}

//findHighestVolume(monthlySales)

fs.writeFile('salesVolumes.json', JSON.stringify(findHighestVolume(monthlySales)), (err) => {  
    // throws an error, you could also catch it here
    if (err){
    	console.log(err)
    	throw err
    } 

    // success case, the file was saved
    console.log('Object Written!');
});