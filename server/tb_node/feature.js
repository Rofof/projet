
var mysql      = require('mysql');

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'oatic',
  password : 'oatic',
  database : 'bdd_tb_stub'
});
connection.connect(function(err) {
  // connected! (unless `err` is set)
  console.log("CONFIG connect callabck param ==> " + err);

});

var Feature_Get1 = function(req, res) {
	console.log('Feature_Get1 [' + req.params.id + ']');
	res.writeHead(200, {'Content-Type': 'application/javascript'});
	  
	connection.query('call getTable(\'' + req.params.id + '\');', function(err, rows) {
		//console.log(err);

		var result;
		  
		if (!err) {

			result = { 'result' : 'success', 'data' : rows[0]};
			
		
		}
		else {
			console.log("Query error ==> " + err);
			result = { 'result' : 'failure'};
		}

		res.end(JSON.stringify(result));

	});

} // end of Feature_Get1
//recuperer liste ressource dans unite
var Feature_Get2 = function(req, res) {
	console.log('Feature_Get2 [' + req.params.id + ']');
	res.writeHead(200, {'Content-Type': 'application/javascript'});

	var resultat;
	  
	connection.query('select * from ressources', function(err, rows) {
		console.log(err);

		var result;
		console.log(rows);
		  
		if (!err) {

			//for (var i in rows) {result+=rows[i]};

			result = { 'result' : 'success', 'ressource' : rows[0], 'ressources' : [rows[1],rows[2],rows[3]]};
			
		
		}
		else {
			console.log("Query error ==> " + err);
			result = { 'result' : 'failure'};
		}

		res.end(JSON.stringify(result));

	});

} // end of Feature_Get2
//recuperer parcours
var Feature_Get3 = function(req, res) {
	console.log('Feature_Get3');
	res.writeHead(200, {'Content-Type': 'application/javascript'});

	var resultat;
	  
	connection.query('select p.unitId,u.title,u.url from parcours p join unit u on p.unitId=u.unitId', function(err, rows) {
		console.log(err);

		var result;
		console.log(rows);
		  
		if (!err) {

			//for (var i in rows) {result+=rows[i]};

			result = { 'result' : 'success', 'unite' : rows};
			
		
		}
		else {
			console.log("Query error ==> " + err);
			result = { 'result' : 'failure'};
		}

		res.end(JSON.stringify(result));

	});

} // end of Feature_Get3
//recuperer les competences
var Feature_GetCompetency = function(req, res) {
	console.log('Feature_GetCompetency [' + req.params.id + ']');
	res.writeHead(200, {'Content-Type': 'application/javascript'});
	  
	connection.query('select name from competency where resId=' + req.params.id , function(err, rows) {
		//console.log(err);

		var result;
		  
		if (!err) {

			result = { 'result' : 'success', 'data' : rows};
			
		
		}
		else {
			console.log("Query error ==> " + err);
			result = { 'result' : 'failure'};
		}

		res.end(JSON.stringify(result));

	});

} // end of Feature_GetCompetency

var Feature_GetWorkDone = function(req, res) {
	console.log('Feature_GetCompetency [' + req.params.id + ']');
	res.writeHead(200, {'Content-Type': 'application/javascript'});
	  
	connection.query('select state from work_done where resId=' + req.params.id , function(err, rows) {
		//console.log(err);

		var result;
		  
		if (!err) {

			result = { 'result' : 'success', 'data' : rows[0]};
			
		
		}
		else {
			console.log("Query error ==> " + err);
			result = { 'result' : 'failure'};
		}

		res.end(JSON.stringify(result));

	});

} // end of Feature_GetCompetency

var Feature_Post1 = function(req, res) {
	console.log('Feature_Post1 [' + req.params.id + '] : ' + req.body);
	res.writeHead(200, {'Content-Type': 'application/javascript'});
	  
	connection.query('call SetTable(\'' + req.params.id + '\',\'' + req.body.value + '\');', function(err, rows) {
		//console.log(err);

		var result; 
		  
		if (!err) {

			result = { 'result' : 'success'};
			
		
		}
		else {
			console.log("Query error ==> " + err);
			result = { 'result' : 'failure'};
		}
		  
		res.end(JSON.stringify(result));

	});

} // end of Feature_Post1



exports.Feature_Get1 = Feature_Get1;
exports.Feature_Get2 = Feature_Get2;
exports.Feature_Post1 = Feature_Post1;
exports.Feature_Get3 = Feature_Get3;
exports.Feature_GetCompetency = Feature_GetCompetency;
exports.Feature_GetWorkDone = Feature_GetWorkDone;
