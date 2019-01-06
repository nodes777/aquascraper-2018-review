var monthAndYear = getCurrentMonth();
var today = getCurrentDay();

formatStatData(dailyStats)

function processTodayJson(json){
  // get the sold and allAuctions as one object. Skipping the messy name Firebase creates
  var jsonPruned = json[Object.keys(json)[0]];

  var soldItems = getSoldItems(jsonPruned.allAuctions);

  makeStatsGraph(soldItems);

  makeCategoryGraphs(soldItems);

  $("#currentDay").append(getReadableDate(today, monthAndYear));
  // var databasePortfolio = firebase.database().ref("users/" + id);
  // console.log(databasePortfolio)
  // updatePortfolio(databasePortfolio);
  prepTransactions();
}


function getSoldItems(objOfObjs){

    var objOfSold = {};

    $.each(objOfObjs, function( key, value ) {
        var soldItems = value.filter(function(fishSale){
            return fishSale.reserveMet === "Yes";
        });
        objOfSold[key] = soldItems;
    });
   return objOfSold;
}
