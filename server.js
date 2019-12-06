//
// This is where the app starts, and sets things up
// We require the packages we need, body parser and express, and then set up body parser to accept
// JSON and URL encoded values. We then include the `routes.js` file, in which we define the API
// end-points we're going to be using, and we pass it the `app` variable. Lastly, we specify the
// port to listen to for requests. In this case, port 3000.
// 
var express = require("express");
var bodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;

var CONNECTION_URL ="mongodb+srv://saadiya:aCj617s3fbR4lUCq@boutique-tqqvs.mongodb.net/test?retryWrites=true&w=majority"
var DATABASE_NAME = "TESTDB";
var database, collection;
var app = express();
 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
 
var routes = require("./routes.js")(app);
 

var server = app.listen(3000, function () {
  console.log("Listening on port %s", server.address().port);
   MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("TESTCOLL");
     
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
    app.get("/getPickUpOrders",  function async(req, res) {
      console.log("app", app)
      collection.find((response)=>{
        console.log("Received GET", response);
      });
      
      res.send("<h1>REST API</h1><p>Oh, hi! There's not much to see here - view the code instead</p><script src=\"https://button.glitch.me/button.js\" data-style=\"glitch\"></script><div class=\"glitchButton\" style=\"position:fixed;top:20px;right:20px;\"></div>");
    });
});

  