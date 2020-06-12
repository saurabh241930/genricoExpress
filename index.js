var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var cors = require('cors');






var auth = {
  host: "127.0.0.1",
    user: "root",
    password: "password",
    database:"sales"
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/panelTwo",function(req,res){
	//var todayDate = '2018-10-31'
	//var startDate = '2018-10-01'
  var today = new Date();

var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) {
    dd = '0'+dd
} 
if(mm<10) {
    mm = '0'+mm
} 
todayDate =  yyyy + '-' + mm + '-' + dd;
var parts = todayDate.split("-")
var startDateParts = [parts[0],parts[1],'01']
var startDate = startDateParts.join("-")

var lastMonthFirstDateParts = [parts[0],parseInt(parts[1]) + 1,'01']
var lastMonthEndDateParts = [parts[0],parseInt(parts[1]) + 1 ,parts[2]]

var lastMonthFirstDate = lastMonthFirstDateParts.join("-")
var lastMonthEndDate = lastMonthEndDateParts.join("-")

console.log(lastMonthFirstDate)
console.log(lastMonthEndDate)



 var con = mysql.createConnection(auth);
				con.connect(function(err){
					if(err){
						console.log("Database error");
						res.json({"status" : "failure", "message" : "DB error"});
						con.end();
					}
					else{
           // var sqlqry = "SELECT `sales-store-id`,(SUM (`gen-acute-sales-after-returns`) + SUM(`gen-chronic-sales-after-returns`)) AS `totalGenericSales` ,(SUM (`eth-acute-sales-after-returns`) + SUM(`eth-chronic-sales-after-returns`) + SUM(`others-sales-after-returns`)) AS `totalEthicalSales`, SUM(`sales-after-returns`) AS `totalSales` FROM `sales` WHERE `date-s` BETWEEN '"+startDate+"' AND '"+todayDate+"' GROUP BY `sales-store-id`";

            var sqlqry = "SELECT `sales-store-id`,SUM(CASE WHEN `date-s` BETWEEN '"+startDate+"' AND '"+todayDate+"' THEN `gen-chronic-sales-after-returns` + `gen-acute-sales-before-returns` END) AS `totalGenericSales`,SUM(CASE WHEN `date-s` BETWEEN '"+startDate+"' AND '"+todayDate+"' THEN `eth-acute-sales-after-returns` + `eth-chronic-sales-before-returns` + `others-sales-after-returns` END) AS `totalEthicalSales`,SUM(CASE WHEN `date-s` BETWEEN '"+startDate+"' AND '"+todayDate+"' THEN `sales-after-returns` END) AS `totalSales`,SUM(CASE WHEN `date-s` BETWEEN '"+lastMonthFirstDate+"' AND '"+lastMonthEndDate+"' THEN `gen-chronic-sales-after-returns` END) AS `totalGenericSalesPM`,SUM(CASE WHEN `date-s` BETWEEN '"+lastMonthFirstDate+"' AND '"+lastMonthEndDate+"' THEN `eth-acute-sales-after-returns` + `eth-chronic-sales-before-returns` + `others-sales-after-returns` END) AS `totalEthicalSalesPM`,SUM(CASE WHEN `date-s` BETWEEN '"+lastMonthFirstDate+"' AND '"+lastMonthEndDate+"' THEN `sales-after-returns` END) AS `totalSalesPM` FROM `sales` GROUP BY `sales-store-id`";
						console.log(sqlqry);
						con.query(sqlqry, function(err, result){
							if(err){
								console.log("Database error fetching results");
								res.json({"status" : "failure", "message" : "DB error fetching results"});
								con.end();
							}
							else{
								console.dir(result);
								res.json(result);
								con.end();
							} 
								
						})
					}
  			
			});
})



