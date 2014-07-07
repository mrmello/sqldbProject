	exports.listSysTables = function(ibmdb,connString) {
    return function(req, res) {

	   	   
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				conn.query("SELECT TABNAME FROM SYSCAT.TABLES where tabschema = 'U471342';", function(err, tables, moreResultSets) {
							
				if ( !err ) { 
					res.render('index', {
						"tablelist" : tables						
					 });

					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}
	
	exports.listSysTablesReq = function(ibmdb,connString) {
    return function(req, res) {

	   	   
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
				conn.query("SELECT TABNAME FROM SYSCAT.TABLES WHERE TABSCHEMA = 'U471342';", function(err, tables, moreResultSets) {
							
				if ( !err ) { 
					res.send({"tablelist" : tables });

					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}
		
	exports.retrieveTable = function(ibmdb,connString) {
    return function(req, res) {
	
		var tablename = req.body.option;		
		 
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
			    				
				conn.query("SELECT * FROM "+tablename, function(err, tabledata, moreResultSets) {
							
							
				if ( !err ) {
				
					res.send({"tabledata" : tabledata});
					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}
		
	exports.submitQuery = function(ibmdb,connString) {
    return function(req, res) {
	
		var query = req.body.query;	
	
		 
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
						
				conn.query(query, function(err, tabledata, moreResultSets) {
							
							
				if ( !err ) {
					
					res.send("Query Successful");
					
					
					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}
	
	exports.submitQueryWithResults = function(ibmdb,connString) {
    return function(req, res) {
	
		var query = req.body.query;	
	
		 
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
						
				conn.query(query, function(err, tabledata, moreResultSets) {
							
							
				if ( !err ) {
					
					res.send({"tabledata" : tabledata});					
					
					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}
	
	exports.retrieveDescription = function(ibmdb,connString) {
    return function(req, res) {
	
		var tablename = req.body.tablename;		
		 
       ibmdb.open(connString, function(err, conn) {
			if (err ) {
			 res.send("error occurred " + err.message);
			}
			else {
						
				var query = "select colname, typename from syscat.columns c, syscat.tables t  where c.tabname='"+tablename+"' and t.tabname='"+tablename+"'";

				
				conn.query(query, function(err, tabledata, moreResultSets) {
							
							
				if ( !err ) {
					res.send({"tabledata" : tabledata});
					
				} else {
				   res.send("error occurred " + err.message);
				}

				/*
					Close the connection to the database
					param 1: The callback function to execute on completion of close function.
				*/
				conn.close(function(){
					console.log("Connection Closed");
					});
				});
			}
		} );
	   
	}
	}