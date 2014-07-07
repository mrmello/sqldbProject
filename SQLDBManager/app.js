var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var ibmdb = require('ibm_db');


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
var db2;

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

if (process.env.VCAP_SERVICES) {
    var env = JSON.parse(process.env.VCAP_SERVICES);
    db2 = env['SQLDB-1.0'][0].credentials;
}
else {
   db2 = {
        db: "BLUDB",
        hostname: "xxxx",
        port: 50000,
        username: "xxx",
        password: "xxx"
     };
}

var connString = "DRIVER={DB2};DATABASE=" + db2.db + ";UID=" + db2.username + ";PWD=" + db2.password + ";HOSTNAME=" + db2.hostname + ";port=" + db2.port;

app.get('/', routes.listSysTables(ibmdb,connString));
app.post('/retrieveTable', routes.retrieveTable(ibmdb, connString));
app.post('/submitQuery', routes.submitQuery(ibmdb, connString));
app.post('/submitQueryWithResults', routes.submitQueryWithResults(ibmdb, connString));
app.post('/retrieveDescription', routes.retrieveDescription(ibmdb, connString));
app.post('/existingTables', routes.listSysTablesReq(ibmdb, connString));


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});