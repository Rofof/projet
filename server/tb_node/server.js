var http = require('http');
var fs = require('fs');
var express = require('express');

var feature = require('./feature.js');

var app = express();

app.configure(function() {
  app.use(express.bodyParser({ uploadDir : '/var/www/tmp'}));
  app.use(app.router);
});

http.createServer(app).listen('8111');


app.all('*', function(req, res, next) {
  //console.log(req);

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', '*');     
  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', '*');
  
  if('OPTIONS' == req.method) return res.send(200);

  next();
});

app.post('/platoatic/p1/:id', feature.Feature_Post1)
  .get('/platoatic/g1/:id', feature.Feature_Get1)
  .get('/platoatic/g2/:id', feature.Feature_Get2)
  .get('/platoatic/parcours/:id', feature.Feature_Get3)
  .get('/platoatic/competency/:id',feature.Feature_GetCompetency)
  .get('/platoatic/unite/:id',feature.Feature_GetUnit)
  .get('/platoatic/workdone/',feature.Feature_GetWorkDone);
