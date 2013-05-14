
/*
 * node-runkeeper - Node.js Client for Runkeeper Health Graph API
 *
 * runkeeper.js:  Defines the HealthGraph class
 *
 * author: Mark Soper (masoper@gmail.com)
 */

var API = {
      "user":
        {"media_type": "application/vnd.com.runkeeper.User+json",
         "uri": "/user"},
      "profile":
        {"media_type": "application/vnd.com.runkeeper.Profile+json",
         "uri": "/profile"},
      "settings":
        {"media_type": "application/vnd.com.runkeeper.Settings+json",
         "uri": "/settings"},
      "fitnessActivityFeed":
        {"media_type": "application/vnd.com.runkeeper.FitnessActivityFeed+json",
         "uri": "/fitnessActivities"},
      "fitnessActivities":
        {"media_type": "application/vnd.com.runkeeper.FitnessActivity+json",
         "uri": "/fitnessActivities"},
      };

var HealthGraph = exports.HealthGraph = function(options) {

    this.client_id = options.client_id || null ;
    this.client_secret = options.client_secret || null;
    this.auth_url = options.auth_url || "https://runkeeper.com/apps/authorize";
    this.access_token_url = options.access_token_url || "https://runkeeper.com/apps/token";
    this.redirect_uri = options.redirect_uri || null;

    this.access_token = options.access_token || null;

    this.api_domain = options.api_domain || "api.runkeeper.com";

};



// Refer to Runkeeper OAuth docs: http://developer.runkeeper.com/healthgraph/registration-authorization
// Assumes Step 1 has been done, so you have the authorization_code
// getToken performs Step 2

HealthGraph.prototype.getNewToken = function (authorization_code, callback) {
    var request_params = {
      grant_type: "authorization_code",
      code: authorization_code,
      client_id: this.client_id,
      client_secret: this.client_secret,
      redirect_uri: this.redirect_uri
    };

    var paramlist = [];
    for (pk in request_params) {
      paramlist.push(pk + "=" + request_params[pk]);
    };
    var body_string = paramlist.join("&");

    var request_details = {
      method: "POST",
      headers: {'content-type' : 'application/x-www-form-urlencoded'},
      url: this.access_token_url,
      body: body_string,
      success: function(httpResponse) {
        console.log("POST " + request_details['url'] + "\n");
        console.log("RESPONSE\n" + httpResponse);
        console.log("BODY\n" + httpResponse.text);
        callback(JSON.parse(httpResponse.text)['access_token']);
      },
      error: function(httpResponse) {
        console.log("POST " + request_details['url'] + "\n");
        console.log("ERROR\n" + httpResponse.text);
        callback(JSON.parse(httpResponse.text)['access_token']);
      }
    };

    console.log(request_details['method'] + " " + request_details['uri'] + "\n body: \n" + body_string);

    Parse.Cloud.httpRequest(request_details);
};

for (func_name in API) {
    console.log("generating function HealthGraph." + func_name);

    HealthGraph.prototype[func_name] = (function(func_name) {
      return function(callback) {
        console.log("This method is -- " + func_name);
        var request_details = {
            method: API[func_name]['method'] || 'GET',
            headers: {'Accept': API[func_name]['media_type'],
                'Authorization' : 'Bearer ' + this.access_token},
            url: "https://" + this.api_domain + API[func_name]['uri'],
            success: function(httpResponse) {
              console.log("POST " + request_details['url'] + "\n");
              console.log("RESPONSE\n" + httpResponse);
              console.log("BODY\n" + httpResponse.text);
              callback(body);
            },
            error: function(httpResponse) {
              console.log("POST " + request_details['url'] + "\n");
              console.log("ERROR\n" + httpResponse.text);
              callback(body);
            }
        };

        Parse.Cloud.httpRequest(request_details);
      };
  })(func_name);
};

