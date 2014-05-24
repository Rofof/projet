
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

var Feature_Get2 = function(req, res) {
	console.log('Feature_Get2 [' + req.params.id + ']');
	res.writeHead(200, {'Content-Type': 'application/javascript'});
	  
	connection.query('select * from ressources where id=' + req.params.id, function(err, rows) {
		console.log(err);

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

} // end of Feature_Get2

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
exports.Feature_Get1 = Feature_Get2;
exports.Feature_Post1 = Feature_Post1;