router.get("/panelOne/:startDate/:endDate",function(req,res){
	res.set({'content-type' : 'application/json; charset=utf-8'});
	res.header({'Content-Type' : 'application/json; charset=utf-8'});
	res.charset = 'utf-8';
	res.header('Access-Control-Allow-Origin', '*');
	console.log("received request");
	var con = mysql.createConnection(auth);
	con.connect(function(err){
		if(err){			
			console.log(err);
			con.end();
		}
		else{
			var sqlqry = "SELECT (SUM (`gen-acute-sales-after-returns`) + SUM(`gen-chronic-sales-after-returns`) + SUM (`gen-acute-sales-before-returns`) + SUM(`gen-chronic-sales-before-returns`)) AS `totalGenericPurchase`,SUM(`others-sales-after-returns`) AS `otherSales`,(SUM (`eth-acute-sales-after-returns`) + SUM(`eth-chronic-sales-after-returns`) + SUM (`eth-acute-sales-before-returns`) + SUM(`eth-chronic-sales-before-returns`)) AS `totalEthicalPurchase`,(SUM (`gen-acute-sales-after-returns`) + SUM(`gen-chronic-sales-after-returns`)) AS `totalGenericSales` ,(SUM (`eth-acute-sales-after-returns`) + SUM(`eth-chronic-sales-after-returns`) + SUM(`others-sales-after-returns`)) AS `totalEthicalSales`, SUM(`sales-after-returns`) AS `totalSales`,  AVG(`sales-after-returns`) AS `averageSales`,(SUM (`others-sales-after-returns`) + SUM(`others-sales-before-returns`)) AS `totalOtherPurchase`,(SUM (`sales-after-returns`) + SUM(`sales-before-returns`)) AS `totalPurchase`,AVG ((`sales-after-returns`) + (`sales-before-returns`)) AS `averagePurchase`,AVG ((`eth-chronic-sales-after-returns`) + (`eth-acute-sales-after-returns`)) AS `averageEthicalSales`,AVG ((`gen-chronic-sales-after-returns`) + (`gen-acute-sales-after-returns`)) AS `averageGenericSales`,AVG ((`gen-chronic-sales-after-returns`) + (`gen-acute-sales-after-returns`) + (`gen-chronic-sales-before-returns`) + (`gen-acute-sales-before-returns`)) AS `averageGenericPurchase`,AVG ((`eth-chronic-sales-after-returns`) + (`eth-acute-sales-after-returns`) + (`eth-chronic-sales-before-returns`) + (`eth-acute-sales-before-returns`)) AS `averageEthicalPurchase`,AVG ((`others-sales-after-returns`) + (`others-sales-before-returns`)) AS `averageOtherPurchase`,AVG (`others-sales-after-returns`) AS `averageOtherSales`,SUM (`eth-acute-profit-after-returns`) AS `totalGrossMargins`,AVG (`eth-acute-profit-after-returns`) AS `averageGrossMargins` FROM `sales` WHERE `date-s` BETWEEN '"+req.params.startDate+"' AND '"+req.params.endDate+"'";
				console.log(sqlqry);
			con.query(sqlqry, function(err, result){
				if(err){
					console.log(err);
					res.json({"status" : "failure", "message" : "DB error fetching results"});
					con.end();
				}
				else{
					// console.dir(result);
					res.json(result);
					con.end();
				} 
					
			})
		}
  
});
})

router.get("/panel_one",function (req,res) {
  res.render("panel_one.ejs")
})

router.get("/panel_two",function (req,res) {
  res.render("panel_two.ejs")
})

router.get("/panel_three",function (req,res) {
  res.render("panel_three.ejs")
})

router.get("/panel_four",function (req,res) {
  res.render("panel_four.ejs")
})

router.get("/sensus_board",function (req,res) {
  res.render("sensus_board.ejs")
})

router.post("/storewise",function (req,res) {
	var con = mysql.createConnection(auth);
				con.connect(function(err){
					if(err){
						console.log("Database error");
						res.json({"status" : "failure", "message" : "DB error"});
						con.end();
					}
					else{

						var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; 
var yyyy = today.getFullYear();
if(dd<10) {
    dd = '0'+dd
} 
if(mm<10) {
    mm = '0'+mm
} 

todayDate =  yyyy + '-' + mm + '-' + dd;

var parts = todayDate.split("-")
var startDateParts = [parts[0],parts[1],'01']
var startDate = startDateParts.join("-")
var stores = req.body
var peices = stores.storesIds.split(",")
var storeString = peices.join("','")
												
var sqlqry = "SELECT `sales-store-id`,(SUM (`gen-acute-sales-after-returns`) + SUM(`gen-chronic-sales-after-returns`)) AS `totalGenericSales` ,(SUM (`eth-acute-sales-after-returns`) + SUM(`eth-chronic-sales-after-returns`) + SUM(`others-sales-after-returns`)) AS `totalEthicalSales`, SUM(`sales-after-returns`) AS `totalSales` FROM `sales` WHERE `sales-store-id` IN ('"+storeString+"') GROUP BY `sales-store-id`";                                   
					
						con.query(sqlqry, function(err, result){
							if(err){
								console.log("Database error fetching results");
								res.json({"status" : "failure", "message" : "DB error fetching results"});
								con.end();
							}
							else{
								console.dir(result);
								res.json(result);
								con.end();
							} 
								
						})
					}
  			
			});	
})

