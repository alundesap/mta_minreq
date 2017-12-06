/*eslint no-console: 0*/
"use strict";

var express = require('express');
var xsenv = require('@sap/xsenv');
var passport = require('passport');
//var xssec = require("@sap/xssec");
var JWTStrategy = require('@sap/xssec').JWTStrategy;

var LoggingLib = require('@sap/logging');

var app = express();

//var appContext = LoggingLib.createAppContext({ logLocation: '/hana/shared/HXE/xs/bin/../controller_data/fss/d51f160a-6381-4c5b-a0d4-04f64135d27a/logfile.log'});
var appContext = LoggingLib.createAppContext();

//appContext.setLevel('/Application/*', 'info');	// Used for events that do not need any follow up activity. They show the normal operations within an app.
//appContext.setLevel('/Application/*', 'warning'); // Used for events that need follow up activity in order to prevent errors in the future.
//appContext.setLevel('/Application/*', 'error'); // Used when the desired tasks cannot be completed and the application is still usable.
//appContext.setLevel('/Application/*', 'fatal'); // Used in case of errors, because of which the application is no longer usable.

// xs set-env XSA_DEV-7vpve87n009ruble-mta_minreq-js XS_APP_LOG_LEVEL info

app.use(LoggingLib.expressMiddleware(appContext));

//var services = xsenv.getServices({ hana:'hana', uaa:'xsuaa' });

var services = {};

// configure HANA
try {
	services = Object.assign(services, xsenv.getServices({ hana: {tag: "hana"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

// configure UAA
try {
	services = Object.assign(services, xsenv.getServices({ uaa: {tag: "xsuaa"} }));
} catch (err) {
	console.log("[WARN]", err.message);
}

passport.use(new JWTStrategy(services.uaa));

app.use(passport.initialize());
app.use(passport.authenticate('JWT', { session: false }));

app.get('/js/', function (req, res, next) {
	var output = "";
	var email = "";
	var scope = "";
	var attribute = "";

	var logger = req.loggingContext.getLogger('/Application/Main');
	//var tracer = req.loggingContext.getTracer(__filename);
	
	console.log('app.get starting...');
	logger.info('Test Log: Info ...');
	logger.warning('Test Log: Warning ...');
	logger.error('Test Log: Error ...');
	logger.fatal('Test Log: Fatal ...');

	//tracer.info('Processing GET request to /js/');
	
	output += 'Application user: ' + req.user.id + '<br>\n';

	output += 'Application user name: ' + req.user.name.givenName + ' ' + req.user.name.familyName + ' ' + '<br>\n';

	if (req.user.emails) {
		for (var i=0; i<req.user.emails.length; i++) {
			email = req.user.emails[i].value;
			output += 'Application user email: ' + email + '<br>\n';
		}
	}

	// output += 'Application user authInfo: ' + JSON.stringify(req.authInfo) + '<br>\n';

	if (req.authInfo.scopes) {
		for (var i=0; i<req.authInfo.scopes.length; i++) {
			scope = req.authInfo.scopes[i];
			output += 'Application user authorized scope: ' + scope + '<br>\n';
		}
	}

	if (req.authInfo.userAttributes) {
		for (var i=0; i<req.authInfo.userAttributes.length; i++) {
			attribute = req.authInfo.userAttributes[i];
			output += 'Application user authorized attribute: ' + attribute + '<br>\n';
		}
	}

	if (req.authInfo.checkLocalScope('create')) {
		output += 'This user is allowed to create things.<br>\n';
	}
	else {
		output += 'This user is NOT allowed to create things.<br>\n';
	}

	if (req.authInfo.checkLocalScope('view')) {
		output += 'This user is allowed to view things.<br>\n';
	}
	else {
		output += 'This user is NOT allowed to view things.<br>\n';
	}

	output += 'HANA user: ' + services.hana.user + '<br>\n';

	console.log('app.get ending...');

	res.send(output);
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
