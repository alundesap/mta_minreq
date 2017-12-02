/*eslint no-console: 0*/
"use strict";

var express = require('express');
var xsenv = require('@sap/xsenv');
var passport = require('passport');
//var xssec = require("@sap/xssec");
var JWTStrategy = require('@sap/xssec').JWTStrategy;

var app = express();

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

	res.send(output);
});

var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('myapp listening on port ' + port);
});
