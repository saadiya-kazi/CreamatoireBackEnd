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

var CONNECTION_URL ="mongodb+srv://saadiya:lF70OeVN5ZBnplug@boutique-tqqvs.mongodb.net/test?retryWrites=true&w=majority"
var DATABASE_NAME = "TESTDB";
var database, collection, collectionOrders;
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
       collectionOrders = database.collection("TESTORDERS")
     
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
    app.get("/getIngredientsList", function(req, res) {
      return collection.find({}).toArray(function(error, response) {
        console.log("response", response)
        return res.send(response)
    });
    });
  
   app.post("/createOrder", function(req, res) {
     console.log("reqBody", req.body)
     const object = {
       ingredientList:  req.body,
       status: "start preparing",
    
     }
      return collectionOrders.find({}).toArray(function(error, response) {
        console.log("response", response)
        if(response.length === 0) {
          object['orderNo'] = 1
          return collectionOrders.insertOne(object, function(error, responseSave) {
            return res.send({ success: true, message:"Data Saved Successfully", data:object })
          })
        } else {
          object
        }
        
    });
    });
});

  