router.post('/get-data', function(req, res) {
  var date = req.body.date,
      store = req.body.store,
      time = req.body.hour;


var MongoClient = require("mongodb").MongoClient;
// var url = "mongodb://ian:secretPassword@13.232.224.45:27017/cool_db";
var url = "mongodb://saurabh:123456qwe@ds155086.mlab.com:55086/pictor"


MongoClient.connect(url, function (err, db) {
if (err) console.log(err);
var dbo = db.db("pictor");
var query = {'store' : store, 'day_folder' : date,'time':time};
console.log(query);
dbo.collection("pictor").find(query).toArray(function(err, result) {
  if (err) console.log(err);
  console.log(result);
res.send(result);
  db.close();
});
});

//    res.send(result);
});


router.get("/areaChart/:startDate/:endDate",cors(),function(req,res){
  res.set({'content-type' : 'application/json; charset=utf-8'});
  res.header({'Content-Type' : 'application/json; charset=utf-8'});
  res.charset = 'utf-8';
  res.header('Access-Control-Allow-Origin', '*');
  console.log("received request");
  var con = mysql.createConnection(auth);
  con.connect(function(err){
    if(err){			
      console.log(err);
      con.end();
    }
    else{
      var sqlqry = "SELECT SUM(`sales-after-returns`) AS `totalSalesAfterReturns`,SUM(`sales-before-returns`) AS `totalSalesBeforeReturns` FROM `sales` WHERE `date-s` BETWEEN '"+req.params.startDate+"' AND '"+req.params.endDate+"'";
        console.log(sqlqry);
      con.query(sqlqry, function(err, result){
        if(err){
          console.log(err);
          res.json({"status" : "failure", "message" : "DB error fetching results"});
          con.end();
        }
        else{
          // console.dir(result);
          res.json(result[0]);
          con.end();
        } 
          
      })
    }
  
});
})


router.get("/gauge/generic",function (req,res) {
  var con = mysql.createConnection(auth);
  con.connect(function(err){
    if(err){
      console.log("Database error");
      res.json({"status" : "failure", "message" : "DB error"});
      con.end();
    }
else{
var sqlqry = "SELECT SUM(`gen-acute-sales-before-returns`) AS genericgauge FROM sales ";
console.log(sqlqry);
con.query(sqlqry, function(err, result){
        if(err){
          console.log("Database error fetching results");
          res.json({"status" : "failure", "message" : "DB error fetching results"});
          con.end();
        }
        else{
          console.dir(result);
          res.json(result);
          con.end();
        } 
          
      })
    }
  
});
});

router.get("/gauge/ethical",function (req,res) {
  var con = mysql.createConnection(auth);
  con.connect(function(err){
    if(err){
      console.log("Database error");
      res.json({"status" : "failure", "message" : "DB error"});
      con.end();
    }
    else{
      var sqlqry = "SELECT SUM(`gen-acute-sales-before-returns`)/(SUM(`eth-acute-profit-after-returns`)+SUM(`gen-acute-sales-before-returns`)) * 100 AS ethicalgauge FROM sales  ";
      console.log(sqlqry);
      con.query(sqlqry, function(err, result){
        if(err){
          console.log("Database error fetching results");
          res.json({"status" : "failure", "message" : "DB error fetching results"});
          con.end();
        }
        else{
          console.dir(result);
          res.json(result);
          con.end();
        } 
          
      })
    }
  
});
});

router.get("/gauge/other",function (req,res) {
  var con = mysql.createConnection(auth);
  con.connect(function(err){
    if(err){
      console.log("Database error");
      res.json({"status" : "failure", "message" : "DB error"});
      con.end();
    }
    else{
      var sqlqry = "SELECT SUM(`others-sales-after-returns`) AS othergauge FROM sales ";
      console.log(sqlqry);
      con.query(sqlqry, function(err, result){
        if(err){
          console.log("Database error fetching results");
          res.json({"status" : "failure", "message" : "DB error fetching results"});
          con.end();
        }
        else{
          console.dir(result);
          res.json(result);
          con.end();
        } 
          
      })
    }
  
});
});



module.exports = router;
