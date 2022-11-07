const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
var jsforce  = require('jsforce');

// defining the Express app
const app = express();
// defining an array to work as the database (temporary solution)
const ads = [
  {title: 'Hello, world (again)!'}
];

// adding Helmet to enhance your Rest API's security
app.use(
    helmet({
      contentSecurityPolicy: false,
    })
  );
// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan('combined'));

// defining an endpoint to return all ads
app.post('/getRecords/*', function(req, res){
      var conn = new jsforce.Connection({
        // you can change loginUrl to connect to sandbox or prerelease env.
        // loginUrl : 'https://test.salesforce.com'
      }); 
      if(req.body.username != null && req.body.password != null){
        conn.login(req.body.username, req.body.password, function(err, userInfo) {
          if (err) { return console.error(err); }
          let url = decodeURI(req.url);
          let query =url.substring(url.lastIndexOf('/')+1);
          conn.query(query, function(err, result) {
            if (err) { return console.error(err); }
            console.log("total : " + result.totalSize);
            console.log("fetched : " + result.records.length);
            res.send({"records" : result.records});
          });
        });
      }
});
app.post('/getAccessToken', function(req, res){
  console.log(req.body)
    var conn = new jsforce.Connection({
      // you can change loginUrl to connect to sandbox or prerelease env.
      // loginUrl : 'https://test.salesforce.com'
    }); 
    if(req.body.username != null && req.body.password != null){
      conn.login(req.body.username, req.body.password, function(err, userInfo) {
        if (err) { return console.error(err); }
        res.send({"access_token" : conn.accessToken});
      });
    }
});
app.get('/', function (req, res){
  res.send('Salesfroce Connected');
});
// starting the server
app.listen(3001, () => {
  console.log('listening on port 3001');
});